import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (err) {
                console.error('Failed to parse user data:', err);
            }
        }
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No user data found</h2>
                    <p className="text-gray-600 mb-6">Please log in to view your profile</p>
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        My Profile
                    </h1>
                    <p className="text-gray-600">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up delay-100">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <UserCircleIcon className="w-16 h-16 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                        <div className="inline-flex items-center px-4 py-1.5 bg-white/20 rounded-full">
                            <ShieldCheckIcon className="w-4 h-4 text-white mr-2" />
                            <span className="text-white text-sm font-medium">{user.role}</span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 space-y-6">
                        {/* Email */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <EnvelopeIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email Address</p>
                                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Role</p>
                                <p className="text-lg font-semibold text-gray-900">{user.role}</p>
                            </div>
                        </div>

                        {/* User ID */}
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CalendarIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">User ID</p>
                                <p className="text-lg font-mono text-gray-900">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-slide-up delay-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Keep your account secure by using a strong password
                        </p>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Change Password →
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 animate-slide-up delay-300">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Queries</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            View and manage all your submitted queries
                        </p>
                        <Link
                            to="/dashboard"
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Go to Dashboard →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
