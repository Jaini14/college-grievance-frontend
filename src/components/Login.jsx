// ✅ FIXED LOGIN.JS
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("https://college-grievance-backend-85gg.onrender.com/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginData.email,   // 🔥 IMPORTANT
        password: loginData.password
      })
    });

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);

    if (response.ok) {
      // ✅ CORRECT JWT STRUCTURE
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);
      localStorage.setItem("full_name", data.full_name);
      localStorage.setItem("department", data.department);

      // redirect
      if (data.role === "ADMIN") {
          navigate("/admin-dashboard");
      } else if (data.role === "FACULTY") {
          navigate("/faculty-dashboard");
      } else {
          navigate("/dashboard");
      }
     
    } else {
      alert(data.detail || "Login failed");
    }

  } catch (err) {
    console.error(err);
  }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p style={{ marginTop: "20px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;