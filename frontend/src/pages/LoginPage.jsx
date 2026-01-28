import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HexagonBackground } from '../components/hexabg';
import PasswordReset from '../components/PasswordReset';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'User',
        pin: ''
    });

    const [showPin, setShowPin] = useState(false);

    const [error, setError] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role') {
            setShowPin(value === 'Admin' || value === 'Head');
            setFormData({
                ...formData,
                [name]: value,
                pin: '' // Reset PIN when role changes
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const requestBody = {
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            // Include PIN only if role is Admin or Head
            if (formData.role === 'Admin' || formData.role === 'Head') {
                requestBody.pin = formData.pin;
            }

            const response = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to dashboard on success
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <HexagonBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                {/* Card */}
                <div className="relative w-full max-w-md">
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Sign In</h1>
                        <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:border-transparent transition duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:border-transparent transition duration-200 cursor-pointer"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Head">Head</option>
                            </select>
                        </div>

                        {/* PIN Input (shown only for Admin/Head) */}
                        {showPin && (
                            <div className="animate-slide-up">
                                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                                    Authorization PIN <span className="text-[#DCA54C]">(Required for {formData.role})</span>
                                </label>
                                <input
                                    type="password"
                                    id="pin"
                                    name="pin"
                                    value={formData.pin}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-[#DCA54C]/30 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:border-transparent transition duration-200"
                                    placeholder="Enter your authorization PIN"
                                />
                                <p className="mt-1 text-xs text-gray-500">Contact admin if you don't have a PIN</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#DCA54C] hover:bg-[#C8933F] text-[#1A1A1A] font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:ring-offset-2 transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowPasswordReset(true)}
                            className="block w-full text-sm text-gray-600 hover:text-[#DCA54C] transition duration-200"
                        >
                            Forgot Password?
                        </button>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#DCA54C] hover:text-[#C8933F] font-medium transition duration-200">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showPasswordReset && (
                <PasswordReset
                    isOpen={showPasswordReset}
                    onClose={() => setShowPasswordReset(false)}
                    onSuccess={() => {
                        setShowPasswordReset(false);
                    }}
                />
            )}
            </div>
        </HexagonBackground>
    );
};

export default Login;
