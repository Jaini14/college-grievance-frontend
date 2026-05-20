// AdminAssignPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "./AdminAssignPage.css";

function AdminAssignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [grievance, setGrievance] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch(" http://127.0.0.1:8000/api/admin/dashboard/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const g = data.grievances.find(
          x => String(x.grievance_id) === String(id)
        );
        setGrievance(g);
        setFacultyList(data.faculty_list || []);
      });
  }, [id, token]);

  // 🔥 SMART KEYWORD SCORING
  const getSuggestedFaculty = () => {
    if (!grievance) return [];

    const text = (
      grievance.subject + " " + grievance.description
    ).toLowerCase();

    const keywords = [
      "lab", "network", "server", "electric", "power",
      "ac", "computer", "software", "hardware",
      "wifi", "internet", "database"
    ];

    const scored = facultyList.map((f) => {
      const spec = (f.specialization || "").toLowerCase();
      let score = 0;

      keywords.forEach((k) => {
        if (text.includes(k) && spec.includes(k)) score += 5;
        else if (text.includes(k) && spec.includes("general")) score += 1;
      });

      return { ...f, score };
    });

    return scored
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // 🔥 MATCH REASON (VERY IMPORTANT UX)
  const getMatchReason = (f) => {
    if (!grievance) return "";

    const text = (
      grievance.subject + " " + grievance.description
    ).toLowerCase();

    const spec = (f.specialization || "").toLowerCase();

    if (text.includes("lab") && spec.includes("lab")) return "Lab Issue";
    if (text.includes("network") && spec.includes("network")) return "Network Match";
    if (text.includes("ac") && spec.includes("electrical")) return "Electrical Match";

    return "General Match";
  };

  const normalizeSpec = (spec) => {
  return (spec || "")
    .toLowerCase()
    .replace(/[^a-z0-9, ]/g, "")
    .split(",")
    .map(s => s.trim());
  };

  const filteredFaculty = facultyList.filter(f => {
    if (filter === "ALL") return true;

    const specs = normalizeSpec(f.specialization);

    return specs.includes(filter.toLowerCase());
  });


  // 🔥 GROUPING
  const groupFacultyBySpecialization = () => {
    const groups = {};

    filteredFaculty.forEach((f) => {
      const key = f.specialization || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });

    return groups;
  };

  const handleAssign = async () => {
    if (!selectedFaculty) {
      alert("Please select faculty");
      return;
    }

    const res = await fetch(
      " http://127.0.0.1:8000/api/grievance/assign/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          grievance_id: id,
          faculty_id: selectedFaculty,
          message
        })
      }
    );

    if (res.ok) {
      alert("Assigned ✅");
      navigate("/admin-dashboard");
    } else {
      alert("Error ❌");
    }
  };

  if (!grievance) {
    return (
      <Layout title="Assign Grievance">
        <div className="card">
          <h3>Loading...</h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Assign Grievance">
      <div className="assign-container">

        {/* HEADER */}
        <div className="assign-header">
          <h2>Assign Grievance</h2>
          <p>Smart faculty assignment system</p>
        </div>

        {/* DETAILS */}
        <div className="info-box">
          <p><b>ID:</b> {grievance.grievance_id}</p>
          <p><b>Subject:</b> {grievance.subject}</p>
          <p><b>Student:</b> {grievance.submitted_by_name}</p>
          <p><b>Description:</b> {grievance.description}</p>
        </div>

        {/* 🔥 FILTER */}
        <div style={{ marginBottom: "10px" }}>
          <label>Filter by specialization: </label>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All</option>
            <option value="network">Network</option>
            <option value="electrical">Electrical</option>
            <option value="lab">Lab</option>
            <option value="software">Software</option>
          </select>
        </div>

        {/* 🔥 SMART SUGGESTION */}
        {getSuggestedFaculty().length > 0 && (
          <div className="suggestion-box">
            <h4>🔥 Recommended Faculty (AI Ranked)</h4>

            {getSuggestedFaculty().map((f) => (
              <div
                key={f.id}
                className="suggestion-card"
                onClick={() => setSelectedFaculty(String(f.id))}
              >
                ⭐ {f.name} ({f.specialization}) — Score: {f.score}
              </div>
            ))}
          </div>
        )}

        {/* 🔥 GROUPED FACULTY */}
        <div className="faculty-container">

          {Object.entries(groupFacultyBySpecialization()).map(
            ([specialization, list]) => (
              <div key={specialization} className="faculty-group">

                <h4 className="group-title">
                  📌 {specialization}
                </h4>

                <div className="faculty-grid">

                  {list.map((f) => (
                    <div
                      key={f.id}
                      className={`faculty-card ${
                        selectedFaculty === String(f.id) ? "active" : ""
                      }`}
                      onClick={() => setSelectedFaculty(String(f.id))}
                    >
                      <div className="name">{f.name}</div>

                      {/* ✅ FIXED (IMPORTANT) */}
                      <div className="meta">📘 {f.specialization || "General"}</div>
                      <div className="meta">🏢 {f.department}</div>

                      <div className="email">✉ {f.email}</div>

                      {/* ✅ NEW */}
                      <div className="reason">
                        🔍 {getMatchReason(f)}
                      </div>
                    </div>
                  ))}

                </div>

              </div>
            )
          )}

        </div>

        {/* MESSAGE */}
        <textarea
          className="message-box"
          placeholder="Instruction for faculty..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* BUTTON */}
        <button className="assign-btn" onClick={handleAssign}>
          Assign Grievance
        </button>

      </div>
    </Layout>
  );
}

