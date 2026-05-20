// PublicAnalytics.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./PublicAnalytics.css";
import logo from "../assets/logo.png";

function PublicAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(" http://127.0.0.1:8000/api/public-analytics/")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) return <h2 className="loading">Loading...</h2>;

  const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

  const total = data.total;

  const resolved =
    data.status_distribution.find(s => s.status === "RESOLVED")?.count || 0;

  const inProgress =
    data.status_distribution.find(s => s.status === "IN_PROGRESS")?.count || 0;

  const newComplaints =
    data.status_distribution.find(s => s.status === "NEW")?.count || 0;

  const resolutionRate = total ? ((resolved / total) * 100).toFixed(1) : 0;

  // 📊 STATUS PIE
  const statusChart = {
    labels: data.status_distribution.map(s => s.status),
    datasets: [{
      data: data.status_distribution.map(s => s.count),
      backgroundColor: colors,
    }],
  };

  // 🏢 DEPARTMENT BAR
  const deptChart = {
    labels: data.department_wise.map(d => d.department),
    datasets: [{
      label: "Complaints",
      data: data.department_wise.map(d => d.count),
      backgroundColor: "#F59E0B",
    }],
  };

  // 📈 MONTHLY TREND
  const monthlyChart = {
    labels: data.monthly_trend.map(m =>
      new Date(m.month).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    ),
    datasets: [{
      label: "Complaints Over Time",
      data: data.monthly_trend.map(m => m.count),
      borderColor: "#4F46E5",
      tension: 0.3,
      fill: false,
    }],
  };

  // 🔥 PUBLIC SAFE OPTIONS
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12 } }
      }
    }
  };

  const barOptions = {
    ...options,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 25,
          font: { size: 11 }
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <img src={logo} alt="LDCE" />
        <div>
          <h2>L.D. College of Engineering</h2>
          <p>Public Grievance Transparency Dashboard</p>
        </div>
      </div>

      {/* FILTER (kept same) */}
      <div className="filter-bar">
        <select>
          <option>All Time</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* KPI CARDS (UPGRADED but same structure) */}
      <div className="cards">

        <div className="card">
          Total: {total}
        </div>

        <div className="card">
          Pending: {newComplaints}
        </div>

        <div className="card">
          In Progress: {inProgress}
        </div>

        <div className="card">
          Resolved: {resolved}
        </div>

        <div className="card">
          Resolution Rate: {resolutionRate}%
        </div>

      </div>

      {/* CHART GRID (UNCHANGED STRUCTURE) */}
      <div className="grid">

        {/* PIE */}
        <div className="box">
          <h4>Status Distribution</h4>
          <div className="chart-container">
            <Pie data={statusChart} options={options} />
          </div>
        </div>

        {/* BAR */}
        <div className="box">
          <h4>Department Wise Complaints</h4>
          <div className="chart-container">
            <Bar data={deptChart} options={barOptions} />
          </div>
        </div>

        {/* LINE */}
        <div className="box">
          <h4>Complaint Trend</h4>
          <div className="chart-container">
            <Line data={monthlyChart} options={options} />
          </div>
        </div>

        {/* 🔥 NEW PUBLIC INSIGHT BOX */}
        <div className="box center-box">
          <h4>System Health</h4>

          <div className="big-metric">
            {resolutionRate}%
          </div>

          <p className="sub-text">
            Overall Resolution Rate
          </p>

          <p className="sub-text">
            Transparency Score
          </p>
        </div>

      </div>

    </div>
  );
}

export default PublicAnalytics;





// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Pie, Line } from "react-chartjs-2";
// import "chart.js/auto";
// import "./PublicAnalytics.css";
// import logo from "../assets/logo.png";

// function PublicAnalytics() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://127.0.0.1:8000/api/public-analytics/")
//       .then(res => setData(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   if (!data) return <h2 className="loading">Loading...</h2>;

//   const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

//   const total = data.total;
//   const resolved =
//     data.status_distribution.find(s => s.status === "RESOLVED")?.count || 0;

