
# 🌟 Learning App Frontend

This is the **frontend** of a learning platform built using **React + Vite + Tailwind CSS**. It includes story-based and quiz-based learning features, a leaderboard, latest news section, and user authentication via Clerk.

---

## 🚀 Tech Stack

- ⚛️ React
- ⚡ Vite
- 💨 Tailwind CSS
- 🔐 Clerk (Authentication)
- 🌐 React Router
- 🍞 react-hot-toast (Toasts)
- 🧠 State Management via Hooks

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components (Sidebar, Navbar, etc.)
├── pages/               # Route-level components (Home, Login, Profile, etc.)
├── assets/              # Static assets
├── App.jsx              # App entry with routing
├── main.jsx             # ReactDOM entry
```

---

## 🛠️ Setup Instructions

### 1. 📦 Install dependencies

```bash
npm install
```

### 2. 🔑 Environment Variables

Create a `.env` file in the root with the following Clerk setup:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

> 💡 Replace `your_clerk_publishable_key_here` with your actual key from [Clerk Dashboard](https://clerk.dev/)

### 3. 🧠 Start the dev server

```bash
npm run dev
```

It should now be running at:

```
http://localhost:5173/
```

---

## 📚 Features

- 📖 **Story-Based Learning** – Interactive storytelling lessons
- 📝 **Quiz-Based Learning** – Topic-wise quizzes with score tracking
- 🏆 **Leaderboard** – Rank users based on quiz performance
- 📰 **Latest Updates** – News and announcements section
- 👤 **Authentication** – Sign up / Sign in via Clerk
- ⚙️ **Sidebar Navigation** – With responsive toggle
- 📊 **Score Display** – Post-quiz results with leaderboard redirect

---

## ✅ Available Scripts

- `npm run dev` – Starts the development server
- `npm run build` – Builds the app for production
- `npm run preview` – Previews the production build

---

## 🔗 Backend API Endpoints (Assumed)

Make sure your backend server is running (e.g. Express API):

```
http://localhost:5000/api
```

Expected endpoints:
- `/api/quiz/story/:storyId`
- `/api/stories/:storyId`
- `/api/leaderboard`
- `/api/users/clerk/:userId`

---















# Akward-edu-web-backend

**Akward-edu-web-backend** is the server-side application for the [Akward Edu Web Platform](https://yourfrontendlink.com). Built using **Node.js** and **Express.js**, this backend powers APIs, manages authentication, handles database operations, and provides services to the frontend application.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB / Mongoose** *(if applicable)*
- **JWT** for authentication
- **dotenv** for environment configuration
- **nodemon** for development auto-reloading
- **CORS**, **Helmet**, and other middleware for security and request handling

---

## Project Structure

```bash
Akward-edu-web-backend/
├── config/             # App configuration (e.g., DB, env)
├── controllers/        # Route controllers
├── middleware/         # Custom middleware (e.g., auth, error handling)
├── models/             # Mongoose/ORM data models
├── routes/             # Express route definitions
├── utils/              # Utility/helper functions
├── .env                # Environment variables
├── .gitignore
├── package.json
├── server.js           # Main entry point
└── README.md
