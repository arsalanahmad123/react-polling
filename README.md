# 🗳️ Real-Time Polling App

A modern, full-stack real-time polling application built with **React**, **Supabase**, and **ShadCN UI**. Users can create polls, vote live, see real-time results, and manage their polls with ease.

---

## 🚀 Features

- 🔐 **Authentication** with Supabase (email/password + anonymous)
- 📊 **Create polls** with multiple options (2–10 choices)
- ⚙️ **Poll settings**:  
  - Allow multiple selections  
  - Allow vote change  
  - Show results before voting
- 🗳️ **Vote live** with real-time updates via Supabase Realtime
- 📈 **Live results** displayed using Recharts (Bar, Pie, Trend)
- 🔍 **Search**, **filter**, and **paginate** through public polls
- 👤 **User profile page** with:
  - Polls created
  - Polls voted
- 🧼 Modular UI with [ShadCN UI](https://ui.shadcn.dev/)

---

## 📁 Project Structure

src/
│
├── components/ # Reusable UI components
│ ├── poll/ # Poll UI (VoteForm, Results, Header, etc.)
│ ├── profile/ # Profile page components
│ ├── ui/ # ShadCN UI overrides and shared UI
│
├── contexts/ # Auth context using Supabase
├── hooks/ # Custom React hooks (e.g., useRealtimePolls)
├── lib/ # Supabase client, helper functions, constants
├── pages/ # Page components (PollList, CreatePoll, Profile)
├── routes/ # Route declarations
├── types/ # TypeScript types (Poll, Vote, Settings, etc.)
└── App.tsx # Main app entry


---

## 🧪 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Kit**: [ShadCN UI](https://ui.shadcn.dev/), Tailwind CSS, Lucide Icons
- **State**: React Context (Auth), useState, useEffect
- **Backend**: [Supabase](https://supabase.io/)
  - Database: PostgreSQL
  - Realtime: Supabase Channels
  - Auth: Supabase Auth
- **Charts**: Recharts (BarChart, PieChart, LineChart)

---

## 🛠️ Getting Started

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/arsalanahmad123/react-polling.git
cd real-time-poll-app

2. 📁 Install Dependencies

npm install

3. 🔐 Setup Environment Variables

Create a .env file at the root:

VITE_SUPBASE_PROJECT_URL=https://your-project.supabase.co
VITE_ANON_SUPABASE_KEY=your-anon-key

4. 🧱 Supabase Database Schema
🗳️ polls Table
Column	Type	Description
id	UUID (PK)	Unique poll ID
question	TEXT	Poll question
options	JSONB	Array of options
settings	JSONB	Settings (allowMultiple, etc)
ends_at	TIMESTAMP	Optional end time
created_by	UUID	Supabase user ID (FK)
created_at	TIMESTAMP	Created time
✅ votes Table
Column	Type	Description
id	UUID (PK)	Unique vote ID
poll_id	UUID	FK to polls
user_id	UUID	FK to auth.users
selected	JSONB	Selected options (array or id)
voted_at	TIMESTAMP	Vote timestamp

    ✅ Enable Row Level Security (RLS) and write appropriate policies.

🔴 Realtime Setup

Go to Supabase Dashboard:

    Enable Realtime Replication on polls and votes tables.

    Use a broadcast channel like:

supabase.channel('realtime-polls')

📄 Example .env

VITE_SUPBASE_PROJECT_URL=https://your-project.supabase.co
VITE_ANON_SUPABASE_KEY=your-anon-key

✨ Pages Overview
Route	Description
/	Discover polls (search/filter)
/create	Create a new poll
/poll/:id	Vote & view poll results
/poll/:id/edit	Edit a poll (if creator)
/profile	Profile page (voted/created)
📈 Poll Results Visualization

We use Tabs to switch between result charts:

    📊 Bar Chart

    🥧 Pie Chart

    📈 Line/Trend Chart
    All charts are powered by Recharts, and results are updated live with Supabase Realtime.

🤝 Contributing

git checkout -b feature/your-feature
npm run dev
git commit -m "Add feature"
git push origin feature/your-feature

Open a pull request once you're ready. Please ensure code is formatted with Prettier and passes type checks.