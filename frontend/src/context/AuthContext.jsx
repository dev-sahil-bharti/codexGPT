import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);

    // Load user from token on startup
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/getuser', {
                        method: 'GET',
                        headers: {
                            'auth-token': token,
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error("Error fetching user", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                // Trigger a fresh fetch of user details to ensure all data is consistent
                // or just set what we have
                setUser({ name: data.name, email });
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Login error", error);
            return { success: false, error: "Server error" };
        }
    };

    const sendOtp = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true, message: data.message, devMode: data.devMode };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Send OTP error", error);
            return { success: false, error: "Server error" };
        }
    };

    const signup = async (name, email, password, otp) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, otp }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || (data.errors && data.errors[0].msg) || "Signup failed" };
            }
        } catch (error) {
            console.error("Signup error", error);
            return { success: false, error: "Server error" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Get User Profile (specific endpoint)
    const getUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/userProfile', {
                method: 'GET',
                headers: {
                    'auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true, user: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Get Profile error", error);
            return { success: false, error: "Server error" };
        }
    };

    // Update User Profile
    const updateProfile = async (name, email) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ name, email }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data); // Update local state
                return { success: true, user: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Update Profile error", error);
            return { success: false, error: "Server error" };
        }
    };

    // Forgot Password
    const forgotPassword = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error || "Failed to send reset email" };
            }
        } catch (error) {
            console.error("Forgot Password error", error);
            return { success: false, error: "Server error" };
        }
    };

    // Change Password
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/changepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Change Password error", error);
            return { success: false, error: "Server error" };
        }
    };

    // --- Chat Functions ---

    // Fetch all chat titles for sidebar
    const fetchChatSummaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/fetchchats', {
                method: 'GET',
                headers: {
                    'auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setChats(data);
                return { success: true, chats: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {   
            console.error("Fetch Chats Error:", error);
            return { success: false, error: "Server error" };
        }
    };

    // Load messages for a specific chat
    const loadChatMessages = async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
                method: 'GET',
                headers: {
                    'auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(data.messages);
                setCurrentChatId(chatId);
                return { success: true, chat: data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Load Chat Error:", error);
            return { success: false, error: "Server error" };
        }
    };

    // Send message (unified for new and existing chats)
    const sendMessage = async (prompt) => {
        try {
            const token = localStorage.getItem('token');

            // Add user message optimistically to UI
            const userMsg = { role: 'user', content: prompt, timestamp: new Date() };
            setMessages(prev => [...prev, userMsg]);

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({ prompt, chatId: currentChatId }),
            });

            const data = await response.json();

            if (response.ok) {
                const modelMsg = { role: 'model', content: data.response, timestamp: new Date() };
                setMessages(prev => [...prev, modelMsg]);

                // If it was a new chat, update the list and set active ID
                if (!currentChatId) {
                    setCurrentChatId(data.chatId);
                    fetchChatSummaries();
                }

                return { success: true, response: data.response };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Send Message Error:", error);
            return { success: false, error: "Server error" };
        }
    };

    // Clear chat / New Chat
    const startNewChat = () => {
        setCurrentChatId(null);
        setMessages([]);
    };

    // Delete a chat session
    const deleteChat = async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token,
                },
            });
            if (response.ok) {
                setChats(prev => prev.filter(c => c._id !== chatId));
                if (currentChatId === chatId) {
                    startNewChat();
                }
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error("Delete Chat Error:", error);
            return { success: false, error: "Server error" };
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        getUserProfile,
        updateProfile,
        forgotPassword,
        sendOtp,
        changePassword,
        // Chat History additions
        chats,
        messages,
        currentChatId,
        fetchChatSummaries,
        loadChatMessages,
        sendMessage,
        startNewChat,
        deleteChat,
        setMessages
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
