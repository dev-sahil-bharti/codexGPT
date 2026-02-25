import React from 'react';
import { Menu, Moon, Sun, ChevronDown, Share, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth(); // Get user from context
    const navigate = useNavigate();

    // Calculate initials
    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : 'G';

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-900/50 bg-white dark:bg-gray-800 p-2 text-gray-500">

            {/* Left Section: Mobile Menu & Model Selector */}
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                >
                    <Menu size={24} />
                </button>

                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-semibold group">
                    <span>CodeX AI</span>
                    <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
                </button>
            </div>

            {/* Right Section: Actions & Theme Toggle */}
            <div className="flex items-center gap-2">
                {/* Share Button (Desktop) */}
                <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                    <Share size={18} />
                    <span>Share</span>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                    title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* User Avatar */}
                <div
                    onClick={() => navigate('/profile')}
                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm ml-1 cursor-pointer hover:opacity-80 transition-opacity"
                    title={user?.name || "Guest"}
                >
                    {initials}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
