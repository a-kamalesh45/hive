import { ClockIcon, CheckBadgeIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';
import bee1Svg from '../../assets/bee1.svg';

// Function to generate consistent avatar style based on user ID
const getUserAvatarStyle = (userId) => {
    // Use user ID to consistently determine avatar style (0 or 1)
    const hash = userId ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const variant = hash % 2;

    if (variant === 0) {
        // Black bee on golden background
        return {
            bgColor: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500',
            filter: 'brightness(0) saturate(100%)' // Makes SVG black
        };
    } else {
        // Golden bee on black background
        return {
            bgColor: 'bg-gradient-to-br from-gray-900 to-gray-800',
            filter: 'brightness(0) saturate(100%) invert(75%) sepia(85%) saturate(452%) hue-rotate(359deg) brightness(95%) contrast(94%)' // Makes SVG golden
        };
    }
};

const QueryTable = ({ queries, userRole, userId, onOpenModal, formatTimeAgo }) => {
    if (queries.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shadow-lg">
                    <ClockIcon className="w-8 h-8 text-amber-600" strokeWidth={2} />
                </div>
                <p className="text-gray-900 font-bold text-lg">No queries found</p>
                <p className="text-gray-600 text-sm mt-2">Create your first query to get started</p>
            </div>
        );
    }

    return (
        <table className="w-full min-w-full">
            <thead>
                <tr className="border-b border-amber-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Issue</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Submitted By</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 bg-white/50">
                {queries.map((query) => (
                    <tr key={query._id} className="hover:bg-amber-50/50 transition-all duration-200">
                        <td className="px-6 py-3 whitespace-nowrap">
                            <span className="text-xs font-mono text-gray-500">
                                {query._id.slice(-6).toUpperCase()}
                            </span>
                        </td>
                        <td className="px-6 py-3">
                            <p className="text-sm text-gray-900 line-clamp-1 max-w-md">
                                {query.issue}
                            </p>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full ${getUserAvatarStyle(query.askedBy?._id).bgColor} flex items-center justify-center shadow-md p-1.5`}>
                                    <img
                                        src={bee1Svg}
                                        alt=""
                                        className="w-full h-full"
                                        style={{ filter: getUserAvatarStyle(query.askedBy?._id).filter }}
                                    />
                                </div>
                                <span className="text-sm text-gray-800 font-medium">
                                    {query.askedBy?.name || 'Unknown'}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                            <StatusBadge status={query.status} />
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                            <span className="text-xs text-gray-500">{formatTimeAgo(query.createdAt)}</span>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                            <div className="flex flex-col items-end gap-1">
                                {/* Show dismantle reason if present */}
                                {query.status === 'Dismantled' && query.reply && (
                                    <p className="text-xs text-gray-500 italic max-w-xs text-left" title={query.reply}>
                                        {query.reply}
                                    </p>
                                )}

                                <div className="flex items-center justify-end gap-1.5">
                                    {/* User role - View only */}
                                    {userRole === 'User' && (
                                        <button className="px-3 py-1.5 text-xs text-gray-700 hover:text-amber-600 font-semibold transition-colors">
                                            View
                                        </button>
                                    )}

                                    {/* Head role - Can resolve and dismantle only their assigned queries */}
                                    {userRole === 'Head' && query.status !== 'Resolved' && query.status !== 'Dismantled' && query.assignedTo?._id === userId && (
                                        <>
                                            <button
                                                onClick={() => onOpenModal(query, 'resolve')}
                                                className="px-3 py-1.5 bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => onOpenModal(query, 'dismantle')}
                                                className="px-3 py-1.5 bg-white border-2 border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                Dismantle
                                            </button>
                                        </>
                                    )}

                                    {/* Admin role - Can resolve/dismantle any query and assign */}
                                    {userRole === 'Admin' && query.status !== 'Resolved' && query.status !== 'Dismantled' && (
                                        <>
                                            <button
                                                onClick={() => onOpenModal(query, 'resolve')}
                                                className="px-3 py-1.5 bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => onOpenModal(query, 'dismantle')}
                                                className="px-3 py-1.5 bg-white border-2 border-red-500 text-red-700 hover:bg-red-50 hover:border-red-600 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                Dismantle
                                            </button>
                                            <button
                                                onClick={() => onOpenModal(query, 'assign')}
                                                className="px-3 py-1.5 bg-white border-2 border-amber-500 text-amber-700 hover:bg-amber-50 hover:border-amber-600 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                Assign
                                            </button>
                                        </>
                                    )}

                                    {/* Show status for completed queries */}
                                    {(query.status === 'Resolved' || query.status === 'Dismantled') && (
                                        <span className="text-xs text-gray-400">
                                            {query.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default QueryTable;
