// Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
    department: "",
    enrollment_no: "",
    specialization: "",
    staff_function: ""
  });

  // Staff type state
  const [staffType, setStaffType] = useState("");

  // OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Reset staff type if role changes
    if (name === "role" && value !== "STAFF") {
      setStaffType("");
    }
  };

  // Create payload
  const createPayload = () => {
    return {
      username: formData.full_name,
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      role: formData.role,

      // Student fields
      ...(formData.role === "STUDENT" && {
        department: formData.department,
        enrollment_no: formData.enrollment_no
      }),

      // Faculty fields
      ...(formData.role === "FACULTY" && {
        department: formData.department,
        specialization: formData.specialization
      }),

      // Staff fields
      ...(formData.role === "STAFF" && {
        department: "STAFF",
        staff_function:
          formData.staff_function === "OTHER"
            ? formData.specialization
            : formData.staff_function,
        specialization: staffType
      })
    };
  };

  // SEND OTP
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter email first");
      return;
    }

    try {
      setSendingOtp(true);

      const response = await fetch(
        " http://127.0.0.1:8000/api/send-otp/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
         alert("Your OTP is: " + data.otp);
      } else {
        console.log("OTP Error:", data);
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error while sending OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // FINAL REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please send OTP first");
      return;
    }

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    const payload = {
      ...createPayload(),
      otp: otp
    };

    console.log("Sending payload:", payload);

    try {
      setRegistering(true);

      const response = await fetch(
        " http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        console.log("Error:", data);
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={handleSubmit}
        style={{ width: "400px" }}
      >
        <h2>Grievance System Register</h2>

        {/* ROLE */}
        <div className="input-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Select Role
            </option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="STAFF">Staff</option>
          </select>
          <label>Role</label>
        </div>

        {/* FULL NAME */}
        <div className="input-group">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
        </div>

        {/* EMAIL */}
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder=" "
            onChange={handleChange}
            required
            disabled={otpSent}
          />
          <label>Email</label>
        </div>

        {/* PHONE */}
        <div className="input-group">
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Phone Number</label>
        </div>

        {/* STUDENT ONLY */}
        {formData.role === "STUDENT" && (
          <>
            <div className="input-group">
              <input
                type="text"
                name="enrollment_no"
                value={formData.enrollment_no}
                placeholder=" "
                onChange={handleChange}
                required
              />
              <label>Enrollment No</label>
            </div>

            <div className="input-group">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Select Department
                </option>
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">
                  Civil Engineering
                </option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Electronics & Communication">
                  Electronics & Communication
                </option>
              </select>
              <label>Department</label>
            </div>
          </>
        )}

        {/* FACULTY ONLY */}
        {formData.role === "FACULTY" && (
          <>
            <div className="input-group">
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                placeholder=" "
                onChange={handleChange}
                required
              />
              <label>Specialization</label>
            </div>

            <div className="input-group">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Select Department
                </option>
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">
                  Civil Engineering
                </option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Electronics & Communication">
                  Electronics & Communication
                </option>
              </select>
              <label>Department</label>
            </div>
          </>
        )}

        {/* STAFF ONLY */}
        {formData.role === "STAFF" && (
          <>
            {/* Staff Type */}
            <div className="input-group">
              <select
                value={staffType}
                onChange={(e) => setStaffType(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  Select Staff Type
                </option>
                <option value="WORKER">Worker (LD College)</option>
                <option value="LABOUR">Labour</option>
                <option value="MAINTENANCE">Maintenance Staff</option>
                <option value="ADMIN">Admin Staff</option>
                <option value="SECURITY">Security Staff</option>
                <option value="OTHER">Other</option>
              </select>
              <label>Staff Type</label>
            </div>

            {/* Staff Function */}
            <div className="input-group">
              <select
                name="staff_function"
                value={formData.staff_function}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Select Staff Function
                </option>

                <option value="SECURITY">Security</option>
                <option value="WORKER">Worker</option>
                <option value="CLEANER">Cleaner</option>
                <option value="MANAGEMENT">Management</option>
                <option value="LAB_ASSISTANT">Lab Assistant</option>
                <option value="TECHNICAL">Technical Staff</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Staff Function</label>
            </div>

            {/* Custom Staff Function */}
            {formData.staff_function === "OTHER" && (
              <div className="input-group">
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  placeholder=" "
                  onChange={handleChange}
                  required
                />
                <label>Custom Function</label>
              </div>
            )}
          </>
        )}

        {/* PASSWORD */}
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder=" "
            onChange={handleChange}
            required
          />
          <label>Password</label>
        </div>

        {/* OTP FIELD */}
        {otpSent && (
          <div className="input-group">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder=" "
              required
            />
            <label>Enter OTP</label>
          </div>
        )}

        {/* SEND OTP BUTTON */}
        {!otpSent ? (
          <button
            type="button"
            className="register-btn"
            onClick={handleSendOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <button
            type="submit"
            className="register-btn"
            disabled={registering}
          >
            {registering ? "Registering..." : "Verify & Register"}
          </button>
        )}

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;








// // Register.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import "../styles/Login.css";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     password: "",
//     role: "",
//     department: "",
//     enrollment_no: "",
//     specialization: "",
//     staff_function: ""
//   });

//   // Staff type state
//   const [staffType, setStaffType] = useState("");

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));

//     // Reset staff type if role changes
//     if (name === "role" && value !== "STAFF") {
//       setStaffType("");
//     }
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       username: formData.full_name,
//       full_name: formData.full_name,
//       email: formData.email,
//       phone_number: formData.phone_number,
//       password: formData.password,
//       role: formData.role,

//       // Student fields
//       ...(formData.role === "STUDENT" && {
//         department: formData.department,
//         enrollment_no: formData.enrollment_no
//       }),

//       // Faculty fields
//       ...(formData.role === "FACULTY" && {
//         department: formData.department,
//         specialization: formData.specialization
//       }),

//       // Staff fields
//       ...(formData.role === "STAFF" && {
//         department: "STAFF",
//         staff_function:
//           formData.staff_function === "OTHER"
//             ? formData.specialization
//             : formData.staff_function,
//         specialization: staffType
//       })
//     };

//     console.log("Sending payload:", payload);

//     try {
//       const response = await fetch(
//         "http://127.0.0.1:8000/api/register/",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(payload)
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         alert("Registration successful");
//         navigate("/login");
//       } else {
//         console.log("Error:", data);
//         alert("Error: " + JSON.stringify(data));
//       }
//     } catch (error) {
//       console.error("Server error:", error);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="login-container">
//       <form
//         className="login-form"
//         onSubmit={handleSubmit}
//         style={{ width: "400px" }}
//       >
//         <h2>Grievance System Register</h2>

//         {/* ROLE */}
//         <div className="input-group">
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled hidden>
//               Select Role
//             </option>
//             <option value="STUDENT">Student</option>
//             <option value="FACULTY">Faculty</option>
//             <option value="STAFF">Staff</option>
//           </select>
//           <label>Role</label>
//         </div>

//         {/* FULL NAME */}
//         <div className="input-group">
//           <input
//             type="text"
//             name="full_name"
//             value={formData.full_name}
//             placeholder=" "
//             onChange={handleChange}
//             required
//           />
//           <label>Full Name</label>
//         </div>

//         {/* EMAIL */}
//         <div className="input-group">
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             placeholder=" "
//             onChange={handleChange}
//             required
//           />
//           <label>Email</label>
//         </div>

//         {/* PHONE */}
//         <div className="input-group">
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             placeholder=" "
//             onChange={handleChange}
//             required
//           />
//           <label>Phone Number</label>
//         </div>

//         {/* STUDENT ONLY */}
//         {formData.role === "STUDENT" && (
//           <>
//             <div className="input-group">
//               <input
//                 type="text"
//                 name="enrollment_no"
//                 value={formData.enrollment_no}
//                 placeholder=" "
//                 onChange={handleChange}
//                 required
//               />
//               <label>Enrollment No</label>
//             </div>

//             <div className="input-group">
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="" disabled hidden>
//                   Select Department
//                 </option>
//                 <option value="Computer Engineering">
//                   Computer Engineering
//                 </option>
//                 <option value="Information Technology">
//                   Information Technology
//                 </option>
//                 <option value="Mechanical Engineering">
//                   Mechanical Engineering
//                 </option>
//                 <option value="Civil Engineering">
//                   Civil Engineering
//                 </option>
//                 <option value="Electrical Engineering">
//                   Electrical Engineering
//                 </option>
//                 <option value="Electronics & Communication">
//                   Electronics & Communication
//                 </option>
//               </select>
//               <label>Department</label>
//             </div>
//           </>
//         )}

//         {/* FACULTY ONLY */}
//         {formData.role === "FACULTY" && (
//           <>
//             <div className="input-group">
//               <input
//                 type="text"
//                 name="specialization"
//                 value={formData.specialization}
//                 placeholder=" "
//                 onChange={handleChange}
//                 required
//               />
//               <label>Specialization</label>
//             </div>

//             <div className="input-group">
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="" disabled hidden>
//                   Select Department
//                 </option>
//                 <option value="Computer Engineering">
//                   Computer Engineering
//                 </option>
//                 <option value="Information Technology">
//                   Information Technology
//                 </option>
//                 <option value="Mechanical Engineering">
//                   Mechanical Engineering
//                 </option>
//                 <option value="Civil Engineering">
//                   Civil Engineering
//                 </option>
//                 <option value="Electrical Engineering">
//                   Electrical Engineering
//                 </option>
//                 <option value="Electronics & Communication">
//                   Electronics & Communication
//                 </option>
//               </select>
//               <label>Department</label>
//             </div>
//           </>
//         )}

//         {/* STAFF ONLY */}
//         {formData.role === "STAFF" && (
//           <>
//             {/* Staff Type */}
//             <div className="input-group">
//               <select
//                 value={staffType}
//                 onChange={(e) => setStaffType(e.target.value)}
//                 required
//               >
//                 <option value="" disabled hidden>
//                   Select Staff Type
//                 </option>
//                 <option value="WORKER">Worker (LD College)</option>
//                 <option value="LABOUR">Labour</option>
//                 <option value="MAINTENANCE">Maintenance Staff</option>
//                 <option value="ADMIN">Admin Staff</option>
//                 <option value="SECURITY">Security Staff</option>
//                 <option value="OTHER">Other</option>
//               </select>
//               <label>Staff Type</label>
//             </div>

//             {/* Staff Function */}
//             <div className="input-group">
//               <select
//                 name="staff_function"
//                 value={formData.staff_function}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="" disabled hidden>
//                   Select Staff Function
//                 </option>

//                 <option value="SECURITY">Security</option>
//                 <option value="WORKER">Worker</option>
//                 <option value="CLEANER">Cleaner</option>
//                 <option value="MANAGEMENT">Management</option>
//                 <option value="LAB_ASSISTANT">Lab Assistant</option>
//                 <option value="TECHNICAL">Technical Staff</option>
//                 <option value="OTHER">Other</option>
//               </select>

//               <label>Staff Function</label>
//             </div>

//             {/* Custom Staff Function */}
//             {formData.staff_function === "OTHER" && (
//               <div className="input-group">
//                 <input
//                   type="text"
//                   name="specialization"
//                   value={formData.specialization}
//                   placeholder=" "
//                   onChange={handleChange}
//                   required
//                 />
//                 <label>Custom Function</label>
//               </div>
//             )}
//           </>
//         )}

//         {/* PASSWORD */}
//         <div className="input-group">
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             placeholder=" "
//             onChange={handleChange}
//             required
//           />
//           <label>Password</label>
//         </div>

//         <button type="submit" className="register-btn">
//           Register
//         </button>

//         <p style={{ marginTop: "15px", textAlign: "center" }}>
//           Already have an account?{" "}
//           <Link to="/login">Login here</Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Register;





