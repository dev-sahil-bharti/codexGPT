import React from 'react';
import { Plus, MessageSquare, Trash2, X, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const {
        user, logout, chats, fetchChatSummaries,
        loadChatMessages, startNewChat, deleteChat, currentChatId
    } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            fetchChatSummaries();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
        fixed inset-y-0 left-0 z-50 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
        md:relative md:translate-x-0 
        ${isOpen ? 'md:w-64' : 'md:w-0 md:overflow-hidden'}
        flex flex-col
        border-r border-gray-200 dark:border-gray-800
      `}>

                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm text-left font-medium"
                        onClick={() => {
                            startNewChat();
                            if (window.innerWidth < 768) toggleSidebar();
                        }}
                    >
                        <Plus size={16} />
                        <span>New chat</span>
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="text-xs font-semibold text-gray-500 mb-4 px-2 uppercase tracking-wider">Recent History</div>

                    {chats.length === 0 ? (
                        <div className="text-sm text-gray-400 px-2 italic mt-4">No recent chats</div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`group relative flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer text-sm transition-all mb-1 ${currentChatId === chat._id
                                    ? 'bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                    }`}
                                onClick={() => {
                                    loadChatMessages(chat._id);
                                    if (window.innerWidth < 768) toggleSidebar();
                                }}
                            >
                                <MessageSquare size={16} className={currentChatId === chat._id ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'} />
                                <div className="flex-1 truncate pr-6">
                                    {chat.title}
                                </div>

                                {/* Delete Button */}
                                <button
                                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('Delete this chat?')) {
                                            deleteChat(chat._id);
                                        }
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>

                                <div className={`absolute inset-y-0 right-0 w-8 bg-gradient-to-l opacity-0 group-hover:opacity-100 transition-opacity ${currentChatId === chat._id
                                    ? 'from-gray-200 dark:from-gray-800'
                                    : 'from-gray-100 dark:from-gray-900'
                                    } to-transparent`} />
                            </div>
                        ))
                    )}
                </div>

                {/* User Profile / Settings */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-3">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                        {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
                        <div className="flex-1 text-left">{theme === 'light' ? 'Dark mode' : 'Light mode'}</div>
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                        <User size={19} />
                        <div className="flex-1 text-left font-medium">{user?.name || 'User'}</div>
                    </button>
                    <button
                        onClick={() => navigate('/update-profile')}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm mt-1"
                    >
                        <Settings size={19} />
                        <div className="flex-1 text-left">Settings</div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm mt-1 text-red-500 hover:text-red-600"
                    >
                        <LogOut size={19} />
                        <div className="flex-1 text-left">Log out</div>
                    </button>
                </div>

                {/* Mobile Close Button (only visible on mobile when open) */}
                <button
                    className="absolute top-2 -right-10 p-2 text-white md:hidden"
                    onClick={toggleSidebar}
                >
                    <X size={24} />
                </button>
            </div>
        </>
    );
};

export default Sidebar;
