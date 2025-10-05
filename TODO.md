# HelpDesk Mini Implementation TODO

## Backend Implementation
- [x] Set up data models for tickets, comments, users, roles, SLA
- [x] Implement POST /api/tickets API
- [x] Implement GET /api/tickets with pagination and search
- [x] Implement GET /api/tickets/:id with timeline and comments
- [x] Implement PATCH /api/tickets/:id with optimistic locking and role checks
- [x] Implement POST /api/tickets/:id/comments with threaded comments
- [x] Implement SLA timer logic and breached ticket detection

## Frontend Implementation
- [x] Install React Router and set up routing for /tickets, /tickets/new, /tickets/:id
- [x] Create TicketList component for /tickets page with pagination, search, SLA status
- [x] Create TicketForm component for /tickets/new page
- [x] Create TicketDetail component for /tickets/:id page with timeline, comments, update form
- [x] Implement role-based access control on frontend
- [x] Add authentication and role management (mock or simple)

## Testing and Validation
- [x] Test all APIs for correct responses
- [x] Test SLA deadlines and breached tickets
- [x] Test optimistic locking with 409 on stale PATCH
- [x] Test pagination and search functionality
- [x] Test role-based access
