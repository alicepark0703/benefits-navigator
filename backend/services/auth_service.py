from __future__ import annotations

import hashlib
import json
import sqlite3
from pathlib import Path
from typing import Any, Literal

from fastapi import HTTPException
from passlib.context import CryptContext

DB_PATH = Path("data/app.db")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _password_digest(plain: str) -> str:
    """Fixed-length secret for bcrypt (72-byte limit on raw passwords)."""
    return hashlib.sha256(plain.encode("utf-8")).hexdigest()


def _hash_password(plain: str) -> str:
    return pwd_context.hash(_password_digest(plain))


def _check_password(plain: str, stored_hash: str) -> Literal["ok", "ok_legacy", "fail"]:
    if pwd_context.verify(_password_digest(plain), stored_hash):
        return "ok"
    if len(plain.encode("utf-8")) <= 72 and pwd_context.verify(plain, stored_hash):
        return "ok_legacy"
    return "fail"


class AuthService:
    def __init__(self) -> None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _get_conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._get_conn() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL
                )
                """
            )

            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS eligibility_profiles (
                    user_id INTEGER PRIMARY KEY,
                    eligibility_data TEXT,
                    selected_programs TEXT,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )
                """
            )

            conn.commit()

    
    # SIGNUP
  
    def signup(self, full_name: str, email: str, password: str) -> dict[str, Any]:
        password_hash = _hash_password(password)

        try:
            with self._get_conn() as conn:
                cursor = conn.execute(
                    """
                    INSERT INTO users (full_name, email, password_hash)
                    VALUES (?, ?, ?)
                    """,
                    (full_name, email.lower(), password_hash),
                )
                user_id = cursor.lastrowid
                conn.commit()
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=400, detail="Email already exists.")

        return {
            "message": "Signup successful",
            "user": {
                "id": user_id,
                "full_name": full_name,
                "email": email.lower(),
            },
            "has_eligibility_profile": False,
            "eligibility_data": None,
            "selected_programs": [],
        }

   
    # LOGIN
    
    def login(self, email: str, password: str) -> dict[str, Any]:
        with self._get_conn() as conn:
            user = conn.execute(
                """
                SELECT id, full_name, email, password_hash
                FROM users
                WHERE email = ?
                """,
                (email.lower(),),
            ).fetchone()

            if user is None:
                raise HTTPException(status_code=401, detail="Invalid email or password.")

            match = _check_password(password, user["password_hash"])
            if match == "fail":
                raise HTTPException(status_code=401, detail="Invalid email or password.")

            if match == "ok_legacy":
                new_hash = _hash_password(password)
                conn.execute(
                    "UPDATE users SET password_hash = ? WHERE id = ?",
                    (new_hash, user["id"]),
                )
                conn.commit()

            profile = conn.execute(
                """
                SELECT eligibility_data, selected_programs
                FROM eligibility_profiles
                WHERE user_id = ?
                """,
                (user["id"],),
            ).fetchone()

        eligibility_data = None
        selected_programs = []
        has_profile = False

        if profile:
            has_profile = True
            eligibility_data = json.loads(profile["eligibility_data"]) if profile["eligibility_data"] else None
            selected_programs = json.loads(profile["selected_programs"]) if profile["selected_programs"] else []

        return {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "full_name": user["full_name"],
                "email": user["email"],
            },
            "has_eligibility_profile": has_profile,
            "eligibility_data": eligibility_data,
            "selected_programs": selected_programs,
        }

    
    # SAVE ELIGIBILITY
    
    def save_eligibility_profile(
        self,
        user_id: int,
        eligibility_data: dict[str, Any],
        selected_programs: list[str],
    ) -> None:
        with self._get_conn() as conn:
            conn.execute(
                """
                INSERT INTO eligibility_profiles (user_id, eligibility_data, selected_programs)
                VALUES (?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    eligibility_data = excluded.eligibility_data,
                    selected_programs = excluded.selected_programs
                """,
                (
                    user_id,
                    json.dumps(eligibility_data),
                    json.dumps(selected_programs),
                ),
            )
            conn.commit()