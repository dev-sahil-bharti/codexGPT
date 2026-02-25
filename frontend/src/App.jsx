import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Singup from './pages/Singup' // Keeping the original filename as per user request
import UserProfile from './pages/UserProfile'
import UpdateUserProfile from './pages/UpdateUserProfile'
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

  /* Updated handleSend to call backend API with loading state and error handling */
  const { logout } = useAuth();

  const handleSend = async (text) => {
    // Add user message
    const newMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, newMessage]);

    // Add temporary loading message
    const loadingId = Date.now();
    setMessages((prev) => [...prev, { role: 'assistant', content: "Thinking...", id: loadingId, isLoading: true }]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ prompt: text })
      });

      const data = await response.json();

      // Remove loading message
      setMessages((prev) => prev.filter(msg => msg.id !== loadingId));

      if (response.ok) {
        const aiResponse = { role: 'assistant', content: data.response };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        if (response.status === 401) {
          logout(); // Logout if token is invalid
          return;
        }
        const errorMsg = data.error || "Failed to get response";
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errorMsg}` }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      // Remove loading message
      setMessages((prev) => prev.filter(msg => msg.id !== loadingId));
      setMessages((prev) => [...prev, { role: 'assistant', content: "Error: Unable to connect to server." }]);
    }
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
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateUserProfile />
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