//   const resolutionRate = total
//     ? ((resolved / total) * 100).toFixed(1)
//     : 0;

//   // ✅ COMMON OPTIONS (MAIN FIX)
//   const commonOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: { size: 12 },
//         },
//       },
//     },
//   };

//   // ✅ PIE OPTIONS (better spacing)
//   const pieOptions = {
//     ...commonOptions,
//     plugins: {
//       ...commonOptions.plugins,
//       legend: {
//         position: "bottom",
//       },
//     },
//   };

//   // ✅ BAR OPTIONS (fix label cut)
//   const barOptions = {
//     ...commonOptions,
//     scales: {
//       x: {
//         ticks: {
//           autoSkip: false,
//           maxRotation: 30,
//           minRotation: 0,
//           font: { size: 11 },
//         },
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   // ✅ LINE OPTIONS
//   const lineOptions = {
//     ...commonOptions,
//     scales: {
//       x: {
//         ticks: { font: { size: 11 } },
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   const statusChart = {
//     labels: data.status_distribution.map(s => s.status),
//     datasets: [{
//       data: data.status_distribution.map(s => s.count),
//       backgroundColor: colors,
//     }],
//   };

//   const sortedDept = [...data.department_wise].sort((a, b) => b.count - a.count);

//   const deptChart = {
//     labels: sortedDept.map(d => d.department),
//     datasets: [{
//       label: "Complaints",
//       data: sortedDept.map(d => d.count),
//       backgroundColor: "#F59E0B",
//     }],
//   };

//   const monthlyChart = {
//     labels: data.monthly_trend.map(m =>
//       new Date(m.month).toLocaleDateString()
//     ),
//     datasets: [{
//       label: "Monthly Trend",
//       data: data.monthly_trend.map(m => m.count),
//       borderColor: "#4F46E5",
//       tension: 0.3,
//       fill: false,
//     }],
//   };

//   const statusBar = {
//     labels: data.status_distribution.map(s => s.status),
//     datasets: [{
//       label: "Status Count",
//       data: data.status_distribution.map(s => s.count),
//       backgroundColor: "#22C55E",
//     }],
//   };

//   return (
//     <div className="dashboard">

//       <div className="header">
//         <img src={logo} alt="LDCE" />
//         <div>
//           <h2>L.D. College of Engineering</h2>
//           <p>Ahmedabad • Public Analytics</p>
//         </div>
//       </div>

//       <div className="filter-bar">
//         <select>
//           <option>All Time</option>
//           <option>This Month</option>
//           <option>Last 3 Months</option>
//         </select>
//       </div>

//       <div className="cards">
//         <div className="card">Total: {total}</div>
//         <div className="card">
//           Pending: {data.status_distribution.find(s => s.status==="NEW")?.count || 0}
//         </div>
//         <div className="card">
//           In Progress: {data.status_distribution.find(s => s.status==="IN_PROGRESS")?.count || 0}
//         </div>
//         <div className="card">Resolved: {resolved}</div>
//         <div className="card">Resolution Rate: {resolutionRate}%</div>
//       </div>

//       <div className="grid">

//         <div className="box">
//           <h4>Status Distribution</h4>
//           <div className="chart-container">
//             <Pie data={statusChart} options={pieOptions} />
//           </div>
//         </div>

//         <div className="box">
//           <h4>Department Wise</h4>
//           <div className="chart-container">
//             <Bar data={deptChart} options={barOptions} />
//           </div>
//         </div>

//         <div className="box">
//           <h4>Monthly Trend</h4>
//           <div className="chart-container">
//             <Line data={monthlyChart} options={lineOptions} />
//           </div>
//         </div>

//         <div className="box">
//           <h4>Status Comparison</h4>
//           <div className="chart-container">
//             <Bar data={statusBar} options={barOptions} />
//           </div>
//         </div>

//       </div>

//     </div>
//   );
// }

// export default PublicAnalytics;







