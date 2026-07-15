# OrbitOps — Intelligent Mission Planning Assistant

OrbitOps is a state-of-the-art intelligent mission planning and scheduler assistant for space ground operations, satellite networks, and payload configuration. The application features constraint optimization for resolving scheduling conflicts, resource intelligence algorithms, and a real-time monitoring dashboard.

---

## Key Features

1. **Mission Operations Dashboard:** Monitor active satellites, ground stations, operational payloads, and active notifications.
2. **Interactive Mission Planner:** Dynamic creation, modification, duplication, and deletion of space missions.
3. **Constraint-Based Optimization:** Branch and Bound conflict resolution engine powered by `Google OR-Tools` to resolve overlaps and manage power/battery budgets.
4. **Telemetry Visualization:** Real-time visual monitoring of satellite batteries, temperatures, signal strength, CPU, and memory usage.
5. **Database Integration:** Persistent data storage using PostgreSQL (with out-of-the-box support for Supabase) and SQLAlchemy AsyncIO.

---

## Technology Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios.
* **Backend:** FastAPI, Python, SQLAlchemy (AsyncIO), Pydantic, APScheduler, Redis.
* **AI & Optimization:** Google OR-Tools, NetworkX, NumPy, Pandas, Scikit-Learn.
* **Database:** PostgreSQL (compatible with Supabase).

---

## Getting Started

### 1. Database Setup (Supabase / PostgreSQL)

The system requires a running PostgreSQL database. You can use a local PostgreSQL instance or host it on **Supabase**.

#### Option A: Supabase (Recommended)
1. Go to [Supabase](https://supabase.com) and create a free project.
2. Go to **Project Settings** -> **Database** -> **Connection string** -> **URI**.
3. Copy the URL string (using the transaction pooler on port `6543` or direct connection on `5432`). It will look like this:
   ```env
   DATABASE_URL="postgresql://postgres.[your-project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
   ```
4. Paste this connection URI into your `.env` file (see below). The backend automatically translates `postgresql://` and `postgres://` schemes to `postgresql+asyncpg://` for async compatibility.

---

### 2. Backend Configuration

1. Copy the environment template:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Open the `.env` file and set your database connection URL:
   ```env
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --port 8000 --reload
   ```
   *Note: At startup, the server automatically connects to the database, creates all schemas, and seeds default mock data (satellites, ground stations, payloads, and initial missions) if the tables are empty.*
5. Access Swagger API documentation at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Frontend Configuration

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Verify API base URL in `frontend/.env.local` is set to:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser at: [http://localhost:5173](http://localhost:5173)

---

## Database Schema Structure

* **`satellites`:** Stores telemetry health, orbital configuration (LEO, MEO, GEO, inclination, altitude), and links to active payloads and ground stations.
* **`payloads`:** High-tech devices associated with satellites (e.g. high-resolution cameras, radars, spectrometers). Stores status, power consumption metrics, memory limits, and data transfer rates.
* **`ground_stations`:** Earth antennas tracking satellite passes. Stores weather availability, status, and antenna frequencies.
* **`missions`:** Task schedules tracking names, priorities, orbits, payload requirements, start/end windows, objectives, notes, and execution status.
