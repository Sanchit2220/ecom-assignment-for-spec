# 🛒 Advanced Product Catalog with Faceted Search & Filtering

Welcome! This project is a modern, full-featured e-commerce product catalog. It’s designed to help users easily discover products using powerful search, dynamic filters, and a beautiful, responsive interface. Whether you’re searching for a specific item or just browsing, this app makes it fast and fun!

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd assignment
```

### 2. Backend Setup (MySQL + Node.js)
- Make sure you have MySQL running. Create a database called `ecom`.
- Import the provided schema and seed data (see Data Model Design below).
- Install backend dependencies:
```bash
cd backend
npm install
```
- Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup (React)
```bash
cd ../ecom-assignment
npm install
npm start
```
- The frontend will be at [http://localhost:3000](http://localhost:3000)
- The backend API runs at [http://localhost:5000](http://localhost:5000)

**Tip:** If you need to seed the database, use the scripts in `backend/` or import the SQL file.

---

## 🧰 Technology Stack
- **Frontend:** React, styled-components, React Router, Lucide Icons, Framer Motion
- **Backend:** Node.js, Express, MySQL, Multer (for CSV import)
- **Database:** MySQL 5.7+
- **Other:** CSV for data import, modern CSS/JS

---

## 📁 Project Structure

Here's how the project is organized so you can find your way around easily:

```
ecom-assignment/
├── .gitignore            # Node, build, and environment ignores
├── README.md             # This file
├── package.json          # Frontend dependencies and scripts
├── package-lock.json     # Exact dependency versions
├── public/               # Static assets
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src/                  # React source code
    ├── App.js            # Main React app component
    ├── App.css           # Main app styles
    ├── App.test.js       # App tests
    ├── index.js          # Entry point
    ├── index.css         # Global styles
    ├── logo.svg          # Logo asset
    ├── reportWebVitals.js# Web vitals reporting
    ├── setupTests.js     # Test setup
    ├── Products/         # Product grid/listing components (main catalog UI)
    │   └── index.js
    ├── ProductDetails/   # Product detail page component
    │   └── index.js
    └── ProductData/      # (Optional) Static or mock product data
        └── index.js
```

**What goes where?**
- `public/` — Static files and HTML template.
- `src/` — All React code and components.
- `Products/` — Main product listing grid and card UI.
- `ProductDetails/` — Product detail view.
- `ProductData/` — (Optional) Static/mock product data for development/testing.

---

## 📦 Backend Folder Details

The backend folder contains the Node.js/Express backend for this project.

```
backend/
├── .gitignore           # Git ignore rules for node_modules, build, env files, etc.
├── node_modules/        # Installed dependencies (not tracked in git)
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Exact dependency versions
├── server.js            # Main Express server and API endpoints
├── sql                  # SQL schema and index creation script
```

### Main Files
- **server.js**: Main Express server. Connects to MySQL, provides REST API endpoints for products, supports filtering, search, sorting, and pagination.
- **sql**: SQL script to create the `ecom` database, `products` table, and indexes for efficient search/filtering.
- **package.json**: Declares backend dependencies (`express`, `mysql2`, `cors`, `multer`, `csv-parser`).
- **.gitignore**: Ignores `node_modules`, build output, environment files, and log files.

### Backend Setup & Usage
1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Set up the database:
   - Make sure MySQL is running.
   - Run the SQL commands in `backend/sql` to create the `ecom` database and tables.
3. Start the server:
   ```sh
   node server.js
   ```
   The backend API will be available at [http://localhost:5000](http://localhost:5000).

### API Endpoints
- `GET /api/products`: List products with filtering, search, sorting, and pagination.
- `GET /api/products/:id`: Get details for a single product by ID.

---

## ⚙️ Main Dependencies

- **react** — UI library
- **react-dom** — DOM bindings for React
- **react-router-dom** — Routing
- **styled-components** — CSS-in-JS styling
- **lucide-react** — Icon library
- **framer-motion** — Animations
- **react-icons** — Additional icons
- **@testing-library/react** and related — Testing utilities

## 📦 Scripts

- `npm start` — Start the development server
- `npm run build` — Build for production
- `npm test` — Run tests
- `npm run eject` — Eject from Create React App (not recommended)

---

## 🖥️ How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 📝 Notes
- The frontend expects the backend API to be running at [http://localhost:5000](http://localhost:5000).
- All product data and UI logic are in the `src/` folder.
- For customizations, edit components in `src/Products/`, `src/ProductDetails/`, and `src/ProductData/`.

---

Thanks for checking out this project! If you have any questions or want to see more features, feel free to reach out.
