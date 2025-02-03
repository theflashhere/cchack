import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import FinancialInput from "./components/FinancialInput";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/financial-input" element={<FinancialInput />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
