import { HexagonBackground } from '../components/hexabg';
import {
    MagnifyingGlassIcon,
    BellAlertIcon,
    ChartBarIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    ClockIcon,
    ArrowPathIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';

const FeaturesPage = () => {
    const features = [
        {
            icon: UserGroupIcon,
            title: 'Role-Based Access Control',
            description: 'Three distinct roles - Users submit queries, Heads resolve assigned queries, and Admins manage the entire system with full oversight.',
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowPathIcon,
            title: 'Smart Query Assignment',
            description: 'Admins can assign queries to specific heads based on expertise and workload, ensuring efficient resolution and proper delegation.',
            color: 'bg-purple-50 border-purple-200 text-purple-700',
            iconColor: 'text-purple-600',
        },
        {
            icon: EnvelopeIcon,
            title: 'Email Notifications',
            description: 'Automatic email alerts when queries are assigned to heads, when heads are assigned to users, and when queries are resolved.',
            color: 'bg-green-50 border-green-200 text-green-700',
            iconColor: 'text-green-600',
        },
        {
            icon: MagnifyingGlassIcon,
            title: 'Advanced Search & Filter',
            description: 'Search queries by ID or content, filter by status (All, Assigned, Resolved, Unassigned), and view personalized query lists based on your role.',
            color: 'bg-amber-50 border-amber-200 text-amber-700',
            iconColor: 'text-amber-600',
        },
        {
            icon: ChartBarIcon,
            title: 'Real-Time Analytics',
            description: 'Dashboard with live statistics showing total queries, resolved count, pending items, and unassigned queries at a glance.',
            color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
            iconColor: 'text-indigo-600',
        },
        {
            icon: ShieldCheckIcon,
            title: 'Query Actions',
            description: 'Heads can resolve queries with replies or dismantle them with reasons. Admins have full control to manage all queries and assignments.',
            color: 'bg-rose-50 border-rose-200 text-rose-700',
            iconColor: 'text-rose-600',
        },
        {
            icon: ClockIcon,
            title: 'Query Tracking',
            description: 'Track query lifecycle from submission to resolution with timestamps, status updates, and complete audit trail for accountability.',
            color: 'bg-teal-50 border-teal-200 text-teal-700',
            iconColor: 'text-teal-600',
        },
        {
            icon: BellAlertIcon,
            title: 'Leaderboard System',
            description: 'Track top performers with a leaderboard showing heads ranked by resolved queries, fostering healthy competition and productivity.',
            color: 'bg-orange-50 border-orange-200 text-orange-700',
            iconColor: 'text-orange-600',
        },
    ];

    return (
        <HexagonBackground>
            <div className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                        Powerful Features for
                        <br />
                        <span className="text-[#DCA54C]">Query Management</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                        Everything you need to organize, track, and resolve queries efficiently
                    </p>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-8 hover:shadow-2xl hover:border-[#DCA54C] transition-all duration-300 transform hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className={`inline-flex p-4 rounded-xl border-2 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#DCA54C] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {feature.description}
                                </p>

                                {/* Decorative corner accent */}
                                <div className="absolute top-4 right-4 w-2 h-2 bg-[#DCA54C] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto text-center mt-20">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-12 shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join HIVE today and experience seamless query management
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/signup"
                                className="px-10 py-4 bg-[#DCA54C] hover:bg-[#C8933F] text-[#1A1A1A] text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Sign Up Free
                            </a>
                            <a
                                href="/contact"
                                className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </HexagonBackground>
    );
};

export default FeaturesPage;
