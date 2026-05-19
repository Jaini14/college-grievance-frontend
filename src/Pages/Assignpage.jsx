// AssignPage.jsx
import Layout from "../components/Layout";
import { useState } from "react";

function AssignPage({ grievance, facultyList }) {
  const [faculty, setFaculty] = useState("");
  const [instruction, setInstruction] = useState("");

  return (
    <Layout title="Assign Grievance">

      <div className="card">

        <h2>{grievance?.subject}</h2>
        <p><b>Student:</b> {grievance?.student}</p>

        <label>Select Faculty</label>
        <select onChange={(e)=>setFaculty(e.target.value)}>
          <option>Select</option>
          {facultyList?.map(f => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.function})
            </option>
          ))}
        </select>

        <label>Instruction</label>
        <textarea
          value={instruction}
          onChange={(e)=>setInstruction(e.target.value)}
        />

        <button>Assign</button>

      </div>

    </Layout>
  );
}

export default AssignPage;