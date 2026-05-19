// Layout.jsx
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Layout({ title, children }) {

  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);

  const role = (localStorage.getItem("role") || "").toUpperCase();
  const name = localStorage.getItem("full_name");
  const dept = localStorage.getItem("department");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goDashboard = () => {
    if (role === "ADMIN") navigate("/admin-dashboard");
    else if (role === "FACULTY") navigate("/faculty-dashboard");
    else navigate("/dashboard");
  };

  return (
    <div className="app-container">

      {/* ✅ COMMON NAVBAR */}
      <div className="nav-bar">

        <div
          className="nav-left"
          onClick={goDashboard}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo" />

          <div>
            <strong>L.D. College of Engineering</strong>

            <div
              style={{
                fontSize: "12px",
                color: "#64748b"
              }}
            >
              {title} {dept ? `• ${dept}` : ""}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >


          <span
            style={{
              color: "#475569"
            }}
          >
            {name}
          </span>

          <button
            className="nav-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="page-content">
        {children}
      </div>


    </div>
  );
}

export default Layout;












// // Layout.jsx
// import logo from "../assets/logo.png";
// import { useNavigate } from "react-router-dom";
// import Chatbot from "./Chatbot";

// function Layout({ title, children }) {
//   const navigate = useNavigate();

//   const role = (localStorage.getItem("role") || "").toUpperCase();
//   const name = localStorage.getItem("full_name");
//   const dept = localStorage.getItem("department");

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const goDashboard = () => {
//     if (role === "ADMIN") navigate("/admin-dashboard");
//     else if (role === "FACULTY") navigate("/faculty-dashboard");
//     else navigate("/dashboard");
//   };

//   return (
//     <div className="app-container">

//       {/* ✅ COMMON NAVBAR */}
//       <div className="nav-bar">
//         <div className="nav-left" onClick={goDashboard} style={{ cursor: "pointer" }}>
//           <img src={logo} alt="logo" />
//           <div>
//             <strong>L.D. College of Engineering</strong>
//             <div style={{ fontSize: "12px", color: "#64748b" }}>
//               {title} {dept ? `• ${dept}` : ""}
//             </div>
//           </div>
//         </div>

//         <div>
//           <span style={{ marginRight: "15px", color: "#475569" }}>
//             {name}
//           </span>
//           <button className="nav-btn" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div className="page-content">
//         {children}
//       </div>
//       <Chatbot />
//     </div>
//   );
// }

// export default Layout;