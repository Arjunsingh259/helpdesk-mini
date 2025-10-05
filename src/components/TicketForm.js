import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TicketForm = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5001/api/tickets",
        { title, description, priority },
        { headers: { "x-user-id": user.id, "x-user-role": user.role } }
      );
      navigate("/tickets");
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);
        alert("Failed to create ticket: " + (err.response.data.error || "Unknown error"));
      } else {
        console.error(err);
        alert("Failed to create ticket: Network or server error");
      }
    }
  };

  return (
    <div>
      <h2>Create New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default TicketForm;
