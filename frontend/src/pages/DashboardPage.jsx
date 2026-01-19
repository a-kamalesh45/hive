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
    const [searchQuery, setSearchQuery] = useState('');
    const [detailsQuery, setDetailsQuery] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    // const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);

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
            
            // Redirect to login if no token
            if (!token) {
                window.location.hash = '#login';
                return;
            }

            const [queriesRes, statsRes, leaderboardRes, headsRes] = await Promise.all([
                fetch(`${apiUrl}/api/queries`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                }),
                fetch(`${apiUrl}/api/query-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                }),
                fetch(`${apiUrl}/api/leaderboard`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                }),
                fetch(`${apiUrl}/api/heads`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    credentials: 'include'
                })
            ]);

            // Check for unauthorized responses
            if (queriesRes.status === 401 || statsRes.status === 401 || 
                leaderboardRes.status === 401 || headsRes.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.hash = '#login';
                return;
            }

            if (!queriesRes.ok || !statsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const queriesData = await queriesRes.json();
            const statsData = await statsRes.json();
            const leaderboardData = leaderboardRes.ok ? await leaderboardRes.json() : { leaderboard: [] };
            const headsData = headsRes.ok ? await headsRes.json() : { heads: [] };

            setQueries(queriesData.queries || []);
            setStats(statsData.stats || {});
            // backend may return { leaderboard: [...] } or an array directly
            setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : (leaderboardData.leaderboard || leaderboardData.data || []));
            setHeads(headsData.heads || []);
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
            
            if (!token) {
                window.location.hash = '#login';
                return;
            }

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
            
            if (!token) {
                window.location.hash = '#login';
                return;
            }

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

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.hash = '#login';
                return;
            }

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

    // Search and filter logic with tab filtering
    let tabFilteredQueries = queries;

    if (userRole === 'User') {
        // Participants see all queries (backend returns all queries with proper sorting)
        // Tab 'all': Show all queries
        // Tab 'my-queries': Show only queries created by the participant
        if (activeTab === 'my-queries') {
            tabFilteredQueries = queries.filter(q => q.askedBy?._id === userId);
        }
        // 'all' tab shows everything (no filtering)
    } else if (userRole === 'Head') {
        // Heads see all queries (backend returns all queries with proper sorting)
        if (activeTab === 'assigned') {
            // Show only queries assigned to this head with status 'Assigned'
            tabFilteredQueries = queries.filter(
                q => q.status === 'Assigned' && q.assignedTo?._id === userId
            );
        } else if (activeTab === 'resolved') {
            // Show only resolved queries
            tabFilteredQueries = queries.filter(q => q.status === 'Resolved');
        }
        // 'all' tab shows everything (no filtering)
    } else if (userRole === 'Admin') {
        // Admins see all queries (backend returns all queries with proper sorting)
        if (activeTab === 'to-be-assigned') {
            // Show unassigned queries
            tabFilteredQueries = queries.filter(q => q.status === 'Unassigned');
        } else if (activeTab === 'resolved') {
            // Show resolved queries
            tabFilteredQueries = queries.filter(q => q.status === 'Resolved');
        }
        // 'all' tab shows everything (no filtering)
    }

    const filteredQueries = tabFilteredQueries.filter(query =>
        query.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        query.askedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastQuery = currentPage * queriesPerPage;
    const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
    const currentQueries = filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);
    const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);

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
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#FFF9F0] pt-35 pb-12 relative overflow-hidden">
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
                        {/* Tabs Section */}
                        <div className="px-6 py-4 border-b border-amber-50 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {userRole === 'User' && (
                                    <>
                                        <button
                                            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'all'
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            All Queries
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('my-queries'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'my-queries'
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            My Queries
                                        </button>
                                    </>
                                )}

                                {userRole === 'Head' && (
                                    <>
                                        <button
                                            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'all'
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('assigned'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'assigned'
                                                ? 'bg-yellow-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            Assigned to me (unresolved)
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('resolved'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'resolved'
                                                ? 'bg-emerald-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            Resolved by me
                                        </button>
                                    </>
                                )}

                                {userRole === 'Admin' && (
                                    <>
                                        <button
                                            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'all'
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('to-be-assigned'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'to-be-assigned'
                                                ? 'bg-yellow-400 text-gray-900 shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            To be assigned
                                        </button>
                                        <button
                                            onClick={() => { setActiveTab('resolved'); setCurrentPage(1); }}
                                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${activeTab === 'resolved'
                                                ? 'bg-emerald-500 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                                                }`}
                                        >
                                            Resolved
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

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
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
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
                                onViewDetails={(query) => setDetailsQuery(query)}
                                formatTimeAgo={formatTimeAgo}
                            />
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-amber-100 bg-gradient-to-r from-amber-50/30 to-yellow-50/20">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-700 font-medium">
                                        Showing {indexOfFirstQuery + 1} to {Math.min(indexOfLastQuery, filteredQueries.length)} of {filteredQueries.length} queries
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

                        {/* Top 3 Heads Leaderboard (under table) */}
                        {!loading && !error && leaderboard.length > 0 && (
                            <div className="mt-6 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        🏆 Top Contributors
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">Our top 3 query resolvers this month</p>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row items-end justify-center gap-6">
                                        {/* Second Place */}
                                        {leaderboard[1] && (
                                            <div className="flex flex-col items-center w-full md:w-48 transform md:-translate-y-2">
                                                <div className="relative mb-4">
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white">
                                                        {leaderboard[1].name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                                                        🥈
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{leaderboard[1].name}</h4>
                                                <p className="text-sm text-gray-600 mb-2 truncate w-full text-center">{leaderboard[1].email}</p>
                                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full">
                                                    <p className="text-2xl font-bold text-gray-900">{leaderboard[1].resolvedCount}</p>
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide text-center">Resolved</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* First Place */}
                                        {leaderboard[0] && (
                                            <div className="flex flex-col items-center w-full md:w-52">
                                                <div className="relative mb-4">
                                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-4 border-white">
                                                        {leaderboard[0].name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl border-2 border-white">
                                                        👑
                                                    </div>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-1">{leaderboard[0].name}</h4>
                                                <p className="text-sm text-gray-600 mb-3 truncate w-full text-center">{leaderboard[0].email}</p>
                                                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-3 rounded-full border-2 border-amber-300">
                                                    <p className="text-3xl font-bold text-amber-900">{leaderboard[0].resolvedCount}</p>
                                                    <p className="text-xs text-amber-700 uppercase tracking-wide text-center font-semibold">Resolved</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Third Place */}
                                        {leaderboard[2] && (
                                            <div className="flex flex-col items-center w-full md:w-48 transform md:-translate-y-2">
                                                <div className="relative mb-4">
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white">
                                                        {leaderboard[2].name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                                                        🥉
                                                    </div>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{leaderboard[2].name}</h4>
                                                <p className="text-sm text-gray-600 mb-2 truncate w-full text-center">{leaderboard[2].email}</p>
                                                <div className="bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full">
                                                    <p className="text-2xl font-bold text-orange-900">{leaderboard[2].resolvedCount}</p>
                                                    <p className="text-xs text-orange-700 uppercase tracking-wide text-center">Resolved</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }

                {/* Details Modal for Users */}
                {
                    detailsQuery && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn border-2 border-gray-100">
                                {/* Modal Header */}
                                <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 border-b-2 border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">Query Details</h3>
                                            <p className="text-sm text-gray-600 mt-1">Full information about your query</p>
                                        </div>
                                        <button
                                            onClick={() => setDetailsQuery(null)}
                                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-6">
                                    {/* Query ID and Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Query ID</p>
                                            <p className="font-mono text-lg font-semibold text-gray-900">{detailsQuery._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Status</p>
                                            <div className="flex items-center">
                                                {/* Import PremiumStatusBadge equivalent here */}
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${detailsQuery.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                                                    detailsQuery.status === 'Dismantled' ? 'bg-rose-100 text-rose-800' :
                                                        detailsQuery.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {detailsQuery.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Issue Description */}
                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Your Query</p>
                                        <p className="text-gray-900 text-base leading-relaxed">{detailsQuery.issue}</p>
                                    </div>

                                    {/* Assigned To */}
                                    {detailsQuery.assignedTo && (
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border-2 border-blue-300">
                                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3 block">Assigned To</p>
                                            <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {detailsQuery.assignedTo.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-gray-900 truncate">{detailsQuery.assignedTo.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{detailsQuery.assignedTo.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resolution or Dismantle Reason */}
                                    {detailsQuery.status === 'Resolved' && detailsQuery.reply && (
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-200/20 rounded-full -ml-12 -mb-12"></div>
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Resolution from {detailsQuery.assignedTo?.name || 'Head'}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                                                    <p className="text-gray-800 text-base leading-relaxed italic">"{detailsQuery.reply}"</p>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Resolved on {new Date(detailsQuery.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {detailsQuery.status === 'Dismantled' && detailsQuery.reply && (
                                        <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-5 border-2 border-rose-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-200/20 rounded-full -ml-12 -mb-12"></div>
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm font-bold text-rose-900 uppercase tracking-wider">Query Dismantled by {detailsQuery.assignedTo?.name || 'Admin'}</p>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
                                                    <p className="text-gray-800 text-base leading-relaxed italic">"{detailsQuery.reply}"</p>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-rose-700">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Dismantled on {new Date(detailsQuery.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Timestamps */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Submitted</p>
                                            <p className="text-sm text-gray-900">{new Date(detailsQuery.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Last Updated</p>
                                            <p className="text-sm text-gray-900">{new Date(detailsQuery.updatedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                                    <button
                                        onClick={() => setDetailsQuery(null)}
                                        className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

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
            </div >

            <style>{`
                @keyframes hexagonPulse {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.05; }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
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
        </div >
    );
};

export default DashboardPage;
