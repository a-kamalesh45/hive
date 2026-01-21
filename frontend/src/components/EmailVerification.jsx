import { useState } from 'react';
import { EnvelopeIcon, ShieldCheckIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const EmailVerification = ({ onClose, onVerified }) => {
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

            const response = await fetch(`${apiUrl}/api/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setStep(2);
                // In development, log the OTP
                if (data.otp) {
                    console.log('Development OTP:', data.otp);
                }
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Send OTP error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

            const response = await fetch(`${apiUrl}/api/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    if (onVerified) onVerified();
                    if (onClose) onClose();
                }, 1500);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Verify OTP error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-8 animate-scaleIn border-2 border-gray-100">
                <div className="max-h-[85vh] overflow-y-auto">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 border-b-2 border-purple-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Email Verification</h3>
                                    <p className="text-purple-100 text-xs mt-0.5">
                                        {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-fadeIn">
                                <XMarkIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fadeIn">
                                <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-green-700 text-sm font-medium">{success}</p>
                            </div>
                        )}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-5 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-900 font-medium"
                                            disabled={loading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        We'll send a 6-digit verification code to this email
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <EnvelopeIcon className="w-5 h-5" />
                                            <span>Send Verification Code</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Input */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-fadeIn">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                                        <EnvelopeIcon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        We've sent a verification code to
                                    </p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">{email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2 text-center">
                                        Enter 6-Digit Code
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 6) setOtp(value);
                                        }}
                                        placeholder="000000"
                                        maxLength="6"
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-center text-2xl font-bold tracking-widest text-gray-900"
                                        disabled={loading}
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-600 mt-2 text-center">
                                        Code expires in 10 minutes
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep(1);
                                            setOtp('');
                                            setError('');
                                            setSuccess('');
                                        }}
                                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                                        disabled={loading}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheckIcon className="w-5 h-5" />
                                                <span>Verify Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtp('');
                                        setError('');
                                        setSuccess('');
                                        handleSendOTP({ preventDefault: () => { } });
                                    }}
                                    className="w-full text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors"
                                    disabled={loading}
                                >
                                    Didn't receive the code? Resend
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default EmailVerification;
