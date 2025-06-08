# Phela Admin Dashboard & API

This project is a full-stack web application for managing healthcare resources, built with a React (Vite + TypeScript + Tailwind CSS) admin dashboard and a Node.js (Express + TypeScript + MongoDB) REST API backend.

## Project Structure

```
phela/
├── admin-dashboard/   # Frontend React admin dashboard
├── server/            # Backend Node.js/Express API
```

### admin-dashboard/
- **Framework:** React (Vite, TypeScript)
- **Styling:** Tailwind CSS, Material Tailwind React
- **State Management:** Redux Toolkit
- **Features:**
  - Authentication (JWT)
  - User, Appointment, Consultation, Facility, Medical Profile, and Prescription management
  - Responsive dashboard UI
  - CRUD operations for all resources

### server/
- **Framework:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Features:**
  - RESTful API endpoints for all resources
  - JWT authentication & authorization
  - Modular controllers, models, and routes

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup

#### 1. Clone the repository
```bash
git clone <repo-url>
cd phela
```

#### 2. Install dependencies
##### Backend
```bash
cd server
npm install
```
##### Frontend
```bash
cd ../admin-dashboard
npm install
```

#### 3. Configure Environment Variables
- Copy `.env.example` to `.env` in both `server/` and `admin-dashboard/` and fill in the required values (e.g., MongoDB URI, JWT secret, API URLs).

#### 4. Run the Backend
```bash
cd server
npm run dev
```

#### 5. Run the Frontend
```bash
cd ../admin-dashboard
npm run dev
```

- The frontend will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:5187` (or as configured)

## Usage
- Log in with your admin credentials.
- Manage users, appointments, consultations, facilities, medical profiles, and prescriptions from the dashboard.
- All CRUD operations are available via the UI.

## Project Highlights
- **Reusable ResourceList component** for generic CRUD tables.
- **Role-based access control** (customize as needed).
- **Modern UI** with Material Tailwind React components.
- **Type-safe** codebase (TypeScript everywhere).

## Scripts
### Backend (from `server/`)
- `npm run dev` — Start server with nodemon
- `npm run build` — Build TypeScript
- `npm start` — Start compiled server

### Frontend (from `admin-dashboard/`)
- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

**Phela Admin Dashboard & API** — Modern healthcare management made easy.

