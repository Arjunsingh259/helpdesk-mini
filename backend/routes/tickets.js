const express = require("express");
const router = express.Router();

const {
  Ticket,
  Comment,
  users,
  getUserById,
  getTickets,
  getTicketById,
  getCommentsByTicketId,
  addTicket,
  addComment,
  getBreachedTickets,
} = require("../models/tickets");

// Middleware to mock user authentication and role
function mockAuth(req, res, next) {
  // For demo, user id and role passed in headers
  const userId = parseInt(req.headers["x-user-id"]);
  const userRole = req.headers["x-user-role"];
  if (!userId || !userRole) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = { id: userId, role: userRole };
  next();
}

router.use(mockAuth);

// POST /api/tickets - create ticket
router.post("/", (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const ticket = new Ticket(title, description, priority, req.user.id);
  addTicket(ticket);
  res.status(201).json(ticket);
});

// GET /api/tickets - list tickets with pagination and search
router.get("/", (req, res) => {
  const { limit = 10, offset = 0, search, status, priority, assignedTo } = req.query;
  const query = { search, status, priority, assignedTo };
  const { tickets, total } = getTickets(query, parseInt(limit), parseInt(offset));
  res.json({ tickets, total });
});

// GET /api/tickets/:id - get ticket detail with comments timeline
router.get("/:id", (req, res) => {
  const ticket = getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  const comments = getCommentsByTicketId(ticket.id);
  res.json({ ticket, comments });
});

// PATCH /api/tickets/:id - update ticket with optimistic locking
router.patch("/:id", (req, res) => {
  const ticket = getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  // Check version for optimistic locking
  const clientVersion = req.body.version;
  if (clientVersion === undefined) {
    return res.status(400).json({ error: "Missing version for optimistic locking" });
  }
  if (ticket.version !== clientVersion) {
    return res.status(409).json({ error: "Conflict: stale ticket version" });
  }

  // Role-based access: only admin or assigned agent or creator can update
  if (
    req.user.role !== "admin" &&
    req.user.id !== ticket.assignedTo &&
    req.user.id !== ticket.userId
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const fieldsToUpdate = {};
    if (req.body.title) fieldsToUpdate.title = req.body.title;
    if (req.body.description) fieldsToUpdate.description = req.body.description;
    if (req.body.priority) fieldsToUpdate.priority = req.body.priority;
    if (req.body.status) fieldsToUpdate.status = req.body.status;
    if (req.body.assignedTo) fieldsToUpdate.assignedTo = req.body.assignedTo;

    ticket.update(fieldsToUpdate, clientVersion);
    res.json(ticket);
  } catch (err) {
    if (err.message === "Version conflict") {
      return res.status(409).json({ error: "Conflict: stale ticket version" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/tickets/:id/comments - add comment
router.post("/:id/comments", (req, res) => {
  const ticket = getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const { content, parentId } = req.body;
  if (!content) return res.status(400).json({ error: "Missing comment content" });

  // Role-based access: only admin, agent, or creator can comment
  if (
    req.user.role !== "admin" &&
    req.user.role !== "agent" &&
    req.user.id !== ticket.userId
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const comment = new Comment(ticket.id, req.user.id, content, parentId);
  addComment(comment);
  res.status(201).json(comment);
});

// GET /api/tickets/breached - list breached tickets
router.get("/breached", (req, res) => {
  const breached = getBreachedTickets();
  res.json({ tickets: breached });
});

module.exports = router;
