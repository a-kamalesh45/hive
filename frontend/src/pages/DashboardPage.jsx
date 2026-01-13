import { useState, useEffect } from 'react';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PlusCircleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../components/dashboard/StatsCard';
import QueryTable from '../components/dashboard/QueryTable';
import ActionModal from '../components/dashboard/ActionModal';
import beePng from '../assets/bee.png';

const DashboardPage = () => {
    const [queries, setQueries] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('User');
    const [userId, setUserId] = useState(null);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [heads, setHeads] = useState([]);
    const [formData, setFormData] = useState({ reply: '', headId: '', reason: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [queriesPerPage] = useState(10);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role || 'User');
        setUserId(user._id || null);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            const [queriesRes, statsRes] = await Promise.all([
                fetch(`${apiUrl}/api/queries`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                }),
                fetch(`${apiUrl}/api/query-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                })
            ]);

            if (!queriesRes.ok || !statsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const queriesData = await queriesRes.json();
            const statsData = await statsRes.json();

            setQueries(queriesData.queries || []);
            setStats(statsData.stats || {});
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchHeads = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/api/heads`, {
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setHeads(data.heads || []);
            }
        } catch (err) {
            console.error('Error fetching heads:', err);
        }
    };

    const handleOpenModal = async (query, type) => {
        setSelectedQuery(query);
        setModalType(type);
        setFormData({ reply: '', headId: '', reason: '' });

        if (type === 'assign') {
            await fetchHeads();
        }
    };

    const handleCloseModal = () => {
        setSelectedQuery(null);
        setModalType(null);
        setFormData({ reply: '', headId: '', reason: '' });
    };

    const handleAction = async () => {
        if (!selectedQuery) return;

        try {
            setActionLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            let endpoint = '';
            let body = {};

            if (modalType === 'resolve') {
                endpoint = `/api/queries/${selectedQuery._id}/resolve`;
                body = { reply: formData.reply };
            } else if (modalType === 'dismantle') {
                endpoint = `/api/queries/${selectedQuery._id}/dismantle`;
                body = { reason: formData.reason };
            } else if (modalType === 'assign') {
                endpoint = `/api/queries/${selectedQuery._id}/assign`;
                body = { headId: formData.headId };
            }

            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Action failed');
            }

            await fetchDashboardData();
            handleCloseModal();
        } catch (err) {
            console.error('Error performing action:', err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const statsConfig = stats ? [
        {
            name: 'Total Queries',
            value: stats.total || 0,
            icon: ClockIcon,
            bgColor: 'bg-[#F4B315]',
            borderColor: 'border-gray-200'
        },
        {
            name: 'Resolved',
            value: stats.resolved || 0,
            icon: CheckCircleIcon,
            bgColor: 'bg-[#8E5915]',
            borderColor: 'border-gray-200'
        },
        {
            name: 'Pending',
            value: stats.pending || 0,
            icon: ExclamationCircleIcon,
            bgColor: 'bg-[#E59312]',
            borderColor: 'border-gray-200'
        },
        {
            name: 'Unassigned',
            value: stats.unassigned || 0,
            icon: UserCircleIcon,
            bgColor: 'bg-[#D3AF85]',
            borderColor: 'border-gray-200'
        }
    ] : [];

    // Pagination logic
    const indexOfLastQuery = currentPage * queriesPerPage;
    const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
    const currentQueries = queries.slice(indexOfFirstQuery, indexOfLastQuery);
    const totalPages = Math.ceil(queries.length / queriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
        return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF9F0] pt-20 pb-12 relative overflow-hidden">
            {/* Subtle Hexagon Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='%23F59E0B' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 52px'
            }}></div>

            {/* Subtle Bee Watermarks */}
            <img src={beePng} alt="" className="absolute top-20 right-10 w-32 h-32 opacity-[0.02] pointer-events-none" />
            <img src={beePng} alt="" className="absolute bottom-20 left-10 w-24 h-24 opacity-[0.02] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your query overview.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '#add-query'}
                        className="group px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                        <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        New Query
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-amber-100 border-t-amber-500"></div>
                        <p className="mt-4 text-gray-700 font-medium text-sm">Loading dashboard data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <ExclamationCircleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-red-900 font-bold text-lg">Failed to load dashboard data</h3>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                            <button
                                onClick={fetchDashboardData}
                                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {statsConfig.map((stat, idx) => (
                            <StatsCard key={stat.name} stat={stat} index={idx} />
                        ))}
                    </div>
                )}

                {/* Recent Queries Table */}
                {!loading && !error && (
                    <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="px-6 py-5 border-b border-amber-50 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Recent Queries</h2>
                                    <p className="text-sm text-gray-600 mt-1">Track and manage your queries</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search queries..."
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all w-56 shadow-sm"
                                        />
                                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm">
                                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <QueryTable
                                queries={currentQueries}
                                userRole={userRole}
                                userId={userId}
                                onOpenModal={handleOpenModal}
                                formatTimeAgo={formatTimeAgo}
                            />
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-amber-100 bg-gradient-to-r from-amber-50/30 to-yellow-50/20">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-700 font-medium">
                                        Showing {indexOfFirstQuery + 1} to {Math.min(indexOfLastQuery, queries.length)} of {queries.length} queries
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => paginate(index + 1)}
                                                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm ${currentPage === index + 1
                                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50 hover:border-amber-200'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Modals */}
                <ActionModal
                    modalType={modalType}
                    selectedQuery={selectedQuery}
                    formData={formData}
                    setFormData={setFormData}
                    heads={heads}
                    actionLoading={actionLoading}
                    onClose={handleCloseModal}
                    onAction={handleAction}
                />
            </div>

            <style>{`
                @keyframes hexagonPulse {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.05; }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
