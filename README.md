# Axxon

Axxon is a modern productivity platform designed to help individuals and teams plan tasks, manage projects, and build consistent habits — all in one place. With powerful features like collaborative boards, real-time messaging, and actionable analytics, Axxon brings structure and insight to your daily workflow.

## 🚀 Features

### ✅ Core Functionality
- **Boards & Todos**
  - Organize todos by board and category (e.g., "To Do", "In Progress", "Done")
  - Assign tasks to users, set due dates, priorities, and tags (labels)
  - Fully typed RESTful API backend with dynamic routing and relational modeling

- **Categories & Labels**
  - Customizable categories per board
  - Many-to-many tagging system with color-coded labels

- **User Management**
  - Google OAuth login & signup
  - Invite collaborators to boards by email
  - Role-based membership model (coming soon)

### 📊 Productivity Insights (Coming Soon)
- Board analytics dashboard for visualizing:
  - Task completion trends
  - Label/category distribution
  - Weekly performance summaries
- AI-generated feedback based on recent activity (planned)

### 💬 Messaging (Planned)
- Board-level group chat
- Direct messages and group chats for team communication

### 🧠 Design Philosophy
- Clean, responsive SPA built with Next.js App Router
- Optimized for fast load and fetch times with TanStack Query
- Modular architecture with small API route files and scalable controller and model logic
- Fully typed PostgreSQL schema using Knex and TypeScript

---

## 🧱 Tech Stack

| Layer        | Technology                      |
|-------------|----------------------------------|
| Frontend     | Next.js (App Router), Tailwind CSS, TanStack Query |
| Backend      | Next.js API Routes, TypeScript, Knex.js |
| Database     | PostgreSQL                      |
| Auth         | Google OAuth, JWT (via Cookies) |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL database
- Google Cloud OAuth credentials
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Setup your environment
cp .env.example .env
# Fill in DB credentials and Google OAuth keys

# Run migrations and seed data
npm run migrate:make
npm run seed

# Start Development 
pnpm dev
```

📈 Status

The backend and API are fully implemented with seeded data and type-safe queries.
Frontend development is actively in progress, with SPA routing, modals, and TanStack Query setup underway.

## 📅 Roadmap

- [x] Backend API with RESTful routes
- [x] Board, Category, Todo, Label, and User models
- [x] Google OAuth + DB user creation
- [x] Seeded relational PostgreSQL schema
- [ ] Complete full UI for todos and boards
- [ ] Calendar dashboard view
- [ ] Board-level messaging
- [ ] Board analytics dashboard
- [ ] AI-based productivity insights


