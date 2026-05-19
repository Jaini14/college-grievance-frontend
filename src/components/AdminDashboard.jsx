// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Layout from "../components/Layout";

function AdminDashboard() {
  const navigate = useNavigate();

  const [grievances, setGrievances] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [department, setDepartment] = useState(""); // ✅ ADDED
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const token = localStorage.getItem("access");

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://college-grievance-backend-85gg.onrender.com/api/admin/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        setGrievances(data.grievances || []);
        setFacultyList(data.faculty_list || []);
        setDepartment(data.department); // ✅ ADDED
      } else {
        console.log("API Error:", data);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("TOKEN:", token);
    console.log("ROLE:", localStorage.getItem("role"));

    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const filteredGrievances =
    filter === "ALL"
      ? grievances
      : grievances.filter(g => g.status === filter);
  
      const downloadReport = async (id) => {

  try {

    const token = localStorage.getItem("access");

    console.log("TOKEN:", token);

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    const response = await fetch(
      `https://college-grievance-backend-85gg.onrender.com/api/grievance-report/${id}/`,
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
  return (
    <Layout title="Admin Dashboard">

      <div className="adm-content">

        <div className="card">
          <h2>Admin Dashboard</h2>

          <p>
            <b>Department:</b>{" "}
            {department || "N/A"} {/* ✅ FIXED */}
          </p>

          <button onClick={() => navigate("/analytics")}>
            📊 View Analytics
          </button>

          <button onClick={() => navigate("/schedule-meeting")}>
            Schedule Meeting
          </button>
        </div>

        <div className="card" style={{ display: "flex", gap: "20px" }}>
          <div>Total: {grievances.length}</div>
          <div>New: {grievances.filter(g => g.status === "NEW").length}</div>
          <div>In Progress: {grievances.filter(g => g.status === "IN_PROGRESS").length}</div>
          <div>Resolved: {grievances.filter(g => g.status === "RESOLVED").length}</div>
        </div>

        <div className="card">

          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>User</th>
                <th>Status</th>
                <th>Remark</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrievances.map(g => (
                <tr key={g.grievance_id}>
                  <td>{g.grievance_id}</td>
                  <td>{g.subject}</td>
                  <td>{g.submitted_by_name}</td>
                  <td>{g.status}</td>
                  <td>{g.faculty_remark || "—"}</td>
                  <td>
                    <button onClick={() => navigate(`/admin-assign/${g.grievance_id}`)}>
                      Assign
                    </button>

                    <button onClick={() => downloadReport(g.grievance_id)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <p>Loading...</p>}
        </div>
      </div>

    </Layout>
  );
}
export default AdminDashboard;








// // AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/AdminDashboard.css";
// import Layout from "../components/Layout";

// function AdminDashboard() {
//   const navigate = useNavigate();

//   const [grievances, setGrievances] = useState([]);
//   const [facultyList, setFacultyList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("ALL");

//   const token = localStorage.getItem("access");

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://127.0.0.1:8000/api/admin/dashboard/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setGrievances(data.grievances || []);
//         setFacultyList(data.faculty_list || []);
//       } else {
//         console.log("API Error:", data);
//       }
//     } catch (err) {
//       console.log("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("TOKEN:", token);
//     console.log("ROLE:", localStorage.getItem("role")); // ✅ ADD HERE

//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchData();
//   }, []);

//   const filteredGrievances =
//     filter === "ALL"
//       ? grievances
//       : grievances.filter(g => g.status === filter);

//   const downloadReport = async (id) => {
//   try {
//     const res = await fetch(
//       `http://127.0.0.1:8000/api/grievance/report/${id}/`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access")}`
//         }
//       }
//     );

//     if (!res.ok) {
//       alert("Unauthorized or failed to download report");
//       return;
//     }

//     const text = await res.text();

//     const blob = new Blob([text], { type: "text/plain" });
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `grievance_report_${id}.txt`;
//     a.click();

//     window.URL.revokeObjectURL(url);

//   } catch (err) {
//     console.log("Download error:", err);
//   }
//   };

//   return (
//     <Layout title="Admin Dashboard">

//       <div className="adm-content">

//         <div className="card">
//           <h2>Admin Dashboard</h2>

//           <p>
//             <b>Department:</b>{" "}
//             {localStorage.getItem("department") || "N/A"}
//           </p>

//           <button onClick={() => navigate("/analytics")}>
//             📊 View Analytics
//           </button>
//         </div>

//         <div className="card" style={{ display: "flex", gap: "20px" }}>
//           <div>Total: {grievances.length}</div>
//           <div>New: {grievances.filter(g => g.status === "NEW").length}</div>
//           <div>In Progress: {grievances.filter(g => g.status === "IN_PROGRESS").length}</div>
//           <div>Resolved: {grievances.filter(g => g.status === "RESOLVED").length}</div>
//         </div>

//         <div className="card">

//           <select onChange={(e) => setFilter(e.target.value)}>
//             <option value="ALL">All</option>
//             <option value="NEW">New</option>
//             <option value="ASSIGNED">Assigned</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="RESOLVED">Resolved</option>
//           </select>

//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Subject</th>
//                 <th>User</th>
//                 <th>Status</th>
//                 <th>Remark</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredGrievances.map(g => (
//                 <tr key={g.grievance_id}>
//                   <td>{g.grievance_id}</td>
//                   <td>{g.subject}</td>
//                   <td>{g.submitted_by_name}</td>
//                   <td>{g.status}</td>
//                   <td>{g.faculty_remark || "—"}</td>
//                   <td>
//                     <button onClick={() => navigate(`/admin-assign/${g.grievance_id}`)}>
//                       Assign
//                     </button>

//                     <button onClick={() => downloadReport(g.grievance_id)}>
//                        Download
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {loading && <p>Loading...</p>}
//         </div>

//       </div>

//     </Layout>
//   );
// }

// export default AdminDashboard;



