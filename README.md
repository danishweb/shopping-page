# Karini AI - Monorepo Setup

A full-stack e-commerce application with a Next.js frontend and Express backend. Users can browse/search products, add/remove from cart, and use a chat interface for natural language queries (e.g., "Find SKU 12345", "Show electronics under $50").

---

## Features

- 🛍️ Browse/search items by SKU or name
- 🔍 Chat interface for flexible queries
- 🛒 Add/remove from cart
- 💻 Responsive SPA
- ⚡ Fast local/dev setup with npm workspaces

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB
- **State Management:** Zustand
- **Deployment:** Vercel

---

## Monorepo Structure (npm workspaces)

```
karini-ai/
├── backend/             # Express + MongoDB API
├── frontend/            # Next.js UI
└── docs/                # Requirements, etc.
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js v18+
- pnpm or npm

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/karini-ai.git
cd karini-ai
```

### 2. Setup Backend

```bash
cd backend
pnpm install   # or npm install
# Copy .env.example to .env and set your MongoDB URI and other variables
pnpm dev       # or npm run dev
# Runs backend at http://localhost:5000
```

### 3. Setup Frontend

```bash
cd frontend
pnpm install   # or npm install
# Copy .env.example to .env if needed
pnpm dev       # or npm run dev
# Runs frontend at http://localhost:3000
```

---

## Deployment

- Deploy backend and frontend separately to Vercel, Netlify, or AWS.
- Example:
  - Frontend: [https://karini-fe.vercel.app](https://karini-fe.vercel.app)
  - Backend: [https://karini-be.vercel.app](https://karini-be.vercel.app)
- Update environment variables in your hosting provider as needed.

---

## License

MIT

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file:

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
ALLOWED_ORIGINS=http://localhost:3000
```

4. Start the development server:

```bash
pnpm dev
```

The backend will run on http://localhost:4000

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

The frontend will run on http://localhost:3000

## Project Structure

```
karini-ai/
├── backend/             # Express backend
│   ├── src/             # Source code
│   │   ├── db/          # Database connection
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Utility functions
│   └── package.json     # Backend dependencies
├── frontend/            # Next.js frontend
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   └── package.json     # Frontend dependencies
└── README.md            # Project documentation
```

## License

MIT
