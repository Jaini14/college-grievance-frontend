// ScheduleMeeting.jsx
import { useState } from "react";

function ScheduleMeeting() {
  const token = localStorage.getItem("access");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meeting_type: "ONLINE",
    meeting_link: "",
    meeting_location: "",
    meeting_datetime: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://college-grievance-backend-85gg.onrender.com/api/create-meeting/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Meeting created successfully");
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <select
        name="meeting_type"
        onChange={handleChange}
      >
        <option value="ONLINE">Online</option>
        <option value="OFFLINE">Offline</option>
      </select>

      <input
        name="meeting_link"
        placeholder="Meeting Link"
        onChange={handleChange}
      />

      <input
        name="meeting_location"
        placeholder="Location"
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="meeting_datetime"
        onChange={handleChange}
      />

      <button type="submit">
        Schedule Meeting
      </button>
    </form>
  );
}

export default ScheduleMeeting;