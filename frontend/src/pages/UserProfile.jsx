import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Shield, Edit3, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Calculate member since date (mock or real if available in user object)
    // Assuming backend might send createdAt, otherwise default to "Recently"
    const memberSince = user?.date ? new Date(user.date).toLocaleDateString() : "Recently";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                </div>

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">

                    {/* Background Banner */}
                    <div className="h-32 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

                    <div className="px-6 md:px-10 pb-10">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400 shadow-lg">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={48} />}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-1">{user?.name || "Guest User"}</h2>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Mail size={16} />
                                    {user?.email || "No email provided"}
                                </p>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => navigate('/update-profile')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg"
                                >
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-xl font-medium transition-colors border border-red-500/20"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Stats / Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-purple-600 dark:text-purple-400">
                                    <Shield size={20} />
                                    <span className="font-semibold text-sm">Account Type</span>
                                </div>
                                <p className="text-xl font-bold">Free Plan</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                                    <Calendar size={20} />
                                    <span className="font-semibold text-sm">Joined</span>
                                </div>
                                <p className="text-xl font-bold">{memberSince}</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-green-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-green-600 dark:text-green-400">
                                    <User size={20} />
                                    <span className="font-semibold text-sm">User ID</span>
                                </div>
                                <p className="text-xl font-bold truncate max-w-[200px]" title={user?._id}>
                                    {user?._id ? `#${user._id.slice(-6).toUpperCase()}` : "N/A"}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
