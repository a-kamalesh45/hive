import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HexagonBackground } from '../components/hexabg';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User',
        pin: ''
    });

    const [error, setError] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendOtpLoading, setSendOtpLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpMessage, setOtpMessage] = useState('');
    const [verifiedOTP, setVerifiedOTP] = useState(null);

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // User must verify OTP before creating account
        if (!verifiedOTP) {
            setError('Please verify your email with the 6-digit code sent to your inbox');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const requestBody = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                otp: verifiedOTP
            };

            // Include PIN only if role is Admin or Head
            if (formData.role === 'Admin' || formData.role === 'Head') {
                requestBody.pin = formData.pin;
            }

            const response = await fetch(`${apiUrl}/api/signup`, {
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
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Signup error:', err);
        }
    };

    const handleSendOTP = async (e) => {
        e && e.preventDefault && e.preventDefault();
        setError('');
        setOtpMessage('');

        if (!formData.email) {
            setError('Please enter your email before requesting a verification code');
            return;
        }

        try {
            setSendOtpLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await response.json();
            if (response.ok) {
                setOtpSent(true);
                setOtpMessage(data.message || 'Verification code sent to your email');
                if (data.otp) console.log('Dev OTP:', data.otp);
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            console.error('Send OTP error:', err);
            setError('Network error. Please try again.');
        } finally {
            setSendOtpLoading(false);
        }
    };

    const handleVerifyOTP = () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit verification code');
            return;
        }
        setVerifiedOTP(otp);
        setError('');
        setOtpMessage('✓ Email verified! You can now create your account.');
    };

    return (
        <HexagonBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                {/* Card */}
                <div className="relative w-full max-w-md">
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Create Account</h1>
                            <p className="text-gray-600 text-sm">Join HIVE query management platform</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {otpMessage && !error && (
                            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-600 text-sm">{otpMessage}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form id="signup-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:border-transparent transition duration-200"
                                    placeholder="John Doe"
                                />
                            </div>

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
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:border-transparent transition duration-200"
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

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
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
                                    <p className="mt-1 text-xs text-gray-500">Contact HR if you don't have a PIN</p>
                                </div>
                            )}

                            {/* OTP Input (shown after OTP is sent but not verified yet) */}
                            {otpSent && !verifiedOTP && (
                                <div className="space-y-3">
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                            Enter 6-Digit Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            id="otp"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-2xl font-bold tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={sendOtpLoading}
                                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            )}

                            {/* Single Button - Changes based on state */}
                            {!verifiedOTP ? (
                                <button
                                    type="button"
                                    onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                                    disabled={sendOtpLoading || !formData.email || (otpSent && otp.length !== 6)}
                                    className="w-full py-3 px-4 bg-[#DCA54C] hover:bg-[#C8933F] disabled:bg-gray-400 disabled:cursor-not-allowed text-[#1A1A1A] font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:ring-offset-2 transition-all duration-200"
                                >
                                    {sendOtpLoading ? 'Sending...' : otpSent ? 'Verify Email' : 'Verify Email'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-[#DCA54C] hover:bg-[#C8933F] text-[#1A1A1A] font-bold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#DCA54C] focus:ring-offset-2 transition-all duration-200"
                                >
                                    Create Account
                                </button>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#DCA54C] hover:text-[#C8933F] font-medium transition duration-200">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HexagonBackground>
    );
};

export default Signup;
