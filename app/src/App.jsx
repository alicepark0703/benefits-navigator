import { useState } from "react";
import EligibilityForm from "./components/EligibilityForm";
import Results from "./components/Results";

function App() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(data) {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: "What benefits am I eligible for?",
                    user_profile: data,
                }),
            });
            const result = await response.json();
            setResults(result);
        } catch (error) {
            console.error("Error fetching results:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Checking eligibility...</p>;
    if (results) return <Results data={results} />;
    return <EligibilityForm onSubmit={handleSubmit} />;
}

export default App;