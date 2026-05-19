// Profile.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tempUser, setTempUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const token =
    localStorage.getItem("access") || null;

  // FETCH PROFILE
  useEffect(() => {
    // Check token first
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://college-grievance-backend-85gg.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setTempUser(data);
        } else {
          // Token invalid / expired
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  if (!user)
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading...
      </h2>
    );

  // HANDLE INPUT
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setTempUser({
      ...tempUser,
      [name]: value
    });
  };

  const handleEditClick = () => {
    setTempUser({ ...user });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // SAVE PROFILE
  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        "https://college-grievance-backend-85gg.onrender.com/api/profile/update/",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(tempUser)
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "Profile updated successfully ✅"
        );

        setUser({ ...tempUser });
        setIsEditing(false);

        // Sync localStorage
        localStorage.setItem(
          "full_name",
          tempUser.full_name || ""
        );

        localStorage.setItem(
          "department",
          tempUser.department || ""
        );

        // Force UI refresh everywhere
        window.dispatchEvent(
          new Event("storage")
        );
      } else {
        alert(
          "Error: " +
            JSON.stringify(data)
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="prof-page-container">
      <nav className="prof-side-nav">
        <div className="prof-logo-section">
          Grievance Portal LDCE
        </div>

        <button
          onClick={() => navigate(-1)}
          className="prof-back-btn"
        >
          ← Back
        </button>
      </nav>

      <div className="prof-main-content">
        <div className="prof-card">
          <div className="prof-header-bg"></div>

          <div className="prof-info-section">
            <div className="prof-avatar">
              {user.full_name
                ? user.full_name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="prof-details-header">
              {isEditing ? (
                <input
                  name="full_name"
                  value={
                    tempUser.full_name
                  }
                  onChange={
                    handleInputChange
                  }
                />
              ) : (
                <h1>{user.full_name}</h1>
              )}

              <span className="prof-badge">
                {user.role}
              </span>
            </div>

            <div className="prof-grid">
              {/* EMAIL */}
              <div className="prof-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>

              {/* PHONE */}
              <div className="prof-item">
                <label>Phone</label>

                {isEditing ? (
                  <input
                    name="phone_number"
                    value={
                      tempUser.phone_number ||
                      ""
                    }
                    onChange={
                      handleInputChange
                    }
                  />
                ) : (
                  <p>
                    {user.phone_number}
                  </p>
                )}
              </div>

              {/* DEPARTMENT */}
              <div className="prof-item">
                <label>Department</label>

                {isEditing ? (
                  <select
                    name="department"
                    value={
                      tempUser.department
                    }
                    onChange={
                      handleInputChange
                    }
                    className="prof-edit-select"
                  >
                    <option value="Computer Engineering">
                      Computer Engineering
                    </option>

                    <option value="Information Technology">
                      Information
                      Technology
                    </option>

                    <option value="Mechanical Engineering">
                      Mechanical
                      Engineering
                    </option>

                    <option value="Civil Engineering">
                      Civil Engineering
                    </option>

                    <option value="Electrical Engineering">
                      Electrical
                      Engineering
                    </option>

                    <option value="Electronics & Communication">
                      Electronics &
                      Communication
                    </option>
                  </select>
                ) : (
                  <p>{user.department}</p>
                )}
              </div>

              {/* STAFF FUNCTION */}
              {user.role === "STAFF" && (
                <div className="prof-item">
                  <label>
                    Staff Function
                  </label>

                  {isEditing ? (
                    <input
                      name="staff_function"
                      value={
                        tempUser.staff_function ||
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                    />
                  ) : (
                    <p>
                      {
                        user.staff_function
                      }
                    </p>
                  )}
                </div>
              )}

              {/* FACULTY SPECIALIZATION */}
              {user.role ===
                "FACULTY" && (
                <div className="prof-item">
                  <label>
                    Specialization
                  </label>

                  {isEditing ? (
                    <input
                      name="specialization"
                      value={
                        tempUser.specialization ||
                        ""
                      }
                      onChange={
                        handleInputChange
                      }
                    />
                  ) : (
                    <p>
                      {
                        user.specialization
                      }
                    </p>
                  )}
                </div>
              )}

              {/* JOIN DATE */}
              <div className="prof-item">
                <label>Joined</label>

                <p>
                  {new Date(
                    user.date_joined
                  ).toDateString()}
                </p>
              </div>

              {/* STUDENT ONLY */}
              {user.role ===
                "STUDENT" && (
                <div className="prof-item">
                  <label>
                    Enrollment No
                  </label>

                  <p>
                    {user.enrollment_no}
                  </p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="prof-actions">
              {isEditing ? (
                <>
                  <button
                    onClick={
                      handleSaveClick
                    }
                  >
                    Save
                  </button>

                  <button
                    onClick={
                      handleCancelClick
                    }
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={
                    handleEditClick
                  }
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;













// // Profile.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Profile.css";

// function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [tempUser, setTempUser] = useState({});
//   const [isEditing, setIsEditing] = useState(false);

//   const token = localStorage.getItem("access")|| null;

//   // 🔥 FETCH PROFILE
//   useEffect(() => {
//      // ✅ STEP 1: Check token first
//       if (!token) {
//         navigate("/login");
//         return;
//       }
//     const fetchProfile = async () => {
//      try{
//        const res = await fetch("http://127.0.0.1:8000/api/profile/", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const data = await res.json();

//        if (res.ok) {
//         setUser(data);
//         setTempUser(data);
//       } else {
//         // 🔥 Token invalid / expired
//         localStorage.clear();
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Profile fetch error:", error);
//       navigate("/login");
//     }
//   };

//     fetchProfile();
//   }, [token, navigate]);

//   if (!user) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

//   // 🔥 HANDLE INPUT
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTempUser({ ...tempUser, [name]: value });
//   };

//   const handleEditClick = () => {
//     setTempUser({ ...user });
//     setIsEditing(true);
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//   };

//   // 🔥 SAVE TO DATABASE
//   const handleSaveClick = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/profile/update/", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(tempUser)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Profile updated successfully ✅");

//         setUser({ ...tempUser });
//         setIsEditing(false);

//          // ✅ FIXED LOCALSTORAGE SYNC
//         localStorage.setItem("full_name", tempUser.full_name || "");
//         localStorage.setItem("department", tempUser.department || "");

//         // ✅ FORCE UPDATE EVERYWHERE
//         window.dispatchEvent(new Event("storage"));
      
//       }
//        else {
//         alert("Error: " + JSON.stringify(data));
//       }

//     } catch (error) {
//       console.error(error);
//       alert("Server error ❌");
//     }
//   };

//   return (
//     <div className="prof-page-container">

//       <nav className="prof-side-nav">
//         <div className="prof-logo-section">Grievance Portal LDCE</div>
//         <button onClick={() => navigate(-1)} className="prof-back-btn">
//           ← Back
//         </button>
//       </nav>

//       <div className="prof-main-content">
//         <div className="prof-card">

//           <div className="prof-header-bg"></div>

//           <div className="prof-info-section">

//             <div className="prof-avatar">
//               {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
//             </div>

//             <div className="prof-details-header">
//               {isEditing ? (
//                 <input
//                   name="full_name"
//                   value={tempUser.full_name}
//                   onChange={handleInputChange}
//                 />
//               ) : (
//                 <h1>{user.full_name}</h1>
//               )}
//               <span className="prof-badge">{user.role}</span>
//             </div>

//             <div className="prof-grid">

//               <div className="prof-item">
//                 <label>Email</label>
//                 <p>{user.email}</p>
//               </div>

//               <div className="prof-item">
//                 <label>Phone</label>
//                 {isEditing ? (
//                   <input
//                     name="phone_number"
//                     value={tempUser.phone_number || ""}
//                     onChange={handleInputChange}
//                   />
//                 ) : (
//                   <p>{user.phone_number}</p>
//                 )}
//               </div>

//               <div className="prof-item">
//                 <label>Department</label>
//                 {isEditing ? (
//                   <select
//                     name="department"
//                     value={tempUser.department}
//                     onChange={handleInputChange}
//                     className="prof-edit-select"
//                   >
//                     <option value="Computer Engineering">Computer Engineering</option>
//                     <option value="Information Technology">Information Technology</option>
//                     <option value="Mechanical Engineering">Mechanical Engineering</option>
//                     <option value="Civil Engineering">Civil Engineering</option>
//                     <option value="Electrical Engineering">Electrical Engineering</option>
//                     <option value="Electronics & Communication">Electronics & Communication</option>
//                   </select>
//                 ) : (
//                   <p>{user.department}</p>
//                 )}
//               </div>

//               <div className="prof-item">
//                 <label>Joined</label>
//                 <p>{new Date(user.date_joined).toDateString()}</p>
//               </div>

//               {user.role === "STUDENT" && (
//                 <div className="prof-item">
//                   <label>Enrollment No</label>
//                   <p>{user.enrollment_no}</p>
//                 </div>
//               )}

//             </div>

//             <div className="prof-actions">
//               {isEditing ? (
//                 <>
//                   <button onClick={handleSaveClick}>Save</button>
//                   <button onClick={handleCancelClick}>Cancel</button>
//                 </>
//               ) : (
//                 <button onClick={handleEditClick}>Edit Profile</button>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile; 