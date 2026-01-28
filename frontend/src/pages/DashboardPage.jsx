import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PlusCircleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { HexagonBackground } from '../components/hexabg';
import StatsCard from '../components/dashboard/StatsCard';
import QueryTable from '../components/dashboard/QueryTable';
import QueryDetailsModal from '../components/dashboard/QueryDetailsModal';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [queries, setQueries] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('User');
    const [userId, setUserId] = useState(null);
    const [detailsQuery, setDetailsQuery] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [heads, setHeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [queriesPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
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
                navigate('/login');
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
                navigate('/login');
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
                navigate('/login');
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

    const handleResolveQuery = async (queryId, reply) => {
        try {
            setActionLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/api/queries/${queryId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ reply })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to resolve query');
            }

            await fetchDashboardData();
            setDetailsQuery(null);
        } catch (err) {
            console.error('Error resolving query:', err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDismantleQuery = async (queryId, reason) => {
        try {
            setActionLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/api/queries/${queryId}/dismantle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ reason })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to dismantle query');
            }

            await fetchDashboardData();
            setDetailsQuery(null);
        } catch (err) {
            console.error('Error dismantling query:', err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignQuery = async (queryId, headId) => {
        try {
            setActionLoading(true);
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/api/queries/${queryId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ headId })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to assign query');
            }

            await fetchDashboardData();
            setDetailsQuery(null);
        } catch (err) {
            console.error('Error assigning query:', err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenDetails = async (query) => {
        setDetailsQuery(query);
        // Fetch heads if admin/head is viewing
        if (userRole === 'Admin' || userRole === 'Head') {
            await fetchHeads();
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
        <HexagonBackground>
            <div className="min-h-screen pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-600 mt-2">Welcome back! Manage and track your queries</p>
                        </div>
                        <button
                            onClick={() => navigate('/add-query')}
                            className="group px-6 py-3 bg-[#DCA54C] hover:bg-[#C8933F] text-[#1A1A1A] text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statsConfig.map((stat, idx) => (
                                <StatsCard key={stat.name} stat={stat} index={idx} />
                            ))}
                        </div>
                    )}

                    {/* Recent Queries Table */}
                    {!loading && !error && (
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-300">
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
                                    onViewDetails={handleOpenDetails}
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
                                    <div className="px-6 py-5 border-b border-amber-100 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            Top Contributors
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
                                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                                                            2
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
                                                        <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl border-2 border-white">
                                                            1
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
                                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white">
                                                            3
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

                    {/* Query Details Modal - Unified for all roles */}
                    <QueryDetailsModal
                        query={detailsQuery}
                        userRole={userRole}
                        userId={userId}
                        heads={heads}
                        onClose={() => setDetailsQuery(null)}
                        onResolve={handleResolveQuery}
                        onDismantle={handleDismantleQuery}
                        onAssign={handleAssignQuery}
                        actionLoading={actionLoading}
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
            </div>
            {/* </div> */}
        </HexagonBackground>
    );
};

export default DashboardPage;
