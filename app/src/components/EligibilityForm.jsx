import { useState } from 'react';

export default function EligibilityForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        state: "NY",
        county: "", // or zip code ... ?
        citizenshipStatus: "US citizen | legal resident | undocumented",
        householdSize: "", // integer
        numAdults: "", // integer
        numChildren: "", // integer
        pregnancyStatus: "",
        annualIncome: "", // or monthly income? (only number $)
        assets: "", 
        employmentStatus: "full-time | part-time | unemployed | self-employed | retired",
        hoursPerWeek: "",
        studentStatus: "Yes | No",
        studentGroup: "undergraduate | graduate | post-grad | other", //if yes to student status
        housingStatus: "rent | own | homeless | other",
        monthlyRent: "", // if rent and in $ (only number)
        montlyUtilities: "", // if rent and in $ (only number)
        disabilityStatus: "Yes | No",
        veteranStatus: "Yes | No",
        ageOver60: "Yes | No",
        receivesSSI: "Yes | No",
    });

    function handleChange(e) { // keeping formDta state in sync as user types and selects things
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault(); // prevnt page refresh on submit

        const cleanedData = { // new object with form's values
            householdSize: parseInt(formData.householdSize),
            numAdults: parseInt(formData.numAdults),
            numChildren: parseInt(formData.numChildren),
            annualIncome: parseFloat(formData.annualIncome),

        }
    }
        
    
}