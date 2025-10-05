import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketDetail from "./components/TicketDetail";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <h1>HelpDesk Mini</h1>
        <nav>
          <ul>
            <li>
              <Link to="/tickets">Ticket List</Link>
            </li>
            <li>
              <Link to="/tickets/new">New Ticket</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/tickets" element={<TicketList user={user} />} />
          <Route path="/tickets/new" element={<TicketForm user={user} />} />
          <Route path="/tickets/:id" element={<TicketDetail user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