export default AdminAssignPage;


// // AdminAssignPage.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";

// function AdminAssignPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");

//   const [grievance, setGrievance] = useState(null);
//   const [facultyList, setFacultyList] = useState([]);
//   const [selectedFaculty, setSelectedFaculty] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/admin/dashboard/", {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         const g = data.grievances.find(
//           x => String(x.grievance_id) === String(id)
//         );
//         setGrievance(g);
//         setFacultyList(data.faculty_list || []);
//       });
//   }, [id, token]);

//   const handleAssign = async () => {
//     const res = await fetch(
//       "http://127.0.0.1:8000/api/grievance/assign/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           grievance_id: id,
//           faculty_id: selectedFaculty,
//           message: message
//         })
//       }
//     );

//     if (res.ok) {
//       alert("Assigned ✅");
//       navigate("/admin-dashboard");
//     } else {
//       alert("Error ❌");
//     }
//   };

//   if (!grievance) {
//     return (
//       <Layout title="Assign Grievance">
//         <div className="card">
//           <h3>Loading...</h3>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//   <Layout title="Assign Grievance">

//     <div className="card" style={{ maxWidth: "700px", margin: "auto" }}>

//       <div className="comp-header">
//         <h2>Assign Grievance</h2>
//         <p>Review complaint and assign to faculty</p>
//       </div>

//       {/* DETAILS */}
//       <div className="comp-input-box">
//         <label>Grievance ID</label>
//         <input value={grievance.grievance_id} disabled />
//       </div>

//       <div className="comp-input-box">
//         <label>Subject</label>
//         <input value={grievance.subject} disabled />
//       </div>

//       <div className="comp-input-box">
//         <label>Student</label>
//         <input value={grievance.submitted_by_name} disabled />
//       </div>

//       <div className="comp-input-box">
//         <label>Description</label>
//         <textarea value={grievance.description} disabled />
//       </div>

//       {/* ASSIGN */}
//       <div className="comp-input-box">
//         <label>Select Faculty</label>
//         <select
//           value={selectedFaculty}
//           onChange={(e) => setSelectedFaculty(e.target.value)}
//         >
//           <option value="">Select Faculty</option>
//           {facultyList.map(f => (
//             <option key={f.id} value={f.id}>
//                 {f.name} — {f.specialization || "General"} ({f.email})
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="comp-input-box">
//         <label>Instruction</label>
//         <textarea
//           placeholder="Write instruction..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//       </div>

//       <button
//         className="comp-submit-btn"
//         onClick={handleAssign}
//       >
//         Assign Grievance
//       </button>

//     </div>

//   </Layout>
// );
// }

// export default AdminAssignPage; 