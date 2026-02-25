# AI Chatbot (MERN Stack)

A comprehensive AI-powered chatbot application built using the MERN stack (MongoDB, Express.js, React, Node.js) and integrated with Google's Gemini AI.

## Features

-   **User Authentication**: Secure Sign Up and Login functionality using JWT (JSON Web Tokens).
-   **AI Chat Integration**: Interact with Google's Gemini AI model (`gemini-2.5-flash`) for intelligent conversations.
-   **Profile Management**: Update user profile details (Name, Email).
-   **Password Recovery**: (Forgot Password functionality implemented).
-   **Responsive Design**: Modern UI built with React and Tailwind CSS.
-   **Secure Backend**: Middleware for protected routes and proper error handling.

## Tech Stack

-   **Frontend**: React.js, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **AI Model**: Google Gemini API (`@google/generative-ai`)
-   **Authentication**: `jsonwebtoken`, `bcryptjs`

## Prerequisites

Before running the project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ai_chatboot
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URL_LOCAL=mongodb://127.0.0.1:27017/your_db_name
MONGODB_URL=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
# or
nodemon server.js
```

The server will start on `http://localhost:5000`.

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (default Vite port).

## API Endpoints

### User Routes (`/api`)

-   `POST /api/createuser`: Register a new user.
-   `POST /api/login`: Authenticate existing user.
-   `POST /api/getuser`: Get logged-in user details (Login Required).
-   `POST /api/userProfile`: Get user profile (Login Required).
-   `PUT /api/updateProfile`: Update user profile (Login Required).
-   `POST /api/forgotPassword`: Initiate password reset.

### Chat Routes (`/api`)

-   `POST /api/chat`: Send a prompt to the AI bot (Login Required).

## License

This project is open-source and available under the [MIT License](LICENSE).
