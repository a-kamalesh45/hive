// Navbar.jsx
import { useState, useEffect } from 'react';
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    PlusIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/logo2.png';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('User');

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                const userData = JSON.parse(user);
                setIsLoggedIn(true);
                setUserName(userData.name || 'User');
                setUserRole(userData.role || 'User');
            } catch (err) {
                console.error('Error parsing user data:', err);
            }
        } else {
            setIsLoggedIn(false);
        }

        // Listen for storage changes (login/logout from other tabs)
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (token && user) {
                try {
                    const userData = JSON.parse(user);
                    setIsLoggedIn(true);
                    setUserName(userData.name || 'User');
                    setUserRole(userData.role || 'User');
                } catch (err) {
                    console.error('Error parsing user data:', err);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        window.location.hash = '#home';
        window.location.reload();
    };

    const navLinks = [
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4 font-sans">
            <nav
                // 3D STYLE: Thick Gold Border + Hard Gold Shadow
                className="w-full max-w-7xl bg-[#1A1A1A] border-2 border-[#DCA54C] rounded-full shadow-[6px_6px_0px_0px_#DCA54C] py-3 px-6 md:px-8 flex items-center justify-between transition-transform duration-200"
            >
                {/* --- 1. LEFT: LOGO --- */}
                <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => window.location.hash = '#home'}>
                    <div className="relative">
                        <img src={logo} alt="HIVE Logo" className="w-9 h-9 object-contain relative z-10 transition-transform group-hover:rotate-12" />
                        {/* Little decorative blob behind logo */}
                        <div className="absolute inset-0 bg-[#DCA54C] rounded-full blur-md opacity-20 group-hover:opacity-40"></div>
                    </div>
                    <span className="text-2xl font-black tracking-wide text-white group-hover:text-[#DCA54C] transition-colors">
                        HIVE
                    </span>
                </div>

                {/* --- 2. CENTER: ROUTES + ADD QUERY --- */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Standard Links */}
                    <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-1 border border-white/5">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-gray-400 px-4 py-2 rounded-full
           hover:text-[#DCA54C]
           hover:shadow-[inset_0_-2px_0_0_#DCA54C]
           active:scale-95
           active:shadow-[inset_0_0_0_2px_#DCA54C]
           transition-all duration-150"

                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* "Add Query" - The 'Eye Catchy' 3D Button */}
                    {isLoggedIn && (
                        <a
                            href="#add-query"
                            className="flex items-center gap-2 text-sm font-black
                            text-[#DCA54C]
                            bg-[#1F1F1F]
                            border-2 border-[#000000]
                            px-5 py-2 rounded-full
                            shadow-[3px_3px_0px_0px_#dca54c]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[1px_1px_0px_0px_#3A2A0A]
                            active:translate-x-[3px] active:translate-y-[3px]
                            active:shadow-none
                            transition-all"
                        >
                            <PlusIcon className="w-5 h-5 stroke-3 text-[#DCA54C]" />
                            ADD QUERY
                        </a>

                    )}
                </div>

                {/* --- 3. RIGHT: AUTH --- */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        // LOGGED IN: Profile + Logout
                        <div className="flex items-center gap-4">
                            <a
                                href="#profile"
                                className="flex items-center gap-3 bg-[#2A2A2A] border border-[#DCA54C]/30 px-3 py-1.5 rounded-full hover:border-[#DCA54C] hover:bg-[#3A3A3A] transition-all"
                            >
                                <span className="text-sm font-bold text-[#DCA54C] px-1">{userName}</span>
                                <div className="w-8 h-8 rounded-full bg-[#DCA54C] flex items-center justify-center border border-white">
                                    <UserCircleIcon className="w-6 h-6 text-[#1A1A1A]" />
                                </div>
                            </a>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Logout"
                            >
                                <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        // LOGGED OUT: Login + Signup
                        <>
                            <a
                                href="#login"
                                className="text-sm font-bold text-gray-300 hover:text-[#DCA54C] px-2 hover:underline decoration-[#DCA54C] decoration-2 underline-offset-4 transition-all"
                            >
                                Sign In
                            </a>
                            <a
                                href="#signup"
                                // White 3D Button for Signup
                                className="text-sm font-bold text-[#1A1A1A] bg-white border-2 border-[#DCA54C] px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_#DCA54C] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#DCA54C] transition-all"
                            >
                                Sign Up
                            </a>
                        </>
                    )}
                </div>

                {/* --- MOBILE MENU TOGGLE --- */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white hover:text-[#DCA54C] transition-colors"
                    >
                        {mobileMenuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* --- MOBILE DROPDOWN (Also 3D) --- */}
            {mobileMenuOpen && (
                <div className="absolute top-28 left-4 right-4 bg-[#1A1A1A] border-2 border-[#DCA54C] rounded-3xl shadow-[8px_8px_0px_0px_#DCA54C] p-6 flex flex-col gap-4 md:hidden z-40">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-center font-bold text-gray-300 hover:text-[#1A1A1A] hover:bg-[#DCA54C] py-3 rounded-xl transition-all border border-transparent hover:border-white"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="h-0.5 bg-[#333] w-full my-2"></div>

                    {isLoggedIn && (
                        <a href="#add-query" className="text-center font-black text-[#1A1A1A] bg-[#DCA54C] border-2 border-white py-3 rounded-xl shadow-[4px_4px_0px_0px_#FFFFFF] active:shadow-none active:translate-y-1 transition-all">
                            + ADD QUERY
                        </a>
                    )}

                    {!isLoggedIn ? (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <a href="#login" className="text-center font-bold text-white border-2 border-gray-600 py-3 rounded-xl">Sign In</a>
                            <a href="#signup" className="text-center font-bold text-[#1A1A1A] bg-white border-2 border-[#DCA54C] py-3 rounded-xl shadow-[4px_4px_0px_0px_#DCA54C]">Sign Up</a>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex items-center gap-2 bg-[#2A2A2A] border border-[#DCA54C]/30 px-3 py-2 rounded-lg">
                                <span className="text-sm font-bold text-[#DCA54C] flex-1">{userName}</span>
                                <div className="w-6 h-6 rounded-full bg-[#DCA54C] flex items-center justify-center border border-white">
                                    <UserCircleIcon className="w-4 h-4 text-[#1A1A1A]" />
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="text-center font-bold text-red-400 border-2 border-red-900/50 bg-red-900/10 py-3 rounded-xl hover:bg-red-900/20 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;