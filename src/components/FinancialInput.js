import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse"; // Install this package
import "../styles/FinancialInput.css";

const FinancialInput = () => {
  const navigate = useNavigate();
  const [clientType, setClientType] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeStrength, setEmployeeStrength] = useState("");
  const [csvData, setCsvData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Parse as key-value pairs
      dynamicTyping: true, // Convert strings to numbers where applicable
      complete: (result) => {
        setCsvData(result.data);
        localStorage.setItem("csvData", JSON.stringify(result.data)); // Store in localStorage
      },
    });
  };

  const handleSubmit = () => {
    if (clientType && industry && csvData) {
      localStorage.setItem("clientType", clientType);
      localStorage.setItem("industry", industry);
      localStorage.setItem("employeeStrength", employeeStrength);

      navigate("/dashboard");
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="form-container">
      <h1>Enter Financial Details</h1>
      <label>Client Type:</label>
      <select onChange={(e) => setClientType(e.target.value)}>
        <option value="">Select client type</option>
        <option value="individual">Individual</option>
        <option value="small">Small Scale Business</option>
        <option value="business">Business</option>
      </select>

      <label>Industry Type:</label>
      <select onChange={(e) => setIndustry(e.target.value)}>
        <option value="">Select an industry</option>
        <option value="technology">Technology</option>
      </select>

      {clientType === "small" || clientType === "business" ? (
        <>
          <label>Employee Strength:</label>
          <input type="number" placeholder="Enter employee strength" onChange={(e) => setEmployeeStrength(e.target.value)} />
        </>
      ) : null}

      <label>Upload CSV File:</label>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FinancialInput;
