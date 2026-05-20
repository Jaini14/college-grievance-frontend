// FacultyActionPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";

function FacultyActionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [grievance, setGrievance] = useState(null);
  const [status, setStatus] = useState("IN_PROGRESS");
  const [remark, setRemark] = useState("");

  // NEW: proof image state
  const [proofImage, setProofImage] = useState(null);

  // Fetch grievance details
  useEffect(() => {
    fetch(" http://127.0.0.1:8000/api/faculty/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.assigned.find(
          (g) =>
            String(g.grievance_id) === String(id)
        );

        setGrievance(found);
      });
  }, [id, token]);

  // UPDATED SUBMIT FUNCTION
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "grievance_id",
      id
    );

    formData.append(
      "status",
      status
    );

    formData.append(
      "remark",
      remark
    );

    // Upload image if selected
    if (proofImage) {
      formData.append(
        "resolution_image",
        proofImage
      );
    }

    try {
      const res = await fetch(
        " http://127.0.0.1:8000/api/grievance/update-status/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (res.ok) {
        alert(
          "Updated Successfully ✅"
        );

        navigate(
          "/faculty-dashboard"
        );
      } else {
        alert("Error ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error ❌");
    }
  };

  // Loading state
  if (!grievance) {
    return (
      <Layout title="Faculty Action">
        <div className="card">
          <h3>Loading...</h3>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Update Grievance">
      <div
        className="card"
        style={{
          maxWidth: "700px",
          margin: "auto"
        }}
      >
        <div className="comp-header">
          <h2>Update Grievance</h2>
          <p>
            Take action and update status
          </p>
        </div>

        {/* Grievance ID */}
        <div className="comp-input-box">
          <label>Grievance ID</label>

          <input
            value={grievance.grievance_id}
            disabled
          />
        </div>

        {/* Subject */}
        <div className="comp-input-box">
          <label>Subject</label>

          <input
            value={grievance.subject}
            disabled
          />
        </div>

        {/* Student */}
        <div className="comp-input-box">
          <label>Student</label>

          <input
            value={
              grievance.submitted_by_name
            }
            disabled
          />
        </div>

        {/* Description */}
        <div className="comp-input-box">
          <label>Description</label>

          <textarea
            value={grievance.description}
            disabled
          />
        </div>

        {grievance.recommended_staff?.length > 0 && (
  <>
    <h3>
      Suggested LDCE Staff
    </h3>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Function</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>

      <tbody>
        {grievance.recommended_staff.map(
          (s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.function}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  </>
)}

        {/* STATUS */}
        <div className="comp-input-box">
          <label>Status</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="ASSIGNED">
              Assigned
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="RESOLVED">
              Resolved
            </option>
          </select>
        </div>

        {/* REMARK */}
        <div className="comp-input-box">
          <label>Remark</label>

          <textarea
            placeholder="Explain what action you took..."
            value={remark}
            onChange={(e) =>
              setRemark(e.target.value)
            }
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="comp-input-box">
          <label>
            Upload Work Proof Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProofImage(
                e.target.files[0]
              )
            }
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className="comp-submit-btn"
          onClick={handleSubmit}
        >
          Submit Update
        </button>
      </div>
    </Layout>
  );
}

export default FacultyActionPage;








// //  FacultyActionPage.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";

// function FacultyActionPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("access");

//   const [grievance, setGrievance] = useState(null);
//   const [status, setStatus] = useState("IN_PROGRESS");
//   const [remark, setRemark] = useState("");
//   const [proofImage, setProofImage] =
//   useState(null);

//   useEffect(() => {
//     fetch(`http://127.0.0.1:8000/api/faculty/dashboard/`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => res.json())
//       .then(data => {
//         const found = data.assigned.find(
//           g => String(g.grievance_id) === String(id)
//         );
//         setGrievance(found);
//       });
//   }, [id, token]);

//   const handleSubmit = async () => {
//     const res = await fetch(
//       "http://127.0.0.1:8000/api/grievance/update-status/",
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           grievance_id: id,
//           status: status,
//           remark: remark
//         })
//       }
//     );

//     if (res.ok) {
//       alert("Updated Successfully ✅");
//       navigate("/faculty-dashboard");
//     } else {
//       alert("Error ❌");
//     }
//   };

//   if (!grievance) {
//     return (
//       <Layout title="Faculty Action">
//         <div className="card">
//           <h3>Loading...</h3>
//         </div>
//       </Layout>
//     );
//   }

//  return (
//   <Layout title="Update Grievance">

//     <div className="card" style={{ maxWidth: "700px", margin: "auto" }}>

//       <div className="comp-header">
//         <h2>Update Grievance</h2>
//         <p>Take action and update status</p>
//       </div>

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

//       {/* ACTION */}
//       <div className="comp-input-box">
//         <label>Status</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option value="ASSIGNED">Assigned</option>
//           <option value="IN_PROGRESS">In Progress</option>
//           <option value="RESOLVED">Resolved</option>
//         </select>
//       </div>

//       <div className="comp-input-box">
//         <label>Remark</label>
//         <textarea
//           placeholder="Explain what action you took..."
//           value={remark}
//           onChange={(e) => setRemark(e.target.value)}
//         />
//       </div>
      
//       <div className="comp-input-box">
//         <label>
//           Upload Work Proof Image
//         </label>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) =>
//             setProofImage(
//              e.target.files[0]
//              )
//           }
//         />
//       </div>

//       <button className="comp-submit-btn" onClick={handleSubmit}>
//         Submit Update
//       </button>

//     </div>

//   </Layout>
// );
// }

// export default FacultyActionPage;