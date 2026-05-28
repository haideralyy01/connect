# Connect — Real-time Chat App

A modern real-time chat application built with **React**, **Tailwind CSS**, and **WebSockets**. Join rooms instantly, chat with friends, and enjoy a sleek dark-themed UI with a violet color palette.

---

## Features

- **Real-time messaging** — powered by WebSocket for instant communication
- **Room-based chat** — create or join rooms with a simple room ID
- **No account required** — just pick a username and start chatting
- **Dark theme** — premium glassmorphic UI with a violet/purple accent palette
- **WhatsApp-style bubbles** — compact message layout with inline timestamps, message grouping, and read indicators
- **SVG icons** — crisp, scalable icons throughout — no emoji dependencies
- **Responsive design** — works on desktop and mobile
- **Auto-scroll** — new messages scroll into view smoothly
- **System notifications** — join/leave events displayed as centered pills

---

## Tech Stack

### Frontend

| Tool             | Purpose                |
| ---------------- | ---------------------- |
| React 19         | UI framework           |
| TypeScript       | Type safety            |
| Tailwind CSS v4  | Utility-first styling  |
| Vite             | Dev server & bundler   |
| React Router v7  | Client-side routing    |
| Inter (Google)   | Typography             |

### Backend

| Tool       | Purpose              |
| ---------- | -------------------- |
| Node.js    | Runtime              |
| TypeScript | Type safety          |
| ws         | WebSocket server     |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/haideralyy01/connect.git
cd connect
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The WebSocket server starts on `ws://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:3000`.

### 4. Start chatting

1. Open the app in your browser
2. Enter a **username** and a **room ID**
3. Share the same room ID with a friend
4. Chat in real-time!

---

## Project Structure

```
Chat App/
├── backend/
│   ├── src/
│   │   └── index.ts          # WebSocket server — rooms, join/leave, broadcast
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg        # App favicon
│   │   └── icons.svg          # Static SVG sprite
│   ├── src/
│   │   ├── icons/             # Reusable SVG icon components
│   │   │   ├── ChatBubbleIcon.tsx
│   │   │   ├── UserIcon.tsx
│   │   │   ├── HashIcon.tsx
│   │   │   ├── SendIcon.tsx
│   │   │   ├── LogOutIcon.tsx
│   │   │   ├── ArrowRightIcon.tsx
│   │   │   ├── SpinnerIcon.tsx
│   │   │   ├── SparkleIcon.tsx
│   │   │   ├── LinkIcon.tsx
│   │   │   └── index.ts       # Barrel exports
│   │   ├── pages/
│   │   │   ├── Login.tsx       # Join page — username + room ID
│   │   │   └── Chat.tsx        # Chat room — messages + input
│   │   ├── App.tsx             # Router setup
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## How It Works

1. **Login page** — User enters a username and room ID, then clicks "Enter Chat Room"
2. **WebSocket connection** — Frontend connects to `ws://localhost:8080` and sends a `join` event
3. **Broadcasting** — Backend tracks users per room and broadcasts messages to all participants
4. **Leave/Disconnect** — Closing the tab or clicking "Leave" notifies other room members

---

## License

MIT
