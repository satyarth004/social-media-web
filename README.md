# NovaSocial

NovaSocial is a modern social media web application inspired by Instagram, X, Facebook, Threads, and Discord.

## Tech Stack
- Frontend: React.js, Tailwind CSS, React Router, Axios, Framer Motion, React Icons
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT, bcrypt, email verification, forgot/reset password
- Realtime: Socket.io

## Project Structure
- backend/: Express server, MVC controllers, models, routes, middleware
- frontend/: Vite + React UI with Tailwind

## Setup
1. Install backend dependencies:
   - cd backend && npm install
2. Install frontend dependencies:
   - cd frontend && npm install
3. Create a .env file in backend using .env.example
4. Start MongoDB locally
5. Start backend:
   - cd backend && npm run dev
6. Start frontend:
   - cd frontend && npm run dev

## Features Included
- Authentication, user profiles, posts, feed, likes/comments, real-time messaging scaffold, admin panel, dark mode, responsive UI

## Notes
- Email verification and forgot password use OTP simulation in the API layer.
- Socket.io integration is scaffolded for messaging and notifications.
