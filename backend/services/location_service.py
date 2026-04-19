"""Location lookup service for nearby NY benefits offices."""

from __future__ import annotations

import json
import math
from functools import lru_cache

import config
from models.schemas import OfficeLocation

# Approximate geographic centers by 3-digit ZIP prefix (first 3 of 5-digit ZIP).
# Covers 100–149, which includes nearly all NY addresses using the standard 1xxxx–14xxx scheme.
# Used when the exact ZIP is not in ny_zip_centroids.json (seed file is intentionally small).
_NY_ZIP_PREFIX_CENTROIDS: dict[str, tuple[float, float]] = {
    "100": (40.7506, -73.9972),
    "101": (40.7506, -73.9972),
    "102": (40.7144, -74.006),
    "103": (40.6318, -74.0912),
    "104": (40.8501, -73.8662),
    "105": (41.033, -73.7629),
    "106": (41.0322, -73.7629),
    "107": (40.9312, -73.8987),
    "108": (40.9257, -73.7914),
    "109": (41.3721, -74.2691),
    "110": (40.7408, -73.6894),
    "111": (40.7447, -73.9485),
    "112": (40.6943, -73.9918),
    "113": (40.7614, -73.8312),
    "114": (40.6782, -73.7952),
    "115": (40.6574, -73.5832),
    "116": (40.5928, -73.7963),
    "117": (40.8847, -73.1707),
    "118": (40.7589, -73.5211),
    "119": (40.937, -72.2923),
    "120": (42.85, -73.9245),
    "121": (42.6526, -73.7562),
    "122": (42.6526, -73.7562),
    "123": (42.8142, -73.9396),
    "124": (41.927, -74.019),
    "125": (41.7004, -73.921),
    "126": (41.5382, -73.9615),
    "127": (41.4459, -74.4228),
    "128": (43.3106, -73.6448),
    "129": (44.6995, -73.4529),
    "130": (43.0481, -76.1474),
    "131": (43.0357, -76.1375),
    "132": (43.0481, -76.1474),
    "133": (43.1008, -75.2327),
    "134": (43.2128, -75.4557),
    "135": (43.9748, -75.9108),
    "136": (44.3386, -75.9208),
    "137": (42.0984, -75.918),
    "138": (42.0984, -75.918),
    "139": (42.0984, -75.918),
    "140": (42.8864, -78.8784),
    "141": (43.1707, -78.6903),
    "142": (42.8864, -78.8784),
    "143": (43.1707, -79.0441),
    "144": (43.1566, -77.6088),
    "145": (43.1566, -77.6088),
    "146": (43.1566, -77.6088),
    "147": (42.1292, -79.0511),
    "148": (42.1497, -77.0621),
    "149": (42.0898, -76.8077),
    # Less common NY prefixes (still issued as NY addresses)
    "005": (40.8176, -73.0662),
    "063": (41.0359, -72.1831),
}

# Coarse fallback when a 3-digit prefix is missing (rare); covers standard NY 10xxxx–14xxxx mail routes.
_NY_ZIP_FIRST_TWO_CENTROIDS: dict[str, tuple[float, float]] = {
    "10": (40.72, -73.95),
    "11": (40.75, -73.4),
    "12": (42.65, -73.78),
    "13": (43.04, -76.12),
    "14": (42.9, -78.85),
}


class LocationService:
    """Resolve user ZIP codes and return nearby offices sorted by distance."""

    def __init__(self) -> None:
        config.ensure_data_dirs()
        self._offices = self._load_offices()
        self._zip_centroids = self._load_zip_centroids()

    @staticmethod
    @lru_cache(maxsize=1)
    def _load_offices() -> list[dict[str, object]]:
        if not config.LOCATIONS_PATH.exists():
            return []
        raw = json.loads(config.LOCATIONS_PATH.read_text(encoding="utf-8"))
        offices = raw.get("offices", [])
        if isinstance(offices, list):
            return offices
        return []

    @staticmethod
    @lru_cache(maxsize=1)
    def _load_zip_centroids() -> dict[str, dict[str, float]]:
        if not config.NY_ZIP_CENTROIDS_PATH.exists():
            return {}
        raw = json.loads(config.NY_ZIP_CENTROIDS_PATH.read_text(encoding="utf-8"))
        if isinstance(raw, dict):
            return raw
        return {}

    @staticmethod
    def _normalize_zip(zip_code: str) -> str:
        digits = "".join(ch for ch in zip_code if ch.isdigit())
        return digits[:5]

    @staticmethod
    def _haversine_miles(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        earth_radius_miles = 3958.8
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return earth_radius_miles * c

    def _centroid_from_office_zip(self, normalized_zip: str) -> tuple[float, float] | None:
        """If user ZIP matches a known office ZIP, use that office coordinates as the origin."""
        if len(normalized_zip) != 5:
            return None
        for office in self._offices:
            oz = office.get("zip_code")
            if not oz:
                continue
            if self._normalize_zip(str(oz)) == normalized_zip:
                return float(office["lat"]), float(office["lng"])
        return None

    def _centroid_from_prefix(self, normalized_zip: str) -> tuple[float, float] | None:
        """Approximate user location from ZIP digits (3-digit prefix, then 2-digit NY region)."""
        if len(normalized_zip) < 2:
            return None
        if len(normalized_zip) >= 3:
            p3 = normalized_zip[:3]
            hit = _NY_ZIP_PREFIX_CENTROIDS.get(p3)
            if hit:
                return hit
        p2 = normalized_zip[:2]
        return _NY_ZIP_FIRST_TWO_CENTROIDS.get(p2)

    def get_zip_centroid(self, zip_code: str) -> tuple[float, float] | None:
        normalized_zip = self._normalize_zip(zip_code)
        if len(normalized_zip) != 5:
            return None

        centroid = self._zip_centroids.get(normalized_zip)
        if centroid:
            return float(centroid["lat"]), float(centroid["lng"])

        from_office = self._centroid_from_office_zip(normalized_zip)
        if from_office:
            return from_office

        return self._centroid_from_prefix(normalized_zip)

    def find_nearby_offices(
        self,
        zip_code: str,
        *,
        program: str | None = None,
        limit: int = 10,
    ) -> list[OfficeLocation]:
        origin = self.get_zip_centroid(zip_code)
        if origin is None:
            return []

        origin_lat, origin_lng = origin
        program_filter = program.strip().lower() if program else None

        candidates: list[OfficeLocation] = []
        for office in self._offices:
            office_programs = office.get("programs", [])
            if not isinstance(office_programs, list):
                office_programs = []

            if program_filter and not any(
                program_filter in str(program_name).lower()
                for program_name in office_programs
            ):
                continue

            lat = float(office["lat"])
            lng = float(office["lng"])
            distance = self._haversine_miles(origin_lat, origin_lng, lat, lng)

            candidates.append(
                OfficeLocation(
                    id=str(office["id"]),
                    name=str(office["name"]),
                    address=str(office["address"]),
                    lat=lat,
                    lng=lng,
                    phone=str(office["phone"]) if office.get("phone") else None,
                    programs=[str(item) for item in office_programs],
                    hours=str(office["hours"]) if office.get("hours") else None,
                    county=str(office["county"]),
                    zip_code=str(office["zip_code"]) if office.get("zip_code") else None,
                    distance_miles=round(distance, 1),
                )
            )

        candidates.sort(
            key=lambda office: office.distance_miles
            if office.distance_miles is not None
            else float("inf")
        )
        return candidates[: max(limit, 1)]
