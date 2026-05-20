// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo from "../assets/logo.png";
import axios from "axios";

// ✅ CHART IMPORTS
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

// ✅ FIXED API FUNCTION (added /api/)
const getAnalytics = (token) => {
  return axios.get(" http://127.0.0.1:8000/api/public-analytics/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

function UserDashboard() {
  const navigate = useNavigate();

  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });

  const [analytics, setAnalytics] = useState(null);

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ NEW DOWNLOAD FUNCTION WITH TOKEN AUTH
  const downloadReport = async (id) => {

  try {

    const token = localStorage.getItem("access");

    console.log("TOKEN:", token);

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const response = await fetch(
      ` http://127.0.0.1:8000/api/grievance-report/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STATUS:", response.status);

    if (!response.ok) {

      const errText = await response.text();

      console.log("ERROR:", errText);

      alert("Failed to download report");
      return;
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `grievance_${id}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {

    console.log("DOWNLOAD ERROR:", err);

    alert("Download failed");
  }
 };
 
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          " http://127.0.0.1:8000/api/student/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setGrievances(data.data);
          setStats({
            total: data.total,
            pending: data.pending,
            in_progress: data.in_progress,
            resolved: data.resolved,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics(token);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };

    if (token) {
      fetchDashboard();
      fetchAnalytics();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ CHART DATA
  const deptChart = analytics?.department_wise
    ? {
        labels: analytics.department_wise.map((d) => d.department),
        datasets: [
          {
            label: "Department Issues",
            data: analytics.department_wise.map((d) => d.count),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      }
    : null;

  return (
    <div className="dashboard-wrapper">

      {/* NAVBAR */}
      <nav className="dash-navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="img" style={{ width: "50px" }} />
          <div className="dash-nav-logo">Grievance Portal</div>
        </div>

        <div className="dash-nav-links">
          <button
            className="dash-nav-btn"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </button>

          <button
            className="dash-nav-btn primary"
            onClick={() => navigate("/file-complaint")}
          >
            + New Complaint
          </button>

          <button onClick={() => navigate("/public-analytics")}>
            📊 Public Analytics
          </button>

          <button className="dash-nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        {/* USER INFO */}
        <header className="welcome-section">
          <h1>
            Welcome back, {localStorage.getItem("full_name") || "User"}!
          </h1>
          <p>Department: {localStorage.getItem("department")}</p>
        </header>

        {/* STATS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Filed</h3>
            <p className="stat-number">{stats.total}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number yellow">{stats.pending}</p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number purple">{stats.in_progress}</p>
          </div>

          <div className="stat-card">
            <h3>Resolved</h3>
            <p className="stat-number green">{stats.resolved}</p>
          </div>
        </div>

        {/* ✅ ADMIN ANALYTICS */}
        {user?.role?.toUpperCase() === "ADMIN" && analytics && (
          <div className="analytics-section">
            <h2>📊 Analytics Overview</h2>

            <h3>Total Grievances: {analytics.total}</h3>

            <h3>Status Distribution</h3>
            <ul>
              {/* ✅ FIXED (array mapping instead of Object.entries) */}
              {analytics.status_distribution.map((item, i) => (
                <li key={i}>
                  {item.status}: {item.count}
                </li>
              ))}
            </ul>

            <h3>Monthly Trend</h3>
            <ul>
              {analytics.monthly_trend.map((item, i) => (
                <li key={i}>
                  {item.month}: {item.count}
                </li>
              ))}
            </ul>

            {deptChart && (
              <>
                <h3>Department Wise Issues</h3>
                <Bar data={deptChart} />
              </>
            )}
          </div>
        )}

        {/* TABLE */}
        <section className="table-section">
          <h2>Your Submitted Queries</h2>

          <div className="table-responsive">
            <table className="grievance-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Department</th>
                  <th>Staff Function</th>
                  <th>Date Filed</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Faculty Remark</th>
                  <th>Report</th>
                </tr>
              </thead>

              <tbody>
                {grievances.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.grievance_id}</strong></td>
                    <td>{item.subject}</td>
                    <td>{item.department}</td>
                    <td>{item.staff_function || "-"}</td>
                    <td>{new Date(item.date_filed).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.assigned_to_name || "Not Assigned"}</td>
                    <td>{item.faculty_remark || "No Remark Yet"}</td>
                    <td>
                      <button
                        onClick={() => downloadReport(item.grievance_id)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </section>

      </div>
    </div>
  );
}

export default UserDashboard;








// // Dashboard.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Dashboard.css";
// import logo from "../assets/logo.png";
// import axios from "axios";

// // ✅ CHART IMPORTS
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";

// // ✅ FIXED API FUNCTION (added /api/)
// const getAnalytics = (token) => {
//   return axios.get("http://127.0.0.1:8000/api/public-analytics/", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// function UserDashboard() {
//   const navigate = useNavigate();

//   const [grievances, setGrievances] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     in_progress: 0,
//     resolved: 0,
//   });

//   const [analytics, setAnalytics] = useState(null);

//   const token = localStorage.getItem("access");
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/student/dashboard/",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();

//         if (response.ok) {
//           setGrievances(data.data);
//           setStats({
//             total: data.total,
//             pending: data.pending,
//             in_progress: data.in_progress,
//             resolved: data.resolved,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard:", error);
//       }
//     };

//     const fetchAnalytics = async () => {
//       try {
//         const res = await getAnalytics(token);
//         setAnalytics(res.data);
//       } catch (err) {
//         console.error("Analytics error:", err);
//       }
//     };

//     if (token) {
//       fetchDashboard();
//       fetchAnalytics();
//     }
//   }, [token]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   // ✅ CHART DATA
//   const deptChart = analytics?.department_wise
//     ? {
//         labels: analytics.department_wise.map((d) => d.department),
//         datasets: [
//           {
//             label: "Department Issues",
//             data: analytics.department_wise.map((d) => d.count),
//             backgroundColor: "rgba(54, 162, 235, 0.6)",
//           },
//         ],
//       }
//     : null;

//   return (
//     <div className="dashboard-wrapper">

//       {/* NAVBAR */}
//       <nav className="dash-navbar">
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <img src={logo} alt="img" style={{ width: "50px" }} />
//           <div className="dash-nav-logo">Grievance Portal</div>
//         </div>

//         <div className="dash-nav-links">
//           <button
//             className="dash-nav-btn"
//             onClick={() => navigate("/profile")}
//           >
//             My Profile
//           </button>

//           <button
//             className="dash-nav-btn primary"
//             onClick={() => navigate("/file-complaint")}
//           >
//             + New Complaint
//           </button>

//           <button onClick={() => navigate("/public-analytics")}>
//             📊 Public Analytics
//           </button>

//           <button className="dash-nav-btn logout" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="dashboard-content">

//         {/* USER INFO */}
//         <header className="welcome-section">
//           <h1>
//             Welcome back, {localStorage.getItem("full_name") || "User"}!
//           </h1>
//           <p>Department: {localStorage.getItem("department")}</p>
//         </header>

//         {/* STATS */}
//         <div className="stats-container">
//           <div className="stat-card">
//             <h3>Total Filed</h3>
//             <p className="stat-number">{stats.total}</p>
//           </div>

//           <div className="stat-card">
//             <h3>Pending</h3>
//             <p className="stat-number yellow">{stats.pending}</p>
//           </div>

//           <div className="stat-card">
//             <h3>In Progress</h3>
//             <p className="stat-number purple">{stats.in_progress}</p>
//           </div>

//           <div className="stat-card">
//             <h3>Resolved</h3>
//             <p className="stat-number green">{stats.resolved}</p>
//           </div>
//         </div>

//         {/* ✅ ADMIN ANALYTICS */}
//         {user?.role?.toUpperCase() === "ADMIN" && analytics && (
//           <div className="analytics-section">
//             <h2>📊 Analytics Overview</h2>

//             <h3>Total Grievances: {analytics.total}</h3>

//             <h3>Status Distribution</h3>
//             <ul>
//               {/* ✅ FIXED (array mapping instead of Object.entries) */}
//               {analytics.status_distribution.map((item, i) => (
//                 <li key={i}>
//                   {item.status}: {item.count}
//                 </li>
//               ))}
//             </ul>

//             <h3>Monthly Trend</h3>
//             <ul>
//               {analytics.monthly_trend.map((item, i) => (
//                 <li key={i}>
//                   {item.month}: {item.count}
//                 </li>
//               ))}
//             </ul>

//             {deptChart && (
//               <>
//                 <h3>Department Wise Issues</h3>
//                 <Bar data={deptChart} />
//               </>
//             )}
//           </div>
//         )}

//         {/* TABLE */}
//         <section className="table-section">
//           <h2>Your Submitted Queries</h2>

//           <div className="table-responsive">
//             <table className="grievance-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Subject</th>
//                   <th>Department</th>
//                   <th>Date Filed</th>
//                   <th>Status</th>
//                   <th>Assigned To</th>
//                   <th>Faculty Remark</th>
//                   <th>Report</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {grievances.map((item) => (
//                   <tr key={item.id}>
//                     <td><strong>{item.grievance_id}</strong></td>
//                     <td>{item.subject}</td>
//                     <td>{item.department}</td>
//                     <td>{new Date(item.date_filed).toLocaleDateString()}</td>
//                     <td>
//                       <span className={`status-badge ${item.status.toLowerCase()}`}>
//                         {item.status}
//                       </span>
//                     </td>
//                     <td>{item.assigned_to_name || "Not Assigned"}</td>
//                     <td>{item.faculty_remark || "No Remark Yet"}</td>
//                     <td>
//                       <button
//                         onClick={() =>
//                           window.open(
//                             `http://127.0.0.1:8000/api/grievance-report/${item.grievance_id}/`
//                           )
//                         }
//                       >
//                         Download
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// export default UserDashboard;