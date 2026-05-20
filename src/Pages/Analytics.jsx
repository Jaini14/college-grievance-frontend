// Analytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Analytics.css";
import logo from "../assets/logo.png";

const Analytics = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await axios.get(
          " http://127.0.0.1:8000/api/analytics/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    };

    fetchAnalytics();
  }, [token]);

  if (!data) return <h2>Loading...</h2>;

  const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

  // ✅ RESOLUTION RATE
  const total = data.total;
  const resolved =
    data.status_distribution.find(s => s.status === "RESOLVED")?.count || 0;

  const resolutionRate = total
    ? ((resolved / total) * 100).toFixed(1)
    : 0;

  // ✅ STATUS PIE
  const statusChart = {
    labels: data.status_distribution.map(s => s.status),
    datasets: [{
      data: data.status_distribution.map(s => s.count),
      backgroundColor: colors,
    }],
  };

  // ✅ MONTHLY TREND
  const monthlyChart = {
    labels: data.monthly_trend.map(m =>
      new Date(m.month).toLocaleDateString()
    ),
    datasets: [{
      label: "Monthly Trend",
      data: data.monthly_trend.map(m => m.count),
      borderColor: "#4F46E5",
      fill: false,
    }],
  };

  // ✅ STATUS BAR
  const statusBar = {
    labels: data.status_distribution.map(s => s.status),
    datasets: [{
      label: "Status Count",
      data: data.status_distribution.map(s => s.count),
      backgroundColor: "#22C55E",
    }],
  };

  // 🔥 NEW: CATEGORY CHART (MAIN FEATURE)
  const categoryChart = {
    labels: data.category_wise.map(c => c.category),
    datasets: [{
      label: "Issues",
      data: data.category_wise.map(c => c.count),
      backgroundColor: "#F59E0B",
    }],
  };

  return (
    <div className="dashboard">

      <div className="header">
        <img src={logo} alt="LDCE" />
        <div>
          <h2>L.D. College of Engineering</h2>
          <p>Ahmedabad • Department Analytics</p>
        </div>
      </div>

      <div className="filter-bar">
        <select>
          <option>All Time</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* ✅ KPI CARDS */}
      <div className="cards">
        <div className="card">Total: {total}</div>
        <div className="card">
          Pending: {data.status_distribution.find(s => s.status==="NEW")?.count || 0}
        </div>
        <div className="card">
          In Progress: {data.status_distribution.find(s => s.status==="IN_PROGRESS")?.count || 0}
        </div>
        <div className="card">Resolved: {resolved}</div>
        <div className="card">Resolution Rate: {resolutionRate}%</div>
      </div>

      {/* ✅ CHART GRID */}
      <div className="grid">
         
        <div className="box">
          <h4>Status Distribution</h4>
          <div className="chart-container">
            <Pie data={statusChart} options={{ maintainAspectRatio: false, responsive: true  }} />
          </div>
        </div>
        
        <div className="box">
          <h4>Monthly Trend</h4>
          <div className="chart-container">
            <Line data={monthlyChart} options={{ maintainAspectRatio: false , responsive: true }} />
          </div>
        </div>

        <div className="box">
          <h4>Category Wise Issues</h4>
          <div className="chart-container">
            <Bar data={categoryChart} options={{ maintainAspectRatio: false ,  responsive: true }} />
          </div>
        </div>

        <div className="box">
          <h4>Status Comparison</h4>
          <div className="chart-container">
            <Bar data={statusBar} options={{ maintainAspectRatio: false ,  responsive: true  }} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import "chart.js/auto";
// import "./Analytics.css"; // ✅ IMPORTED

// const Analytics = () => {
//   const [data, setData] = useState(null);
//   const token = localStorage.getItem("access");

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         if (!token) {
//           window.location.href = "/login";
//           return;
//         }

//         const res = await axios.get(
//           "http://127.0.0.1:8000/api/analytics/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setData(res.data);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           localStorage.clear();
//           window.location.href = "/login";
//         }
//       }
//     };

//     fetchAnalytics();
//   }, [token]);

//   if (!data) return <h2>Loading...</h2>;

//   // STATUS PIE
//   const statusChart = {
//     labels: data.status_distribution.map(s => s.status),
//     datasets: [
//       {
//         data: data.status_distribution.map(s => s.count),
//       },
//     ],
//   };

//   // MONTHLY LINE
//   const monthlyChart = {
//     labels: data.monthly_trend.map(m =>
//       new Date(m.month).toLocaleDateString()
//     ),
//     datasets: [
//       {
//         label: "Monthly Complaints",
//         data: data.monthly_trend.map(m => m.count),
//       },
//     ],
//   };

//   return (
//     <div style={{ padding: "20px" }}>
      
//       {/* HEADER */}
//       <h1 style={{ marginBottom: "10px" }}>📊 Analytics Dashboard</h1>
//       <p style={{ color: "gray" }}>
//         Real-time grievance insights for decision making
//       </p>

//       <h2>Department: {data.department}</h2>

//       {/* OPTIONAL FILTER */}
//       <select style={{ marginTop: "10px" }}>
//         <option>All Time</option>
//         <option>This Month</option>
//         <option>Last 3 Months</option>
//       </select>

//       {/* CARDS */}
//       <div className="cards-container">
//         <div className="card">Total: {data.total}</div>
//         <div className="card">
//           Pending: {data.status_distribution.find(s => s.status === "NEW")?.count || 0}
//         </div>
//         <div className="card">
//           In Progress: {data.status_distribution.find(s => s.status === "IN_PROGRESS")?.count || 0}
//         </div>
//         <div className="card">
//           Resolved: {data.status_distribution.find(s => s.status === "RESOLVED")?.count || 0}
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="charts-container">

//         <div className="chart-box">
//           <h3>Status Distribution</h3>
//           <Pie data={statusChart} options={{ maintainAspectRatio: false }} />
//         </div>

//         <div className="chart-box">
//           <h3>Monthly Trend</h3>
//           <Line data={monthlyChart} options={{ maintainAspectRatio: false }} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Analytics;




