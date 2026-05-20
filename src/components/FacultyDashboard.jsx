// FacultyDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [notifications, setNotifications] = useState([]); // ✅ Notifications state
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");
  const name = localStorage.getItem("full_name") || "Faculty";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    // ✅ Dashboard API
    axios
      .get(" http://127.0.0.1:8000/api/faculty/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        const formattedData = res.data.assigned.map(item => ({
          id: item.grievance_id,
          subject: item.subject,
          student: item.submitted_by_name,
          department: item.department,
          date: item.date_filed
            ? new Date(item.date_filed).toLocaleDateString()
            : "N/A",
          status: item.status,
          assigned_message: item.assigned_message
        }));

        setAssignedGrievances(formattedData);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));

    // ✅ Notifications API
    fetch("https://college-grievance-backend-85gg.onrender.com/api/faculty/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setNotifications(data || []);
      })
      .catch(err => {
        console.log("Notification fetch error:", err);
      });

  }, [token, navigate]);

  // ✅ Handle remark changes
  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // ✅ Remove notification
  const removeNotification = async (notificationId) => {

  try {

    const response = await fetch(
      ` http://127.0.0.1:8000/api/faculty/notifications/delete/${notificationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {

      setNotifications(prev =>
        prev.filter(note => note.id !== notificationId)
      );

    } else {
      alert("Failed to delete notification");
    }

  } catch (err) {
    console.log(err);
  }
  };
  // ✅ Update grievance status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        " http://127.0.0.1:8000/api/grievance/update-status/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            grievance_id: id,
            status: newStatus,
            remark: remarks[id] || ""
          })
        }
      );

      if (res.ok) {
        setAssignedGrievances(prev =>
          prev.map(g =>
            g.id === id ? { ...g, status: newStatus } : g
          )
        );

        setRemarks(prev => ({
          ...prev,
          [id]: ""
        }));
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Download grievance report
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

  return (
    <Layout title="Faculty Dashboard">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <h2>Assigned Complaints</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="fac-nav-link"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button onClick={() => navigate("/file-complaint")}>
            + New Complaint
          </button>
        </div>
      </div>

      {/* ✅ Notifications Section */}
      <div
        className="card"
        style={{ marginBottom: "20px" }}
      >
        <h3>Notifications</h3>

        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div
              key={index}
              className="notification-item"
            >
              <span>{note.message}</span>

              <button
                className="delete-btn"
                onClick={() => removeNotification(note.id)}
              >
                ✖
              </button>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>

      {/* Existing Complaints Table */}
      <div className="card">

        {loading ? (
          <p>Loading...</p>
        ) : assignedGrievances.length > 0 ? (

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Student</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status + Action</th>
              </tr>
            </thead>

            <tbody>
              {assignedGrievances.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.subject}</td>
                  <td>{g.student}</td>
                  <td>{g.department}</td>
                  <td>{g.date}</td>

                  <td>
                    <button
                      onClick={() => navigate(`/faculty-action/${g.id}`)}
                    >
                      Take Action
                    </button>

                    {/* DOWNLOAD BUTTON */}
                    <button onClick={() => downloadReport(g.id)}>
                      Download Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        ) : (
          <p>No grievances assigned</p>
        )}
      </div>
    </Layout>
  );
}

export default FacultyDashboard;








// // FacultyDashboard.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Layout from "../components/Layout";

// function FacultyDashboard() {
//   const navigate = useNavigate();

//   const [assignedGrievances, setAssignedGrievances] = useState([]);
//   const [remarks, setRemarks] = useState({});
//   const [notifications, setNotifications] = useState([]); // ✅ Added notifications state
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("access");
//   const name = localStorage.getItem("full_name") || "Faculty";

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     setLoading(true);

//     // ✅ Existing Dashboard API
//     axios
//       .get("http://127.0.0.1:8000/api/faculty/dashboard/", {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(res => {
//         const formattedData = res.data.assigned.map(item => ({
//           id: item.grievance_id,
//           subject: item.subject,
//           student: item.submitted_by_name,
//           department: item.department,
//           date: item.date_filed
//             ? new Date(item.date_filed).toLocaleDateString()
//             : "N/A",
//           status: item.status,
//           assigned_message: item.assigned_message
//         }));

//         setAssignedGrievances(formattedData);
//       })
//       .catch(() => navigate("/login"))
//       .finally(() => setLoading(false));

//     // ✅ New Notifications API
//     fetch("http://127.0.0.1:8000/api/faculty/notifications/", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setNotifications(data || []);
//       })
//       .catch(err => {
//         console.log("Notification fetch error:", err);
//       });

//   }, [token, navigate]);

//   const handleRemarkChange = (id, value) => {
//     setRemarks(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const updateStatus = async (id, newStatus) => {
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/api/grievance/update-status/",
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             grievance_id: id,
//             status: newStatus,
//             remark: remarks[id] || ""
//           })
//         }
//       );

//       if (res.ok) {
//         setAssignedGrievances(prev =>
//           prev.map(g =>
//             g.id === id ? { ...g, status: newStatus } : g
//           )
//         );

//         setRemarks(prev => ({
//           ...prev,
//           [id]: ""
//         }));
//       } else {
//         alert("Update failed");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const downloadReport = async (id) => {
//     try {
//       const token = localStorage.getItem("access");

//       console.log("TOKEN:", token);

//       if (!token) {
//         alert("No token found. Please login again.");
//         return;
//       }

//       const response = await fetch(
//         `http://127.0.0.1:8000/api/grievance-report/${id}/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("STATUS:", response.status);

//       if (!response.ok) {
//         const errText = await response.text();

//         console.log("ERROR:", errText);

//         alert("Failed to download report");
//         return;
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");

//       a.href = url;

//       a.download = `grievance_${id}.pdf`;

//       document.body.appendChild(a);

//       a.click();

//       a.remove();

//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       console.log("DOWNLOAD ERROR:", err);

//       alert("Download failed");
//     }
//   };

//   return (
//     <Layout title="Faculty Dashboard">

//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "15px"
//         }}
//       >
//         <h2>Assigned Complaints</h2>

//         <div style={{ display: "flex", gap: "10px" }}>
//           <button
//             className="fac-nav-link"
//             onClick={() => navigate("/profile")}
//           >
//             Profile
//           </button>

//           <button onClick={() => navigate("/file-complaint")}>
//             + New Complaint
//           </button>
//         </div>
//       </div>

//       {/* ✅ Notifications Section */}
//       <div
//         className="card"
//         style={{ marginBottom: "20px" }}
//       >
//         <h3>Notifications</h3>

//         {notifications.length > 0 ? (
//           notifications.map((n, i) => (
//             <div
//               key={i}
//               style={{
//                 padding: "10px",
//                 marginBottom: "8px",
//                 background: "#f5f5f5",
//                 borderRadius: "5px"
//               }}
//             >
//               {n.message}
//             </div>
//           ))
//         ) : (
//           <p>No notifications</p>
//         )}
//       </div>

//       {/* Existing Complaints Table */}
//       <div className="card">

//         {loading ? (
//           <p>Loading...</p>
//         ) : assignedGrievances.length > 0 ? (

//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Subject</th>
//                 <th>Student</th>
//                 <th>Department</th>
//                 <th>Date</th>
//                 <th>Status + Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {assignedGrievances.map(g => (
//                 <tr key={g.id}>
//                   <td>{g.id}</td>
//                   <td>{g.subject}</td>
//                   <td>{g.student}</td>
//                   <td>{g.department}</td>
//                   <td>{g.date}</td>

//                   <td>
//                     <button
//                       onClick={() => navigate(`/faculty-action/${g.id}`)}
//                     >
//                       Take Action
//                     </button>

//                     {/* DOWNLOAD BUTTON */}
//                     <button onClick={() => downloadReport(g.id)}>
//                       Download Report
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         ) : (
//           <p>No grievances assigned</p>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default FacultyDashboard;




