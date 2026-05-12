<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Fastify-5-202020?style=for-the-badge&logo=fastify" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/Anthropic-Claude-7c5cfc?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

<h1 align="center">🧠 Study Buddy</h1>

<p align="center">
  <strong>An emotion-aware AI tutoring platform that adapts to how you feel.</strong><br/>
  When you're frustrated it simplifies. When you're bored it challenges. Real learning, real care.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Tutoring** | Personalized explanations from an Anthropic Claude-powered tutor that adapts its teaching style in real-time |
| ❤️ **Emotion-Aware** | Detects when you're frustrated, confused, or bored and automatically adjusts its pedagogical approach |
| 💬 **Interactive Chat** | Natural conversations with real-time SSE streaming for a seamless learning experience |
| 📊 **Learning Analytics** | Track emotional patterns and study habits to optimize your learning sessions |
| 🃏 **Flashcard Generation** | Create and manage flashcard decks to reinforce what you've learned |
| 🔒 **Privacy First** | Full consent controls over emotion data — you decide what gets stored and for how long |
| 🔑 **Secure Auth** | Cookie-based session authentication with Argon2 password hashing |

---

## 🏗️ Tech Stack

### Frontend (`/app`)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **UI:** React 19, Framer Motion, Lucide Icons
- **Styling:** Tailwind CSS 4, custom glassmorphism design system
- **Markdown:** react-markdown with KaTeX math rendering
- **Charts:** Recharts

