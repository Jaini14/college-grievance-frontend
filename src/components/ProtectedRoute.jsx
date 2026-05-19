// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // ✅ always use same key across project
  const token = localStorage.getItem("access");

  // ✅ normalize role (prevents ALL case + space bugs)
  const role = (localStorage.getItem("role") || "GUEST")
    .toUpperCase()
    .trim();

  // 🔐 not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 role not allowed → send to correct dashboard instead of breaking UX
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
    if (role === "FACULTY") return <Navigate to="/faculty-dashboard" replace />;
    return <Navigate to="/dashboard" replace />; // STUDENT / STAFF
  }

  return children;
}

export default ProtectedRoute;