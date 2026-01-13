import { useState } from 'react';
import {
    HomeIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CogIcon,
    UserGroupIcon,
    BellIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', icon: HomeIcon, href: '#', current: true },
        { name: 'Queries', icon: DocumentTextIcon, href: '#', current: false },
        { name: 'Analytics', icon: ChartBarIcon, href: '#', current: false },
        { name: 'Users', icon: UserGroupIcon, href: '#', current: false },
        { name: 'Settings', icon: CogIcon, href: '#', current: false },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="h-full w-64 bg-slate-900 border-r border-slate-800 backdrop-blur-md bg-opacity-50">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QM</span>
                            </div>
                            <span className="text-white font-semibold text-lg">QueryMgmt</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${item.current
                                            ? 'bg-indigo-600 bg-opacity-20 text-indigo-400 border border-indigo-500 border-opacity-30'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:bg-opacity-50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${item.current ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                    {item.name}
                                </a>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:bg-opacity-50 cursor-pointer transition duration-200">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">JD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">John Doe</p>
                                <p className="text-xs text-slate-400 truncate">john@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-slate-900 bg-opacity-50 backdrop-blur-md border-b border-slate-800">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Left: Menu Toggle */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-slate-400 hover:text-white transition duration-200"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:block relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search queries..."
                                    className="w-64 pl-10 pr-4 py-2 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition duration-200">
                                <BellIcon className="w-6 h-6" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
                            </button>

                            {/* User Avatar (Mobile) */}
                            <div className="lg:hidden">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center cursor-pointer">
                                    <span className="text-white font-semibold text-xs">JD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950 bg-opacity-75 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
