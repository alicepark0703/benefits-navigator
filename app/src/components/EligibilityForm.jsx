import { useState } from 'react';

const STEPS = [
  { title: "Where do you live?", sub: "We use this to find programs in your area." },
  { title: "Who's in your household?", sub: "Tell us about the people you live with." },
  { title: "Income & assets", sub: "All amounts are kept private and secure." },
  { title: "Employment & education", sub: "Your current work and school situation." },
  { title: "Housing", sub: "Where and how you currently live." },
  { title: "Additional details", sub: "A few more things that may affect eligibility." },
];
const CITIZENSHIP_OPTIONS = [
    { value: "", label: "Select citizenship status" },
    { value: "citizen", label: "U.S. Citizen" },
    { value: "nonCitizen", label: "Non-Citizen" },
    { value: "undocumented", label: "Undocumented" },
];

const EMPLOYMENT_OPTIONS = [
    { value: "", label: "Select employment status" },
    { value: "fulltime", label: "Full-Time" },
    { value: "parttime", label: "Part-Time" },
    { value: "unemployed", label: "Unemployed" },
    { value: "selfemployed", label: "Self-Employed" },
    { value: "retired", label: "Retired" },
];


const STUDENT_GROUP_OPTIONS = [
    { value: "", label: "Select student group" },
    { value: "precollege", label: "Pre-College Student" },
    { value: "undergrad", label: "Undergraduate Student" },
    { value: "grad", label: "Graduate Student" },
    { value: "postgrad", label: "Post-Graduate Student" },
    { value: "other", label: "Other Student" },
];

const HOUSING_OPTIONS = [
    { value: "", label: "Select housing status" },
    { value: "rent", label: "Rent" },
    { value: "own", label: "Own" },
    { value: "homeless", label: "Homeless" },
    { value: "other", label: "Other" },
];

function ChipGroup({options, field, value, onChange}) {
    return(
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type = "button"
                    onClick={() => onChange(field, opt.value)}
                    style = {{
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: '1px solid ${value === opt.value ? "#7d4e57" : "#ccc"}', 
                        background: value === opt.value ? "#7d4e57" : "transparent",
                        color: value === opt.value ? "#fff" : "inherit",
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.15s",
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </div>

    );
}

function Toggle({field, value, onChange }) {
    return (
        <div style={{display: "flex", border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", width: "fit-content"}}>
            {["yes", "no"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(field, opt)}
          style={{
            padding: "9px 28px",
            fontSize: 14,
            border: "none",
            background: value === opt ? "#7d4e57" : "transparent",
            color: value === opt ? "#fff" : "inherit",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
            {opt === "yes" ? "Yes" : "No"}
        </button>
        ))}
        </div>
        
    );
}

function MoneyInput({ field, value, onChange, placeholder = "0" }) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", maxWidth: 240 }}>
      <span style={{ position: "absolute", left: 12, color: "#888", fontSize: 15, pointerEvents: "none" }}>$</span>
      <input
        type="number"
        min="0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        style={{
          paddingLeft: 28,
          paddingRight: 12,
          paddingTop: 10,
          paddingBottom: 10,
          border: "1px solid #ccc",
          borderRadius: 8,
          fontSize: 15,
          width: "100%",
          outline: "none",
          background: "transparent",
          color: "inherit",
        }}
      />
    </div>
  );
}

function NumInput({ field, value, onChange, placeholder = "0", min = 0 }) {
  return (
    <input
      type="number"
      min={min}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      style={{
        padding: "10px 12px",
        border: "1px solid #ccc",
        borderRadius: 8,
        fontSize: 15,
        maxWidth: 160,
        width: "100%",
        outline: "none",
        background: "transparent",
        color: "inherit",
      }}
    />
  );
}

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: 13, color: "#888", marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function Conditional({ children }) {
  return (
    <div style={{ borderLeft: "2px solid #f5eef0", paddingLeft: "1rem", marginTop: "1rem" }}>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "0.5px solid #eee", margin: "1.25rem 0" }} />;
}

