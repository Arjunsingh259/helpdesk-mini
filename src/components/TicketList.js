import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketList = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [breached, setBreached] = useState([]);

  useEffect(() => {
    fetchTickets();
    fetchBreached();
  }, [search, status, priority, offset]);

  const fetchTickets = async () => {
    try {
      const params = { limit, offset };
      if (search) params.search = search;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      const res = await axios.get("http://localhost:5001/api/tickets", {
        params,
        headers: { "x-user-id": user.id, "x-user-role": user.role },
      });
      setTickets(res.data.tickets);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBreached = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/tickets/breached", {
        headers: { "x-user-id": user.id, "x-user-role": user.role },
      });
      setBreached(res.data.tickets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setOffset(0);
    fetchTickets();
  };

  const nextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const prevPage = () => {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  };

  return (
    <div>
      <h2>Tickets</h2>
      <Link to="/tickets/new">Create New Ticket</Link>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <h3>Breached Tickets ({breached.length})</h3>
      <ul>
        {breached.map((t) => (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`}>{t.title}</Link> - SLA Breached
          </li>
        ))}
      </ul>
      <h3>All Tickets</h3>
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <Link to={`/tickets/${t.id}`}>{t.title}</Link> - {t.status} - {t.priority} - SLA: {t.isSLABreached ? "Breached" : "OK"}
          </li>
        ))}
      </ul>
      <button onClick={prevPage} disabled={offset === 0}>
        Previous
      </button>
      <button onClick={nextPage} disabled={offset + limit >= total}>
        Next
      </button>
    </div>
  );
};

export default TicketList;
