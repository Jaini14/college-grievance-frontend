// Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Home.css";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const role = (localStorage.getItem("role") || "").toUpperCase().trim();
  const name = localStorage.getItem("full_name");

  // ✅ AUTO REDIRECT ADMIN
  useEffect(() => {
    if (token && role === "ADMIN") {
      navigate("/admin-dashboard");
    }
  }, [token, role, navigate]);

  const handleProtectedRoute = (type) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (type === "profile") {
      navigate("/profile");
      return;
    }

    if (role === "FACULTY") {
      if (type === "submit") navigate("/file-complaint");
      else navigate("/faculty-dashboard");
      return;
    }

    if (role === "ADMIN") {
      if (type === "submit") navigate("/file-complaint");
      else navigate("/admin-dashboard");
      return;
    }

    // STUDENT / STAFF
    if (type === "submit") navigate("/file-complaint");
    else if (type === "status") navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="img" style={{ width: "70px" }} />
          <div className="logo">L. D. College of Engineering</div>
        </div>

        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>
              <button onClick={() => navigate("/public-analytics")}>
                 📊 View Analytics
              </button>
              {/* ✅ NEW ADMIN LOGIN BUTTON */}
              <Link to="/login">
                <button style={{ background: "#6c63ff", color: "#fff" }}>
                  Admin Login
                </button>
              </Link>
            </>
          ) : (
            <>
              <button onClick={() => handleProtectedRoute("profile")}>
                Profile
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}

          <Link to="/about"><button>About</button></Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        {token && <h2>Welcome, {name || "User"}</h2>}

        <h1>Your Voice Matters</h1>

        <div>
          <button onClick={() => handleProtectedRoute("submit")}>
            Submit Grievance
          </button>

          <button onClick={() => handleProtectedRoute("status")}>
            Check Status
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;