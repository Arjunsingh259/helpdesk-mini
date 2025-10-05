<<<<<<< HEAD
# 🧾 HelpDesk Mini — Ticketing System with SLA, Comments & Role-Based Access

> A full-stack HelpDesk system built for the Hackathon challenge (Problem Statement 3).  
> It supports SLA timers, role-based ticket assignments, threaded comments, optimistic locking, and pagination.

---

## 🚀 Overview

**HelpDesk Mini** is a lightweight, full-stack ticket management platform where:
- Users can raise support tickets.
- Agents can manage and comment on them.
- Admins can monitor SLA breaches and overall performance.

The system ensures **data consistency**, **security**, and **robustness** using:
- Optimistic locking for concurrent updates.
- Idempotency keys for duplicate prevention.
- Rate limiting for fairness and reliability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose ORM) |
| Authentication | JWT (JSON Web Token) |
| Other Tools | Express Rate Limit, CORS, dotenv, nodemon |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/helpdesk-mini.git
cd helpdesk-mini
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Configure Environment Variables
Create a .env file in the root directory:

env
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/helpdesk-mini
JWT_SECRET=supersecretkey
4️⃣ Seed the Database (creates test users & tickets)
bash
Copy code
npm run seed
5️⃣ Start the Server
bash
Copy code
npm start
Server runs at:
👉 http://localhost:5000

👥 Test Credentials
Role	Email	Password
Admin	admin@mail.com	admin123
Agent	agent@mail.com	agent123
User	user@mail.com	user123

📚 API Summary
Method	Endpoint	Description
POST	/api/tickets	Create a new ticket (idempotent)
GET	/api/tickets?limit=&offset=&q=	List tickets with pagination & search
GET	/api/tickets/:id	Fetch ticket details
PATCH	/api/tickets/:id	Update ticket (optimistic locking)
POST	/api/tickets/:id/comments	Add threaded comment (idempotent)
GET	/api/health	Health check
GET	/api/_meta	Returns app metadata
GET	/.well-known/hackathon.json	Hackathon manifest file

🔒 Authentication & Roles
Roles supported:

🧑‍💻 User → Can create & view own tickets.

👨‍🔧 Agent → Can view, assign & respond to tickets.

👑 Admin → Full access, can monitor SLA breaches & timelines.

Authentication is handled via JWT tokens.
Include your token in the request header:

makefile
Copy code
Authorization: Bearer <token>
🔄 Pagination Format
Example:
GET /api/tickets?limit=10&offset=0

Response:

json
Copy code
{
  "items": [...],
  "next_offset": 10
}
♻️ Idempotency
All POST requests accept an Idempotency-Key header:

vbnet
Copy code
Idempotency-Key: <unique-key>
If the same key is used again, the system returns the same response without creating duplicates.

⚡ Rate Limits
Each user can make up to 60 requests per minute.
If the limit is exceeded:

json
Copy code
{ "error": { "code": "RATE_LIMIT" } }
🧩 Error Format (Consistent)
Every error follows this JSON structure:

json
Copy code
{ "error": { "code": "FIELD_REQUIRED", "field": "email", "message": "Email is required" } }
🧠 Optimistic Locking (PATCH Updates)
Each ticket has a version field for concurrency control.

Example:
bash
Copy code
PATCH /api/tickets/tkt_1
{
  "title": "Updated title",
  "version": 3
}
If the version is outdated, server returns:

json
Copy code
{
  "error": {
    "code": "CONFLICT",
    "field": "version",
    "message": "Stale update: expected version 3"
  }
}
⏱️ SLA & Timeline Tracking
SLA timer auto-sets: due_at = created_at + sla_seconds

sla_breached = true when ticket isn’t resolved before deadline.

Timeline logs every activity (creation, update, comment, status change).

Example Log:

json
Copy code
{
  "actor": "agent@mail.com",
  "action": "comment_added",
  "ts": "2025-10-05T07:10Z"
}
💬 Threaded Comments Example
Request:
bash
Copy code
POST /api/tickets/:id/comments
Headers:
  Idempotency-Key: comment-123
Body:
{
  "text": "Please restart your browser",
  "parent_id": null
}
Response:
json
Copy code
{
  "id": "c_1",
  "ticket_id": "tkt_123",
  "author_id": "agent_1",
  "text": "Please restart your browser",
  "created_at": "2025-10-05T07:20Z"
}
🧱 Architecture
HelpDesk Mini follows a modular MERN (MongoDB, Express, React, Node) architecture:

Frontend (React) → Handles dashboards, ticket creation, and SLA views.

Backend (Express + MongoDB) → Manages business logic, authentication, and data integrity.

Optimistic Locking → Prevents conflicting updates.

Idempotency Keys → Avoid duplicate requests.

Timeline Logs → Provide full traceability of user actions.

Rate Limiting → Prevents abuse and ensures fair API usage.
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> f00c3cf (Initialize project using Create React App)
