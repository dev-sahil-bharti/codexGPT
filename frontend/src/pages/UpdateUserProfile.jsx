import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, X, ArrowLeft, Loader2 } from 'lucide-react';

const UpdateUserProfile = () => {
    const { user, updateProfile, getUserProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile(formData.name, formData.email);

        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Optional: Redirect after a short delay
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 transition-colors duration-300 flex flex-col items-center">

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Edit Profile
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 relative overflow-hidden">

                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center justify-center text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserProfile;