### Backend (`/backend/study-buddy-backend`)
- **Runtime:** Node.js
- **Framework:** [Fastify 5](https://www.fastify.io/)
- **Language:** TypeScript 5
- **ORM:** [Prisma 6](https://www.prisma.io/) with PostgreSQL
- **AI:** [Anthropic Claude SDK](https://docs.anthropic.com/)
- **Auth:** Cookie-based sessions with [Argon2](https://github.com/ranisalt/node-argon2) hashing
- **Validation:** [Zod](https://zod.dev/)
- **Logging:** [Pino](https://getpino.io/)
- **Security:** CORS, rate limiting, httpOnly cookies

---

## 🏛️ Architecture

```
┌─────────────────────────┐         ┌─────────────────────────────┐
│      Next.js Frontend   │  HTTP   │     Fastify Backend         │
│                         │◄───────►│                             │
│  ┌───────────────────┐  │  SSE    │  ┌───────────────────────┐  │
│  │  Zustand Stores   │  │◄───────►│  │  Controllers          │  │
│  │  • authStore      │  │         │  │  • auth / consent     │  │
│  │  • studyStore     │  │         │  │  • tutor / emotions   │  │
│  └───────────────────┘  │         │  │  • flashcards         │  │
│                         │         │  └───────────┬───────────┘  │
│  ┌───────────────────┐  │         │              │              │
│  │  Service Layer    │  │         │  ┌───────────▼───────────┐  │
│  │  • API client     │  │         │  │  Service Layer        │  │
│  │  • SSE streaming  │  │         │  │  • authService        │  │
│  │  • auth / consent │  │         │  │  • tutorService (SSE) │  │
│  └───────────────────┘  │         │  │  • emotionService     │  │
│                         │         │  │  • flashcardService   │  │
│  ┌───────────────────┐  │         │  └───────────┬───────────┘  │
│  │  Components       │  │         │              │              │
│  │  • TutorChat      │  │         │  ┌───────────▼───────────┐  │
│  │  • EmotionPicker  │  │         │  │  AI Module            │  │
│  │  • AuthGuard      │  │         │  │  • Anthropic client   │  │
│  │  • Navbar         │  │         │  │  • Prompt builder     │  │
│  └───────────────────┘  │         │  │  • Emotion context    │  │
│                         │         │  └───────────┬───────────┘  │
│  Pages:                 │         │              │              │
│  • / (Landing)          │         │  ┌───────────▼───────────┐  │
│  • /login               │         │  │  Prisma + PostgreSQL  │  │
│  • /dashboard           │         │  │  • Users & Sessions   │  │
│  • /study               │         │  │  • Tutor Threads      │  │
│  • /analytics           │         │  │  • Emotion Samples    │  │
│  • /settings            │         │  │  • Flashcard Decks    │  │
└─────────────────────────┘         │  └───────────────────────┘  │
                                    └─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (running locally or via Docker)
- **Anthropic API Key** ([get one here](https://console.anthropic.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/vihaanexee/studybuddy.git
cd studybuddy
```

### 2. Set Up the Backend

```bash
cd backend/study-buddy-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, ANTHROPIC_API_KEY, and COOKIE_SECRET

# Push the database schema
npx prisma db push

# Start the dev server
npm run dev
```

The backend will start on `http://localhost:4000`.

### 3. Set Up the Frontend

```bash
cd app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend will start on `http://localhost:3000`.

### Environment Variables

#### Backend (`backend/study-buddy-backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/studybuddy` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |
| `COOKIE_SECRET` | Secret for signing cookies (min 32 chars) | — |
| `SESSION_TTL_HOURS` | Session expiry duration | `72` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | — |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

---

## 📡 API Reference

The backend exposes a RESTful API documented via **OpenAPI 3.0**. See [`backend/study-buddy-backend/openapi.yaml`](backend/study-buddy-backend/openapi.yaml) for the full specification.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login (sets session cookie) |
| `POST` | `/api/v1/auth/logout` | Logout (clears session) |
| `GET` | `/api/v1/me` | Get current user info |
| `GET/PUT` | `/api/v1/consent` | Manage privacy consent settings |
| `POST` | `/api/v1/study-sessions` | Create a study session |
| `POST` | `/api/v1/tutor/threads` | Create a tutor thread |
| `GET` | `/api/v1/tutor/threads` | List all threads |
| `POST` | `/api/v1/tutor/threads/:id/messages` | Send a message |
| `GET` | `/api/v1/tutor/threads/:id/stream` | Stream AI response (SSE) |
| `POST` | `/api/v1/emotions/samples` | Submit emotion samples |
| `POST` | `/api/v1/flashcards/decks` | Create a flashcard deck |
| `GET` | `/api/v1/flashcards/decks` | List flashcard decks |
| `POST` | `/api/v1/flashcards/decks/:id/cards` | Add cards to a deck |
| `GET` | `/health` | Health check |

---

## 📁 Project Structure

```
studybuddy/
├── app/                              # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Root layout (Inter font, Navbar, Auth)
│   │   │   ├── globals.css           # Design system & theme
│   │   │   ├── login/                # Authentication page
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── study/                # Study session & chat interface
│   │   │   ├── analytics/            # Emotion analytics & tracking
│   │   │   └── settings/             # Privacy & consent settings
│   │   ├── components/
│   │   │   ├── TutorChat.tsx         # Real-time AI chat with SSE streaming
│   │   │   ├── EmotionPicker.tsx     # Emotion self-reporting widget
│   │   │   ├── AuthGuard.tsx         # Protected route wrapper
│   │   │   ├── AuthProvider.tsx      # Auth state initialization
│   │   │   └── Navbar.tsx            # Navigation bar
│   │   ├── services/                 # API client layer
│   │   │   ├── api.ts                # Base HTTP client
│   │   │   ├── auth.ts               # Auth endpoints
│   │   │   ├── tutor.ts              # Tutor & SSE streaming
│   │   │   ├── emotions.ts           # Emotion data submission
│   │   │   ├── consent.ts            # Consent management
│   │   │   └── flashcards.ts         # Flashcard CRUD
│   │   └── stores/                   # Zustand state management
│   │       ├── authStore.ts          # Auth state & user session
│   │       └── studyStore.ts         # Study session & thread state
│   ├── package.json
│   └── next.config.ts
│
├── backend/
│   └── study-buddy-backend/          # Fastify Backend
│       ├── src/
│       │   ├── server.ts             # Fastify app entry point
│       │   ├── config.ts             # Environment configuration
│       │   ├── controllers/          # Route handlers
│       │   │   ├── auth.ts
│       │   │   ├── consent.ts
│       │   │   ├── tutor.ts
│       │   │   ├── emotions.ts
│       │   │   └── flashcards.ts
│       │   ├── services/             # Business logic
│       │   │   ├── authService.ts
│       │   │   ├── consentService.ts
│       │   │   ├── tutorService.ts
│       │   │   ├── emotionService.ts
│       │   │   ├── sessionService.ts
│       │   │   └── flashcardService.ts
│       │   ├── ai/                   # AI integration
│       │   │   ├── anthropic.ts      # Claude client
│       │   │   ├── promptBuilder.ts  # System prompt construction
│       │   │   ├── emotionContext.ts  # Emotion-aware context injection
│       │   │   └── provider.ts       # AI provider abstraction
│       │   ├── auth/                 # Auth middleware
│       │   ├── db/                   # Prisma client
│       │   ├── routes/               # Route registration
│       │   ├── utils/                # Logger, error handler
│       │   └── validators/           # Zod schemas
│       ├── prisma/
│       │   └── schema.prisma         # Database schema
│       ├── openapi.yaml              # API specification
│       ├── .env.example              # Environment template
│       └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

The application uses **PostgreSQL** with **Prisma ORM**. Key models:

- **User** — Account with email/password authentication
- **Session** — Cookie-based session tokens (nanoid)
- **ConsentSettings** — Per-user privacy preferences
- **StudySession** — Timed study session container
- **TutorThread** — Conversation thread within a session
- **TutorMessage** — Individual messages (user/assistant/system)
- **EmotionSample** — Self-reported or webcam-detected emotions
- **FlashcardDeck / FlashcardCard** — Spaced repetition flashcards

---

## 🔐 Authentication Flow

1. **Register/Login** → Backend hashes password with Argon2, creates a session token (nanoid), sets `httpOnly` cookie
2. **Authenticated requests** → Session cookie sent automatically, validated via middleware
3. **Logout** → Session deleted from DB, cookie cleared

---

## 🎭 Emotion-Aware Tutoring

The core differentiator — the AI tutor dynamically adjusts based on emotional context:

1. **Self-Report:** Users report emotions via the EmotionPicker component
2. **Context Injection:** Recent emotion samples are fetched and injected into the AI prompt
3. **Adaptive Response:** Claude receives emotion context and modifies its teaching style accordingly
   - 😤 **Frustrated** → Simplifies explanations, uses analogies
   - 😐 **Bored** → Increases challenge level, adds engaging examples
   - 😕 **Confused** → Breaks down concepts step-by-step
   - 😊 **Happy** → Maintains pace, introduces new topics

---

## 🛠️ Development

```bash
# Backend — watch mode with tsx
cd backend/study-buddy-backend && npm run dev

# Frontend — Next.js dev server  
cd app && npm run dev

# Database — Prisma Studio (visual DB explorer)
cd backend/study-buddy-backend && npx prisma studio

# Build for production
cd app && npm run build
cd backend/study-buddy-backend && npm run build
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ and 🧠 by <a href="https://github.com/vihaanexee">vihaanexee</a>
</p>
