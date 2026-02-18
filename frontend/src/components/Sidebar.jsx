import React from 'react';
import { Plus, MessageSquare, Trash2, X, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const conversations = [
        { id: 1, title: 'React Components Help', date: 'Today' },
        { id: 2, title: 'Tailwind CSS Tips', date: 'Yesterday' },
        { id: 3, title: 'Debug Node.js Error', date: 'Previous 7 Days' },
        { id: 4, title: 'Explain Quantum Physics', date: 'Previous 30 Days' },
    ];

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
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm text-left"
                        onClick={() => console.log('New Chat')}
                    >
                        <Plus size={16} />
                        <span>New chat</span>
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Today</div>
                    {conversations.slice(0, 1).map((chat) => (
                        <div key={chat.id} className="group relative flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors mb-1">
                            <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
                            <div className="flex-1 truncate relative pr-6">
                                {chat.title}
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}

                    <div className="text-xs font-semibold text-gray-500 mb-2 mt-4 px-2">Yesterday</div>
                    {conversations.slice(1, 2).map((chat) => (
                        <div key={chat.id} className="group relative flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors mb-1">
                            <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
                            <div className="flex-1 truncate relative pr-6">
                                {chat.title}
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}

                    <div className="text-xs font-semibold text-gray-500 mb-2 mt-4 px-2">Previous 7 Days</div>
                    {conversations.slice(2, 4).map((chat) => (
                        <div key={chat.id} className="group relative flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer text-sm transition-colors mb-1">
                            <MessageSquare size={16} className="text-gray-500 dark:text-gray-400" />
                            <div className="flex-1 truncate relative pr-6">
                                {chat.title}
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Profile / Settings */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-3">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        <div className="flex-1 text-left">{theme === 'light' ? 'Dark mode' : 'Light mode'}</div>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm">
                        <User size={16} />
                        <div className="flex-1 text-left font-medium">User Name</div>
                        <span className="bg-yellow-600 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">NEW</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm mt-1">
                        <Settings size={16} />
                        <div className="flex-1 text-left">Settings</div>
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
