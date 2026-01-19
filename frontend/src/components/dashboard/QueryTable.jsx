import React from 'react';
import { 
    ClockIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    UserCircleIcon,
    ArrowPathIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import bee1Svg from '../../assets/bee1.svg';

// --- 1. Premium Status Badge (Fixed Width) ---
const StatusBadge = ({ status }) => {
    const styles = {
        Resolved: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            iconColor: 'text-emerald-600',
            icon: <CheckCircleIcon className="w-4 h-4" />
        },
        Dismantled: {
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            border: 'border-rose-200',
            iconColor: 'text-rose-600',
            icon: <XCircleIcon className="w-4 h-4" />
        },
        Assigned: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200',
            iconColor: 'text-blue-600',
            icon: <ArrowRightIcon className="w-4 h-4" />
        },
        Unassigned: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            iconColor: 'text-amber-600',
            icon: <ClockIcon className="w-4 h-4" />
        }
    };

    const config = styles[status] || styles.Unassigned;

    return (
        <div className={`
            w-32 h-8 mx-auto flex items-center justify-center gap-2
            rounded-full border ${config.border} ${config.bg}
            shadow-sm transition-all duration-200
        `}>
            <span className={config.iconColor}>{config.icon}</span>
            <span className={`text-xs font-bold uppercase tracking-wide ${config.text}`}>
                {status}
            </span>
        </div>
    );
};

