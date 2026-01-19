import { useState, useEffect } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import beePng from '../assets/bee.png';

const AddQuery = () => {
    const [formData, setFormData] = useState({
        issue: '',
        category: 'Technical',
        priority: 'Medium'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Get user ID from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                setUserId(userData._id); // Use _id instead of id
            } catch (err) {
                console.error('Failed to parse user data:', err);
                setError('User session invalid. Please login again.');
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.issue.trim()) {
            setError('Please describe your issue');
            setIsSubmitting(false);
            return;
        }

        if (!userId) {
            setError('User not found. Please login again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Please login to submit a query');
                setTimeout(() => window.location.hash = '#login', 2000);
                return;
            }

            const response = await fetch('http://localhost:5001/api/add-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    issue: formData.issue,
                    askedBy: userId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Query submitted successfully!');
                setFormData({
                    issue: '',
                    category: 'Technical',
                    priority: 'Medium'
                });
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.hash = '#dashboard';
                }, 2000);
            } else {
                setError(data.message || 'Failed to submit query');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Add query error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF9F0] pt-30 pb-16 px-4 relative overflow-hidden">
            {/* Hexagon/light beehive background (same as dashboard) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='%23F59E0B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 52px'
            }} />
            <img src={beePng} alt="" className="absolute top-12 right-8 w-32 h-32 opacity-[0.03] pointer-events-none" />
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Submit a Query
                    </h1>
                    <p className="text-gray-600">
                        Describe your issue and our team will get back to you soon
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 animate-slide-up delay-100">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                            <div className="shrink-0">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="ml-3 text-green-700 text-sm font-medium">{success}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <div className="shrink-0">
                                <XMarkIcon className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="ml-3 text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Issue Description */}
                        <div>
                            <label htmlFor="issue" className="block text-sm font-semibold text-gray-700 mb-2">
                                Describe Your Issue <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="issue"
                                name="issue"
                                value={formData.issue}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition duration-200 resize-none"
                                placeholder="Please provide a detailed description of your issue..."
                            />
                            <p className="mt-2 text-xs text-amber-600">
                                Be as specific as possible to help us resolve your issue quickly
                            </p>
                        </div>

                        {/* Category Selector (Optional for future use) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 cursor-pointer"
                                >
                                    <option value="Technical">Technical Issue</option>
                                    <option value="Account">Account Related</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Feature">Feature Request</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Priority Level
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 cursor-pointer"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => window.location.hash = '#dashboard'}
                                className="px-6 py-3 text-amber-700 hover:text-amber-900 font-medium rounded-lg hover:bg-amber-50 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        <span>Submit Query</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {/* Info Card */}
                    <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-100 animate-slide-up delay-200">
                        <h3 className="text-lg font-semibold text-amber-900 mb-3">What happens next?</h3>
                        <ul className="space-y-2 text-sm text-amber-700">
                            <li className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 mr-3"></span>
                                <span>Your query will be reviewed by our team</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 mr-3"></span>
                                <span>You'll receive updates on the dashboard</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 mr-3"></span>
                                <span>Assigned team members will work on resolving your issue</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuery;
