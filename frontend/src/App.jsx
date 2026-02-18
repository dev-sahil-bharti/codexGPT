import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Singup from './pages/Singup' // Keeping the original filename as per user request
import { AuthProvider, useAuth } from './context/AuthContext'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

const ChatLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSend = (text) => {
    // Add user message
    const newMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { role: 'assistant', content: "I'm a simulated AI response. I can help you with React, Tailwind, and more!" };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-800 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ChatWindow
        messages={messages}
        onSend={handleSend}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Singup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
