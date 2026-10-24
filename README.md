# Campus Lost & Found Portal (MERN Stack)

> **Academic Capstone Project Submission**  
> Developed for College Students & University Administration  
> Built with MongoDB, Express.js, React.js (Vite), Node.js, and CSS3.

---

## 1. Project Overview & Problem Statement

### Problem Statement
College campuses witness hundreds of misplaced personal belongings each semester—including official student ID cards, calculators, course textbooks, electronics, dorm keys, wallets, and water bottles. Traditionally, lost notices are posted haphazardly on campus notice boards, social media groups, or informal chat channels. This fragmented approach makes it difficult for students to verify ownership, track item status, or coordinate safe recovery.

### Objectives
The **Campus Lost & Found Portal** provides a centralized, secure, role-based web application that:
- Allows students to immediately submit lost or found reports with campus locations and photos.
- Provides real-time keyword search and category filtering across active listings.
- Protects personal data by enforcing strict role-based authorization (students cannot tamper with others' reports).
- Enables administrators to monitor campus listing statistics and moderate inappropriate posts.
- Calculates genuine dashboard metrics directly from the MongoDB database.

---

## 2. Target Users & Roles

### 🎓 Student
- **Registration & Authentication:** Secure sign-up and login with bcrypt hashing and JWT.
- **Reporting:** Submit lost item notices or found property reports with campus location details.
- **Search & Discovery:** Search by item keywords, filter by category (`ID Cards`, `Electronics`, `Bags`, etc.), filter by status (`Open` vs. `Resolved`), and sort by newest reports.
- **Management:** View personal reports on the Student Dashboard (`/dashboard`), update details, mark items as resolved once recovered, or delete personal reports.

### 🛡️ Administrator
- **Moderation:** Access the protected Admin Panel (`/admin`) to oversee all university listings.
- **System Metrics:** View authentic database counts for total users, total reports, lost items, found items, and resolved cases.
- **Listing Oversight:** Remove duplicate, spam, or inappropriate posts across all categories.
- **Status Updates:** Update listing states directly during administrative property returns.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 with Vite | Fast client-side rendering and component modularity |
| **Styling** | Pure CSS3 | Clean, responsive university color theme (Navy & Accent Blue) |
| **Routing** | React Router DOM v6 | Single-Page Application (SPA) declarative client routing |
| **API Client** | Axios | Centralized HTTP client with JWT request/response interceptors |
| **Backend** | Node.js & Express.js | RESTful API server with centralized error handling |
| **Database** | MongoDB with Mongoose | Flexible NoSQL schema modeling, indexing, and validation |
| **Security** | JWT & bcryptjs | Stateless authorization tokens and salted password hashing |
| **Rate Limiter** | express-rate-limit | Brute-force protection on authentication endpoints |
| **Icons** | Lucide React | Lightweight, accessible SVG UI iconography |

*Note: JavaScript (ES6+) is used throughout the entire codebase. TypeScript and bloated third-party styling frameworks were avoided to ensure high code readability and ease of explanation for academic defense.*

---

## 4. Architecture & Folder Structure

```text
campus-lost-found/
├── client/                      # React Frontend (Vite)
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AdminRoute.jsx       # Route guard for admin role
│   │   │   ├── AlertMessage.jsx     # Feedback banner component
│   │   │   ├── ConfirmModal.jsx     # Accessible action confirmation modal
│   │   │   ├── EmptyState.jsx       # Zero-result fallback display
│   │   │   ├── Footer.jsx           # University portal footer
│   │   │   ├── ItemCard.jsx         # Card component for browse grid
│   │   │   ├── Navbar.jsx           # Responsive sticky navigation bar
│   │   │   ├── Pagination.jsx       # Pagination page selector
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   │   └── StatusBadge.jsx      # Lost/Found & Open/Resolved badges
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication provider
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx   # Administrator moderation dashboard
│   │   │   ├── BrowseItemsPage.jsx      # Search, filter, and pagination page
│   │   │   ├── HomePage.jsx             # Hero landing page & how-it-works
│   │   │   ├── ItemDetailsPage.jsx      # Detailed item overview & actions
│   │   │   ├── LoginPage.jsx            # Student & Admin login form
│   │   │   ├── NotFoundPage.jsx         # 404 fallback page
│   │   │   ├── RegisterPage.jsx         # New student account registration
│   │   │   ├── ReportItemPage.jsx       # Unified Lost/Found/Edit report form
│   │   │   ├── StudentDashboardPage.jsx # Student personal statistics & listings
│   │   │   └── UnauthorizedPage.jsx     # 403 Forbidden access denied page
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios service with interceptors
│   │   ├── utils/
│   │   │   └── formatters.js        # Date formatters & category constants
│   │   ├── App.jsx                  # Main route switchboard
│   │   ├── index.css                # Global CSS3 styling & responsive design
│   │   └── main.jsx                 # Vite React entrypoint
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── autoSeed.js          # Auto-seeds demo items on fresh start
│   │   │   └── db.js                # MongoDB connection + in-memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, getMe
│   │   │   ├── dashboardController.js# Student & admin statistics aggregations
│   │   │   └── itemController.js    # CRUD operations, status, filters
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # Bearer token verification
│   │   │   ├── errorMiddleware.js   # Centralized error handler & 404
│   │   │   └── roleMiddleware.js    # Administrator role authorization
│   │   ├── models/
│   │   │   ├── Item.js              # Lost/Found report schema & indexes
│   │   │   └── User.js              # User schema, bcrypt hooks, safe serialization
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes with rate limiting
│   │   │   ├── dashboardRoutes.js   # /api/dashboard routes
│   │   │   └── itemRoutes.js        # /api/items routes
│   │   ├── scripts/
│   │   │   ├── seedAdmin.js         # Dedicated CLI administrator seeder
│   │   │   └── testSuite.js         # Automated 17-scenario validation suite
│   │   └── server.js                # Express app configuration & server boot
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                 # Root orchestration scripts
└── README.md
```

---

## 5. MongoDB Database Design

### User Model (`User.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | required, trim, min: 2, max: 60 | Student or administrator full name |
| `email` | String | required, unique, lowercase, trim | Campus email address (indexed) |
| `password` | String | required, min: 6, hashed | Bcrypt-hashed password (hidden by default) |
| `role` | String | enum: `['student', 'admin']`, default: `'student'` | System authorization role |
| `timestamps` | Date | `createdAt`, `updatedAt` | Auto-managed timestamps |

### Item Model (`Item.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | required, trim, max: 100 | Name/headline of the item |
| `description` | String | required, trim, max: 2000 | Identifying features, color, brand, details |
| `category` | String | required, enum (8 categories) | Category classification |
| `type` | String | required, enum: `['lost', 'found']` | Classification of the report |
| `location` | String | required, trim, max: 120 | Campus building, room, or landmark |
| `dateOfIncident` | Date | required | Date when item was lost or found |
| `imageUrl` | String | optional, trim, default: `''` | Optional photo URL (uses fallback placeholder if empty) |
| `contactInfo` | String | required, trim, max: 200 | Phone, email, or campus office where to contact |
| `status` | String | enum: `['open', 'resolved']`, default: `'open'` | Current status of the listing |
| `user` | ObjectId | required, ref: `'User'` | Reference to the student/admin who reported it |
| `timestamps` | Date | `createdAt`, `updatedAt` | Auto-managed timestamps |

**Indexes created:**
- Unique index on `User.email`
- Compound indexes on `Item.type` and `Item.status`
- Text search index on `title`, `description`, and `location`
- Sort index on `createdAt: -1`

---

## 6. RESTful API Documentation

All API endpoints are prefixed with `/api`.

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account (locked to `student` role) |
| `POST` | `/api/auth/login` | Public | Authenticate student or admin; returns JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated profile |

### Item Endpoints (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Browse reports with `search`, `type`, `category`, `status`, `sort`, `page`, and `limit` |
| `GET` | `/api/items/:id` | Public | Retrieve detailed report by MongoDB ID |
| `POST` | `/api/items` | Private | Create a new lost or found item report (auto-associates logged-in user) |
| `PUT` | `/api/items/:id` | Private (Owner/Admin) | Update report details (title, description, location, etc.) |
| `PATCH` | `/api/items/:id/status`| Private (Owner/Admin) | Toggle report status between `'open'` and `'resolved'` |
| `DELETE` | `/api/items/:id` | Private (Owner/Admin) | Delete a report or moderate inappropriate listing |

### Dashboard Endpoints (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/student` | Private | Returns personal report statistics & student's own items |
| `GET` | `/api/dashboard/admin` | Admin Only | Returns global university metrics & all active/resolved items |

---

## 7. Prerequisites

Before running the application locally, make sure you have installed:
- [Node.js](https://nodejs.org/) (Version 18, 20, or 24 recommended)
- `npm` (included with Node.js)
- *Optional:* Local [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.
  *(Note: The server includes an integrated zero-setup in-memory MongoDB fallback, so the project can be run and evaluated out of the box even without MongoDB installed!)*

---

## 8. Installation & Setup

### Step 1: Clone or Navigate to the Workspace
```bash
cd campus-lost-found
```

### Step 2: Install Dependencies
Run the root installation command which installs dependencies for root, server, and client:
```bash
npm run install:all
```
*(Or install in each directory individually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

---

## 9. Environment Variables Configuration

Both the server and client include `.env.example` templates.

### Backend Configuration (`server/.env`)
Create a file named `.env` inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_lost_found
JWT_SECRET=campus_lost_found_jwt_secret_key_change_in_production_2026
CLIENT_URL=http://localhost:5173
```
*Note: If `MONGODB_URI` is left blank or local MongoDB is not running, the server gracefully activates its in-memory database fallback so you can demonstrate the app immediately.*

### Frontend Configuration (`client/.env`)
Create a file named `.env` inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 10. Running the Application

### Option A: Run Both Client and Server Concurrently (Recommended)
From the project root:
```bash
npm run dev
```

### Option B: Run Services Individually in Two Terminals
**Terminal 1 (Backend Server):**
```bash
npm run server
# Listening on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Available on http://localhost:5173
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 11. Pre-configured Demo Accounts

For quick demonstrations and capstone evaluation, the system automatically initializes with sample data and test accounts:

| Role | Email | Password | Dashboard Access |
| :--- | :--- | :--- | :--- |
| **Campus Admin** | `admin@campus.edu` | `Admin@12345` | `/admin` & `/dashboard` |
| **Student** | `student@campus.edu` | `Student@12345` | `/dashboard` |

*(Tip: On the login page, you can click "Demo Student" or "Demo Admin" to auto-populate credentials instantly during presentations.)*

### Creating or Promoting Administrators via CLI
To securely create a new administrator account or promote an existing student:
```bash
cd server
node src/scripts/seedAdmin.js customadmin@campus.edu SecurePass@123 "Dean of Students"
```

---

## 12. Automated Testing Suite

The project includes an automated 17-scenario verification test suite that verifies all core requirements against the live backend API and database:

```bash
npm test
# or: cd server && npm test
```

### Verified Test Scenarios
1. A new student can register (`POST /api/auth/register` -> 201).
2. Duplicate email registration is rejected (`POST /api/auth/register` -> 409 Conflict).
3. A registered student can log in (`POST /api/auth/login` -> 200).
4. An incorrect password is rejected (`POST /api/auth/login` -> 401).
5. A logged-in student can create a lost-item report (`POST /api/items` -> 201).
6. A logged-in student can create a found-item report (`POST /api/items` -> 201).
7. Created reports appear in the listings (`GET /api/items` -> 200).
8. Search and category filters operate accurately on actual database records.
9. A student can edit their own report (`PUT /api/items/:id` -> 200).
10. A student cannot edit or delete another student's report (`PUT/DELETE` -> 403 Forbidden).
11. A student cannot access the admin dashboard (`GET /api/dashboard/admin` -> 403 Forbidden).
12. An administrator can access admin stats and moderate/delete reports.
13. Invalid input produces a clear 400 Bad Request error.
14. Missing or invalid item IDs are handled properly (404 Not Found).
15. Empty search results return zero count and empty array cleanly.
16. Health check responds operational (`GET /api/health` -> 200).
17. Student dashboard calculates authentic personal statistics from MongoDB.

---

## 13. Application Pages & Routes

| Route | Page | Access Level | Key Features |
| :--- | :--- | :--- | :--- |
| `/` | Home Page | Public | Hero banner, search bar, category shortcuts, recent listings, how-it-works |
| `/items` | Browse Items | Public | Real-time search, filters (category, type, status), sorting, pagination |
| `/items/:id` | Item Details | Public | Full description, photo, location, incident date, contact box, edit/delete actions |
| `/login` | Login | Public | User authentication with demo fill buttons |
| `/register` | Registration | Public | Student sign-up with client & server-side validation |
| `/report/lost` | Report Lost Item | Protected (Student/Admin) | Specialized pre-selected lost item submission form |
| `/report/found` | Report Found Item | Protected (Student/Admin) | Specialized pre-selected found item submission form |
| `/items/:id/edit`| Edit Item | Protected (Owner/Admin) | Update item details or status |
| `/dashboard` | Student Dashboard | Protected (Student/Admin) | Personal statistics cards, table of own listings, status toggles |
| `/admin` | Admin Dashboard | Admin Only | System-wide statistics, user counts, moderation table |
| `/unauthorized` | Unauthorized | Public | Access denied guidance for non-admin users |
| `*` | 404 Not Found | Public | Friendly fallback for unmatched URL routes |

---

## 14. Deployment Readiness

1. **Production Build:**
   ```bash
   cd client
   npm run build
   # Outputs optimized SPA files to client/dist/
   ```
2. **Backend Production Deployment:**
   - Deploy `server/` to Render, Railway, or Heroku.
   - Set environment variables: `PORT`, `MONGODB_URI` (pointing to MongoDB Atlas), `JWT_SECRET`, and `CLIENT_URL` (set to your deployed frontend URL).
3. **Frontend Production Deployment:**
   - Deploy `client/dist/` to Vercel, Netlify, or Cloudflare Pages.
   - Set environment variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`.
   - Ensure SPA redirect rule is configured (`/*` -> `/index.html`) so direct page reloads work smoothly.

---

## 15. Known Limitations & Future Enhancements

### Capstone Scope Control
In alignment with academic capstone MVP standards, third-party bloated libraries, paid SMS gateways, and complex AI systems were intentionally omitted in favor of solid code quality and security.

### Recommended Future Enhancements
- **Email Notifications:** Automated campus email notifications (using Nodemailer) when a found item matches keywords of a reported lost item.
- **Image Upload Storage:** Direct file uploading to Cloudinary or AWS S3 instead of image URLs.
- **Campus Map Integration:** Visual campus floor plan or interactive Leaflet.js campus map pins for precise recovery locations.
- **QR Code Tags:** Generate printable QR tags for registered campus property (keys, bottles, laptops) linking to the portal.
