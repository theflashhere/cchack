import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/Dashboard.css";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { name: "Send Tax Reports to Accountant", urgency: "Urgent" },
    { name: "Activate Business MasterCard", urgency: "Non-Urgent" },
  ]);

  const [activities, setActivities] = useState([
    { name: "Fraud Alert", amount: "$43.20" },
    { name: "Bank Loan Approved", amount: "$100,000" },
  ]);

  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [netIncome, setNetIncome] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("csvData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalRevenue = 0;
      let totalNetIncome = 0;

      parsedData.forEach((row) => {
        totalIncome += row.Income || 0;
        totalExpenses += row.Expenses || 0;
        totalRevenue += row.Revenue || 0;
        totalNetIncome += row["Net Income"] || 0;
      });

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setRevenue(totalRevenue);
      setNetIncome(totalNetIncome);
    }
  }, []);

  // Line Chart Data for Revenue vs. Expenses
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [revenue * 0.8, revenue * 0.9, revenue, revenue * 1.1, revenue * 1.2, revenue * 1.3],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.3)",
        fill: true,
        tension: 0.4,
        pointBorderWidth: 2,
      },
      {
        label: "Expenses",
        data: [expenses * 1.2, expenses, expenses * 0.9, expenses * 0.8, expenses * 0.7, expenses * 0.6],
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.3)",
        fill: true,
        tension: 0.4,
        pointBorderWidth: 2,
      },
    ],
  };

  // Pie Chart Data for Expense Breakdown
  const pieChartData = {
    labels: ["Marketing", "Operations", "Salaries", "Miscellaneous"],
    datasets: [
      {
        data: [
          expenses * 0.3,
          expenses * 0.4,
          expenses * 0.2,
          expenses * 0.1,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
        hoverOffset: 5,
      },
    ],
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Goals</h2>
        <button>Short Term</button>
        <button>Long Term</button>
        <button>Add Widget</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* My Tasks */}
        <div className="card">
          <h3>My Tasks</h3>
          <div className="tasks">
            {tasks.map((task, index) => (
              <div key={index} className="task">
                <span>{task.name}</span>
                <span style={{ color: task.urgency === "Urgent" ? "red" : "green" }}>{task.urgency}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setTasks([...tasks, { name: "New Task", urgency: "Non-Urgent" }])}>Add Task</button>
        </div>

        {/* Revenue vs. Expenses Chart */}
        <div className="card">
          <h3>Revenue vs. Expenses</h3>
          <div className="chart-container">
            <Line data={lineChartData} />
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="card">
          <h3>Expense Breakdown</h3>
          <div className="chart-container">
            <Pie data={pieChartData} />
          </div>
        </div>

        {/* Revenue & Expenses */}
        <div className="card">
          <h3>Revenue & Expenses</h3>
          <p>Total Income: <span>${income.toFixed(2)}</span></p>
          <p>Total Expenses: <span>${expenses.toFixed(2)}</span></p>
        </div>

        {/* Active Cards */}
        <div className="card">
          <h3>Active Cards</h3>
          <p>**** 2719</p>
          <button>Send Funds</button>
          <button>Lock Card</button>
        </div>

        {/* Annual Profits */}
        <div className="card">
          <h3>Annual Profits</h3>
          <p>Revenue: <span>${revenue.toFixed(2)}</span></p>
          <p>Net Income: <span>${netIncome.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
