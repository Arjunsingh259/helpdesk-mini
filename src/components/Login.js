import React, { useState } from "react";

function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId || !userRole) {
      alert("Please enter user ID and select role");
      return;
    }
    onLogin({ userId: parseInt(userId), userRole });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID: </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role: </label>
          <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
