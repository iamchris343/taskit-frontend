# 📝 Taskit - Task Management API

A robust backend RESTful API built with **Node.js**, **Express**, and **MongoDB** for managing everyday tasks. 

---

## 🚀 Features
* **RESTful Architecture:** Full CRUD capabilities for task management.
* **Database Integration:** Seamless persistent storage with MongoDB Atlas via Mongoose.
* **Environment Configuration:** Secure credential handling via dotenv.
* **Cross-Origin Resource Sharing (CORS):** Enabled for secure frontend communication.

---

## 📁 Project Structure

```text
Taskit/
├── src/
│   ├── models/        # Mongoose database schemas (e.g., Task.js)
│   ├── routes/        # Express route handlers (e.g., taskRoutes.js)
│   └── db.js          # MongoDB database connection setup
├── app.js             # Application entry point & configuration
├── .env.example       # Example template for environment variables
├── .gitignore         # Specified files to ignore in Git tracking
└── package.json       # Project metadata and dependencies
```

---

## 🛠️ Tech Stack
* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database Object Modeling (ODM):** Mongoose
* **Database:** MongoDB Atlas
* **Development Tools:** Nodemon, Dotenv, CORS

---

## ⚙️ Getting Started

### 1. Prerequisites
Make sure you have **Node.js** (v14+ recommended) and **npm** installed on your system.

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
# Navigate to the root server folder
cd Taskit

# Install dependencies
npm install
```

### 3. Environment Setup
1. Create a `.env` file in the root directory (do not commit this to GitHub!).
2. Copy the structure from `.env.example` and fill in your credentials:

```env
PORT=5000
MONGO_URI="your_mongodb_atlas_connection_string"
```

*Note: Ensure your current network IP address is whitelisted in your MongoDB Atlas Security settings.*

### 4. Running the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Once running successfully, you should see:
`Taskit Up and running sir HTTP://localhost:5000`
`MongoDB Connected: ...`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve all tasks |
| **GET** | `/api/tasks/:id` | Retrieve a single task by ID |
| **POST** | `/api/tasks` | Create a new task |
| **PUT** | `/api/tasks/:id` | Update an existing task |
| **DELETE** | `/api/tasks/:id` | Delete a task |
