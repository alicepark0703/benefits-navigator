import EligibilityForm from "./components/EligibilityForm";

function App() {
    function handleSubmit(data) {
        console.log(data); // or pass to your eligibility logic
    }


return (
    <div>
        <EligibilityForm onSubmit={handleSubmit} />
    </div>
);

}

export default App;
