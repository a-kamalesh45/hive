import { XMarkIcon, CheckBadgeIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import bee1Svg from '../../assets/bee1.svg';

const ActionModal = ({
    modalType,
    selectedQuery,
    formData,
    setFormData,
    heads,
    actionLoading,
    onClose,
    onAction,
    honeycombPattern
}) => {
    if (!modalType || !selectedQuery) return null;

    const getModalConfig = () => {
        switch (modalType) {
            case 'resolve':
                return {
                    title: 'Resolve Query',
                    icon: CheckBadgeIcon,
                    iconBg: 'bg-emerald-600',
                    borderColor: 'border-emerald-500',
                    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                    focusRing: 'focus:ring-emerald-500',
                    buttonText: 'Resolve Query'
                };
            case 'dismantle':
                return {
                    title: 'Dismantle Query',
                    icon: XCircleIcon,
                    iconBg: 'bg-red-600',
                    borderColor: 'border-red-500',
                    buttonColor: 'bg-red-600 hover:bg-red-700',
                    focusRing: 'focus:ring-red-500',
                    buttonText: 'Dismantle Query'
                };
            case 'assign':
                return {
                    title: selectedQuery?.assignedTo ? 'Reassign Query' : 'Assign Query',
                    icon: UserCircleIcon,
                    iconBg: 'bg-amber-600',
                    borderColor: 'border-amber-500',
                    buttonColor: 'bg-amber-600 hover:bg-amber-700',
                    focusRing: 'focus:ring-amber-500',
                    buttonText: selectedQuery?.assignedTo ? 'Reassign Query' : 'Assign Query'
                };
            default:
                return {};
        }
    };

    const config = getModalConfig();
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn border-2 border-gray-100 relative z-[9999]">
                {/* Modal Header */}
                <div className={`relative bg-white px-6 py-5 border-b-2 ${config.borderColor}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{config.title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                    {/* Query Details Card */}
                    <div className={`bg-linear-to-br from-gray-50 to-white rounded-xl p-5 border-2 ${config.borderColor} border-opacity-20`}>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Query ID</p>
                                <p className="font-mono text-sm font-semibold text-gray-900">{selectedQuery._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Issue</p>
                                <p className="text-sm text-gray-900 line-clamp-2">{selectedQuery.issue}</p>
                            </div>
                            {selectedQuery.askedBy && (
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Submitted By</p>
                                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200">
                                        <img src={bee1Svg} alt="" className="w-7 h-7" />
                                        <span className="text-sm font-medium text-gray-900">{selectedQuery.askedBy.name}</span>
                                    </div>
                                </div>
                            )}

                            {selectedQuery.assignedTo && (
                                <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Currently Assigned To</p>
                                    <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                                        <img src={bee1Svg} alt="" className="w-7 h-7" />
                                        <span className="text-sm font-medium text-gray-900">{selectedQuery.assignedTo.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action-specific inputs */}
                    {modalType === 'resolve' && (
                        <div className="space-y-3 animate-fadeIn">
                            {selectedQuery.status === 'Resolved' && selectedQuery.reply && (
                                <div className="relative p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl shadow-sm">
                                    <div className="absolute top-2 left-4 inline-block px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                                        ✓ RESOLUTION
                                    </div>
                                    <p className="text-sm text-emerald-900 mt-6 leading-relaxed font-medium italic border-l-4 border-emerald-400 pl-3">
                                        "{selectedQuery.reply}"
                                    </p>
                                </div>
                            )}
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Resolution Reply *
                            </label>
                            <textarea
                                value={formData.reply}
                                onChange={(e) => setFormData({ ...formData, reply: e.target.value })}
                                placeholder="Provide details about the resolution..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                rows="4"
                            />
                        </div>
                    )}

                    {modalType === 'dismantle' && (
                        <div className="space-y-3 animate-fadeIn">
                            {selectedQuery.status === 'Dismantled' && selectedQuery.reply && (
                                <div className="relative p-4 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl shadow-sm">
                                    <div className="absolute top-2 left-4 inline-block px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                                        ✕ REASON
                                    </div>
                                    <p className="text-sm text-rose-900 mt-6 leading-relaxed font-medium italic border-l-4 border-rose-400 pl-3">
                                        "{selectedQuery.reply}"
                                    </p>
                                </div>
                            )}
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Reason for Dismantling *
                            </label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Explain why this query is being dismantled..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                rows="4"
                            />
                        </div>
                    )}

                    {modalType === 'assign' && (
                        <div className="space-y-3 animate-fadeIn">
                            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Select Team Head *
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {heads.map((head) => (
                                    <label
                                        key={head._id}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group/option hover:shadow-md ${formData.headId === head._id
                                            ? 'border-amber-500 bg-amber-50 shadow-md'
                                            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="head"
                                            value={head._id}
                                            checked={formData.headId === head._id}
                                            onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
                                            className="w-5 h-5 accent-amber-600 cursor-pointer group-hover/option:scale-110 transition-transform"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <img src={bee1Svg} alt="" className="w-8 h-8" />
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 group-hover/option:text-amber-700 transition-colors">{head.name}</p>
                                                    <p className="text-xs text-gray-600">{head.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                                                        {head.queriesTaken} active
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-5 bg-linear-to-r from-gray-50 to-white border-t-2 border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={actionLoading}
                        className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95 group/cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAction}
                        disabled={actionLoading || (modalType === 'assign' && !formData.headId)}
                        className={`px-6 py-2.5 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 ${config.buttonColor} group/action`}
                    >
                        {actionLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{config.buttonText}</span>
                                <svg className="w-4 h-4 group-hover/action:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
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
    );
};

export default ActionModal;