export default function EligibilityForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        state: "NY",
        county: "", // or zip code ... ?
        citizenshipStatus: "",
        householdSize: "", // integer
        numAdults: "", // integer
        numChildren: "", // integer
        pregnancyStatus: "",
        annualIncome: "", // or monthly income? (only number $)
        assets: "", 
        employmentStatus: "",
        hoursPerWeek: "",
        studentStatus: "",
        studentGroup: "", //if yes to student status
        housingStatus: "",
        monthlyRent: "", // if rent and in $ (only number)
        monthlyUtilities: "", // if rent and in $ (only number)
        disabilityStatus: "",
        veteranStatus: "",
        ageOver60: "",
        receivesSSI: "",
    });
    const [step, setStep] = useState(0);
    function handleChange(field, value) {
        setFormData((prev) => ({...prev, [field]: value }));
    }

    function handleNext() {
        if (step === 0 && (!formData.county || !formData.citizenshipStatus)) {
            alert("Please fill out all fields before continuing.");
            return;
        }
        if (step === 1 && (!formData.householdSize || !formData.pregnancyStatus)) {
            alert("Please fill out all fields before continuing.");
            return;
        }
        if (step === 2 && (!formData.annualIncome || !formData.assets)) {
            alert("Please fill out all fields before continuing.");
            return;
        }
        if (step === 3 && (!formData.employmentStatus || !formData.studentStatus)) {
            alert("Please fill out all fields before continuing.");
            return;
        }
        if (step === 4 && !formData.housingStatus) {
            alert("Please fill out all fields before continuing.");
            return;
        }
        setStep((s) => s + 1);
    }


    function handleSubmit(e) {
        e.preventDefault(); // prevnt page refresh on submit

        const cleanedData = { // new object with form's values
            state: formData.state,
            county: formData.county,
            citizenshipStatus: formData.citizenshipStatus,
            householdSize: parseInt(formData.householdSize, 10),
            numAdults: parseInt(formData.numAdults, 10),
            numChildren: parseInt(formData.numChildren, 10),
            pregnancyStatus: formData.pregnancyStatus,
            annualIncome: parseFloat(formData.annualIncome),
            assets: parseFloat(formData.assets),
            employmentStatus: formData.employmentStatus,
            hoursPerWeek: parseFloat(formData.hoursPerWeek),
            studentStatus: formData.studentStatus,
            studentGroup: formData.studentGroup,
            housingStatus: formData.housingStatus,
            monthlyRent: parseFloat(formData.monthlyRent),
            monthlyUtilities: parseFloat(formData.monthlyUtilities),
            disabilityStatus: formData.disabilityStatus,
            veteranStatus: formData.veteranStatus,
            ageOver60: formData.ageOver60,
            receivesSSI: formData.receivesSSI,
        };

        onSubmit(cleanedData); // pass cleaned data to parent component's onSubmit handler

    }

    const isLastStep = step === STEPS.length - 1;
    const showHours = ["fulltime", "parttime", "selfemployed"].includes(formData.employmentStatus);
    
    return (
        <form onSubmit={handleSubmit} style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto", padding: "1.5rem 0"}}>
            {/* Step dots */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
                {STEPS.map((_, i) => (
                <div
                    key={i}
                    style={{
                    height: 10,
                    width: i === step ? 28 : 10,
                    borderRadius: i === step ? 8 : "50%",
                    background: i === step ? "#7d4e57" : i < step ? "#364156" : "#ddd",
                    transition: "all 0.2s",
                    }}
                />
                ))}      
                <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>Step {step + 1} of {STEPS.length}

            </span>
                </div>
                {/* Step heading */}
                <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{STEPS[step].title}</h2>
                <p style={{ fontSize: 14, color: "#888", marginBottom: "1.5rem" }}>{STEPS[step].sub}</p>

                {/* Step 0 — Location */}
                {step === 0 && (
                    <>
                    <FieldGroup label="State">
                        <div style={{ display: "flex" }}>
                        <div style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid #7d4e57", background: "#7d4e57", color: "#fff", fontSize: 14 }}>
                            New York
                        </div>
                        </div>
                    </FieldGroup>
                    <FieldGroup label="ZIP code">
                        <input
                        type="text"
                        placeholder="e.g. 10001"
                        value={formData.county}
                        onChange={(e) => handleChange("county", e.target.value)}
                        style={{ padding: "10px 12px", border: "1px solid #ccc", borderRadius: 8, fontSize: 15, width: "100%", maxWidth: 240, outline: "none", background: "transparent", color: "inherit" }}
                        />
                    </FieldGroup>
                    <Divider />
                    <FieldGroup label="Citizenship status">
                        <ChipGroup options={CITIZENSHIP_OPTIONS} field="citizenshipStatus" value={formData.citizenshipStatus} onChange={handleChange} />
                    </FieldGroup>
                    </>
                )}

                {/* Step 1 — Household */}
                {step === 1 && (
                    <>
                    <FieldGroup label="Total household size">
                        <NumInput field="householdSize" value={formData.householdSize} onChange={handleChange} min={1} placeholder="e.g. 4" />
                    </FieldGroup>
                    <div style={{ display: "flex", gap: 16, marginBottom: "1.25rem" }}>
                        <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6 }}>Adults</label>
                        <NumInput field="numAdults" value={formData.numAdults} onChange={handleChange} placeholder="0" />
                        </div>
                        <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6 }}>Children</label>
                        <NumInput field="numChildren" value={formData.numChildren} onChange={handleChange} placeholder="0" />
                        </div>
                    </div>
                    <Divider />
                    <FieldGroup label="Is anyone in the household pregnant?">
                        <Toggle field="pregnancyStatus" value={formData.pregnancyStatus} onChange={handleChange} />
                    </FieldGroup>
                    </>
                )}

                {/* Step 2 — Income & assets */}
                {step === 2 && (
                    <>
                    <FieldGroup label="Annual household income">
                        <MoneyInput field="annualIncome" value={formData.annualIncome} onChange={handleChange} placeholder="e.g. 40000" />
                    </FieldGroup>
                    <FieldGroup label="Total household assets">
                        <MoneyInput field="assets" value={formData.assets} onChange={handleChange} placeholder="e.g. 5000" />
                    </FieldGroup>
                    </>
                )}

                {/* Step 3 — Employment & education */}
                {step === 3 && (
                    <>
                    <FieldGroup label="Employment status">
                        <ChipGroup options={EMPLOYMENT_OPTIONS} field="employmentStatus" value={formData.employmentStatus} onChange={handleChange} />
                    </FieldGroup>
                    {showHours && (
                        <Conditional>
                        <FieldGroup label="Hours worked per week">
                            <NumInput field="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleChange} placeholder="e.g. 40" />
                        </FieldGroup>
                        </Conditional>
                    )}
                    <Divider />
                    <FieldGroup label="Are you a student?">
                        <Toggle field="studentStatus" value={formData.studentStatus} onChange={handleChange} />
                    </FieldGroup>
                    {formData.studentStatus === "yes" && (
                        <Conditional>
                        <FieldGroup label="Student type">
                            <ChipGroup options={STUDENT_GROUP_OPTIONS} field="studentGroup" value={formData.studentGroup} onChange={handleChange} />
                        </FieldGroup>
                        </Conditional>
                    )}
                    </>
                )}

                {/* Step 4 — Housing */}
                {step === 4 && (
                    <>
                    <FieldGroup label="Housing status">
                        <ChipGroup options={HOUSING_OPTIONS} field="housingStatus" value={formData.housingStatus} onChange={handleChange} />
                    </FieldGroup>
                    {formData.housingStatus === "rent" && (
                        <Conditional>
                        <FieldGroup label="Monthly rent">
                            <MoneyInput field="monthlyRent" value={formData.monthlyRent} onChange={handleChange} placeholder="e.g. 1200" />
                        </FieldGroup>
                        <FieldGroup label="Monthly utilities">
                            <MoneyInput field="monthlyUtilities" value={formData.monthlyUtilities} onChange={handleChange} placeholder="e.g. 150" />
                        </FieldGroup>
                        </Conditional>
                    )}
                    </>
                )}

                {/* Step 5 — Additional */}
                {step === 5 && (
                    <>
                    <FieldGroup label="Do you have a disability?">
                        <Toggle field="disabilityStatus" value={formData.disabilityStatus} onChange={handleChange} />
                    </FieldGroup>
                    <FieldGroup label="Are you a veteran?">
                        <Toggle field="veteranStatus" value={formData.veteranStatus} onChange={handleChange} />
                    </FieldGroup>
                    <FieldGroup label="Are you 60 or older?">
                        <Toggle field="ageOver60" value={formData.ageOver60} onChange={handleChange} />
                    </FieldGroup>
                    <FieldGroup label="Do you currently receive SSI?">
                        <Toggle field="receivesSSI" value={formData.receivesSSI} onChange={handleChange} />
                    </FieldGroup>
                    </>
                )}

                {/* Nav buttons */}
                <div style={{ display: "flex", gap: 12, marginTop: "2rem" }}>
                    {step > 0 && (
                    <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        style={{ padding: "11px 24px", borderRadius: 8, border: "1px solid #ccc", background: "transparent", fontSize: 15, cursor: "pointer", color: "inherit" }}
                    >
                        Back
                    </button>
                    )}
                    {isLastStep ? (
                    <button
                        type="submit"
                        style={{ padding: "11px 28px", borderRadius: 8, border: "none", background: "#7d4e57", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                    >
                        Check eligibility
                    </button>
                    ) : (
                    <button
                        type="button"
                        onClick={handleNext}
                        style={{ padding: "11px 28px", borderRadius: 8, border: "none", background: "#7d4e57", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer" }}
                    >
                        Next
                    </button>
                    )}
                </div>
                </form>
            );
            }