// --- 2. Action Button (Dynamic Equal Widths) ---
const ActionButton = ({ onClick, label, icon: Icon, variant = 'neutral', title }) => {
    const variants = {
        neutral: 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50',
        primary: 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
        danger: 'bg-white text-rose-700 border-rose-200 hover:border-rose-400 hover:bg-rose-50',
        action: 'bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    };

    return (
        <button
            onClick={onClick}
            title={title}
            // min-w-[6.5rem] ensures "Assign" and "Reassign" are same width
            className={`
                relative flex items-center justify-center gap-2 px-3 py-1.5 
                min-w-40 h-9 rounded-lg border shadow-sm 
                transition-all duration-200 active:scale-95 active:shadow-inner
                text-xs font-bold uppercase tracking-wide
                ${variants[variant]}
            `}
        >
            <Icon className="w-4 h-4" strokeWidth={2} />
            <span>{label}</span>
        </button>
    );
};

// --- 3. User Avatar Generator (Black/Yellow Swap) ---
const getUserAvatarStyle = (userId) => {
    const hash = userId ? userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    // Strictly toggle between 0 and 1
    const variant = hash % 2; 

    if (variant === 0) {
        // Option A: Yellow BG, Black Bee (Normal)
        return {
            bg: 'bg-amber-400',
            ring: 'ring-amber-200',
            filter: 'brightness(0) saturate(100%)' // Forces SVG to Black
        };
    } else {
        // Option B: Black BG, Yellow Bee
        return {
            bg: 'bg-gray-900',
            ring: 'ring-gray-400',
            // Complex filter to turn black SVG to Amber-400
            filter: 'invert(83%) sepia(35%) saturate(1469%) hue-rotate(359deg) brightness(101%) contrast(106%)' 
        };
    }
};

const QueryTable = ({ queries, userRole, userId, onOpenModal, formatTimeAgo, onViewDetails }) => {
    if (queries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                    <ClockIcon className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-gray-500 font-medium">No queries found</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left w-20">ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Issue</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Reporter</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-40">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left w-32">Age</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {queries.map((query) => {
                        const avatarStyle = getUserAvatarStyle(query.askedBy?._id);
                        const isResolved = query.status === 'Resolved';
                        const isDismantled = query.status === 'Dismantled';
                        const isInactive = isResolved || isDismantled;

                        return (
                            <tr 
                                key={query._id} 
                                className={`
                                    group transition-colors duration-150
                                    ${isInactive ? 'bg-gray-50/50' : 'hover:bg-amber-50/20'}
                                `}
                            >
                                {/* ID */}
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs font-semibold text-gray-400">
                                        #{query._id.slice(-4).toUpperCase()}
                                    </span>
                                </td>

                                {/* Issue */}
                                <td className="px-6 py-4">
                                    <p className={`text-sm font-medium line-clamp-2 max-w-sm ${isInactive ? 'text-gray-500' : 'text-gray-800'}`}>
                                        {query.issue}
                                    </p>
                                </td>

                                {/* Reporter */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center 
                                            ring-2 ring-offset-1 ring-offset-white ${avatarStyle.ring} ${avatarStyle.bg}
                                            shadow-sm
                                        `}>
                                            <img 
                                                src={bee1Svg} 
                                                alt="" 
                                                className="w-5 h-5"
                                                style={{ filter: avatarStyle.filter }}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${isInactive ? 'text-gray-500' : 'text-gray-700'}`}>
                                                {query.askedBy?.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 uppercase font-semibold">
                                                {query.askedBy?.role || 'User'}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <StatusBadge status={query.status} />
                                </td>

                                {/* Age */}
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-gray-400">
                                        {formatTimeAgo(query.createdAt)}
                                    </span>
                                </td>

                                {/* Actions Area */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center h-full min-h-[40px]">
                                        
                                        {/* State 1: Show Outcome Message if Inactive */}
                                        {isInactive ? (
                                            query.reply ? (
                                                <div className={`
                                                    flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium max-w-[220px] ml-auto
                                                    ${isResolved 
                                                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' 
                                                        : 'bg-rose-50/50 border-rose-100 text-rose-700'}
                                                `}>
                                                    {/* <span className="uppercase font-bold text-[10px] opacity-70">
                                                        {isResolved ? 'Note:' : 'Reason:'}
                                                    </span> */}
                                                    <span className="truncate italic">{query.reply}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-300 font-medium italic pr-2">
                                                    No remarks
                                                </span>
                                            )
                                        ) : (
                                            /* State 2: Active Buttons */
                                            <div className="flex items-center gap-2">
                                                {/* Agent Indicator (User View) */}
                                                {userRole === 'User' && query.assignedTo && (
                                                    <div className="mr-2 text-xs text-right">
                                                        <span className="block text-gray-400 text-[10px] uppercase">Agent</span>
                                                        <span className="font-bold text-amber-600">{query.assignedTo.name}</span>
                                                    </div>
                                                )}

                                                {/* Details Button (User) */}
                                                {userRole === 'User' && (
                                                    <ActionButton 
                                                        onClick={() => onViewDetails && onViewDetails(query)}
                                                        label="Details"
                                                        icon={ArrowRightIcon}
                                                    />
                                                )}

                                                {/* Head/Admin Actions */}
                                                {userRole === 'Head' && query.assignedTo?._id === userId && (
                                                    <>
                                                        <ActionButton 
                                                            onClick={() => onOpenModal(query, 'dismantle')}
                                                            label="Dismantle"
                                                            icon={XCircleIcon}
                                                            variant="danger"
                                                        />

                                                        <ActionButton 
                                                            onClick={() => onOpenModal(query, 'resolve')}
                                                            label="Resolve"
                                                            icon={CheckCircleIcon}
                                                            variant="primary"
                                                        />
                                                    </>
                                                )}

                                                {userRole === 'Admin' && (
                                                    <>
                                                        <ActionButton 
                                                            onClick={() => onOpenModal(query, 'dismantle')}
                                                            label="Dismantle"
                                                            icon={XCircleIcon}
                                                            variant="danger"
                                                        />
                                                        
                                                        <ActionButton 
                                                            onClick={() => onOpenModal(query, 'assign')}
                                                            label={query.assignedTo ? "Reassign" : "Assign"}
                                                            icon={query.assignedTo ? ArrowPathIcon : UserCircleIcon}
                                                            variant="action"
                                                        />

                                                        <ActionButton 
                                                            onClick={() => onOpenModal(query, 'resolve')}
                                                            label="Resolve"
                                                            icon={CheckCircleIcon}
                                                            variant="primary"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default QueryTable;