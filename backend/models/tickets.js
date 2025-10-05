// In-memory data store for tickets
let tickets = [];
let ticketIdCounter = 1;

// Ticket model
class Ticket {
  constructor(title, description, priority, userId) {
    this.id = ticketIdCounter++;
    this.title = title;
    this.description = description;
    this.priority = priority; // low, medium, high
    this.status = 'open'; // open, in_progress, resolved, closed
    this.assignedTo = null; // agent id
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.version = 1; // for optimistic locking
    this.slaDeadline = this.calculateSLADeadline();
    this.userId = userId; // creator
  }

  calculateSLADeadline() {
    // SLA: 24 hours for high, 48 for medium, 72 for low
    const hours = { high: 24, medium: 48, low: 72 };
    const deadline = new Date(this.createdAt);
    deadline.setHours(deadline.getHours() + hours[this.priority]);
    return deadline;
  }

  isSLABreached() {
    return new Date() > this.slaDeadline;
  }

  update(fields, version) {
    if (this.version !== version) {
      throw new Error('Version conflict');
    }
    Object.assign(this, fields);
    this.updatedAt = new Date();
    this.version++;
    this.slaDeadline = this.calculateSLADeadline(); // recalculate if priority changed
  }
}

// Comment model
class Comment {
  constructor(ticketId, userId, content, parentId = null) {
    this.id = ticketIdCounter++; // reuse counter for simplicity
    this.ticketId = ticketId;
    this.userId = userId;
    this.content = content;
    this.parentId = parentId; // for threading
    this.createdAt = new Date();
  }
}

// In-memory comments
let comments = [];

// User model (mock)
const users = [
  { id: 1, username: 'user1', role: 'user' },
  { id: 2, username: 'agent1', role: 'agent' },
  { id: 3, username: 'admin1', role: 'admin' },
];

function getUserById(id) {
  return users.find(u => u.id === id);
}

function getTickets(query = {}, limit = 10, offset = 0) {
  let filtered = tickets;

  if (query.search) {
    const search = query.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      comments.some(c => c.ticketId === t.id && c.content.toLowerCase().includes(search))
    );
  }

  if (query.status) {
    filtered = filtered.filter(t => t.status === query.status);
  }

  if (query.priority) {
    filtered = filtered.filter(t => t.priority === query.priority);
  }

  if (query.assignedTo) {
    filtered = filtered.filter(t => t.assignedTo === query.assignedTo);
  }

  // Sort by createdAt desc
  filtered.sort((a, b) => b.createdAt - a.createdAt);

  const paginated = filtered.slice(offset, offset + limit);
  return { tickets: paginated, total: filtered.length };
}

function getTicketById(id) {
  return tickets.find(t => t.id === parseInt(id));
}

function getCommentsByTicketId(ticketId) {
  return comments.filter(c => c.ticketId === parseInt(ticketId)).sort((a, b) => a.createdAt - b.createdAt);
}

function addTicket(ticket) {
  tickets.push(ticket);
  return ticket;
}

function addComment(comment) {
  comments.push(comment);
  return comment;
}

function getBreachedTickets() {
  return tickets.filter(t => t.isSLABreached());
}

module.exports = {
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
};
