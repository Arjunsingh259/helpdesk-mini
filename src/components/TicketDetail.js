import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const navigate = useNavigate();

  // Mock user
  const user = { id: 2, role: "agent" }; // Change for testing roles

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
        headers: { "x-user-id": user.id, "x-user-role": user.role },
      });
      setTicket(res.data.ticket);
      setComments(res.data.comments);
      setEditTitle(res.data.ticket.title);
      setEditDescription(res.data.ticket.description);
      setEditPriority(res.data.ticket.priority);
      setEditStatus(res.data.ticket.status);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch ticket");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/tickets/${id}`,
        {
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          status: editStatus,
          version: ticket.version,
        },
        { headers: { "x-user-id": user.id, "x-user-role": user.role } }
      );
      setTicket(res.data);
      setEditMode(false);
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Conflict: Ticket was updated by someone else. Refreshing...");
        fetchTicket();
      } else {
        console.error(err);
        alert("Failed to update ticket");
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/tickets/${id}/comments`,
        { content: newComment },
        { headers: { "x-user-id": user.id, "x-user-role": user.role } }
      );
      setNewComment("");
      fetchTicket();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div>
      <h2>Ticket #{ticket.id}</h2>
      {editMode ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Priority:</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Status:</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Title:</strong> {ticket.title}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>SLA:</strong> {ticket.isSLABreached ? "Breached" : "OK"} (Deadline: {new Date(ticket.slaDeadline).toLocaleString()})</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}

      <h3>Timeline</h3>
      <ul>
        <li>Created: {new Date(ticket.createdAt).toLocaleString()}</li>
        <li>Updated: {new Date(ticket.updatedAt).toLocaleString()}</li>
        {comments.map((c) => (
          <li key={c.id}>
            Comment by User {c.userId}: {c.content} ({new Date(c.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>

      <h3>Add Comment</h3>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>

      <button onClick={() => navigate("/tickets")}>Back to List</button>
    </div>
  );
};

export default TicketDetail;
