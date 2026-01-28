import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import bee1Svg from '../../assets/bee1.svg';

const QueryDetailsModal = ({
    query,
    userRole,
    userId,
    heads,
    onClose,
    onResolve,
    onDismantle,
    onAssign,
    actionLoading
}) => {
    const [activeAction, setActiveAction] = useState(null);
    const [formData, setFormData] = useState({ reply: '', reason: '', headId: '' });

    if (!query) return null;

    const isAssignedToCurrentHead = query.assignedTo?._id === userId;
    const canHeadTakeAction = userRole === 'Head' && isAssignedToCurrentHead;
    const canAdminTakeAction = userRole === 'Admin';
    const isQueryActive = query.status !== 'Resolved' && query.status !== 'Dismantled';

    const handleAction = async () => {
        if (activeAction === 'resolve') {
            await onResolve(query._id, formData.reply);
        } else if (activeAction === 'dismantle') {
            await onDismantle(query._id, formData.reason);
        } else if (activeAction === 'assign') {
            await onAssign(query._id, formData.headId);
        }
        setActiveAction(null);
        setFormData({ reply: '', reason: '', headId: '' });
    };

    const resetAction = () => {
        setActiveAction(null);
        setFormData({ reply: '', reason: '', headId: '' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-scaleIn border border-gray-200">
                <div className="max-h-[85vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 border-b-2 border-amber-200 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Query Details</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {userRole === 'User' ? 'View your query information' : 'View and manage query'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:scale-110 active:scale-95"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-6">
                        {/* Query ID and Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Query ID</p>
                                <p className="font-mono text-lg font-semibold text-gray-900">#{query._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Status</p>
                                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${query.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                                    query.status === 'Dismantled' ? 'bg-rose-100 text-rose-800' :
                                        query.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                            'bg-amber-100 text-amber-800'
                                    }`}>
                                    {query.status}
                                </span>
                            </div>
                        </div>

                        {/* Submitted By */}
                        {query.askedBy && (
                            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">Submitted By</p>
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                                    <img src={bee1Svg} alt="" className="w-10 h-10" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900">{query.askedBy.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{query.askedBy.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Issue Description */}
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 border-purple-200">
                            <p className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-3">Query Issue</p>
                            <div className="bg-white rounded-lg p-4 border border-purple-100">
                                <p className="text-gray-900 text-base leading-relaxed">{query.issue}</p>
                            </div>
                        </div>

                        {/* Assigned To */}
                        {query.assignedTo && (
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-300">
                                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">Assigned To</p>
                                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-100">
                                    <img src={bee1Svg} alt="" className="w-10 h-10" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900">{query.assignedTo.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{query.assignedTo.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resolution or Dismantle Reason */}
                        {query.status === 'Resolved' && query.reply && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <CheckCircleIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                                        </div>
                                        <p className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
                                            Resolution from {query.assignedTo?.name || 'Team'}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                                        <p className="text-gray-800 text-base leading-relaxed italic">"{query.reply}"</p>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Resolved on {new Date(query.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {query.status === 'Dismantled' && query.reply && (
                            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-5 border-2 border-rose-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
                                            <XCircleIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                                        </div>
                                        <p className="text-sm font-bold text-rose-900 uppercase tracking-wider">
                                            Dismantled Reason
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100">
                                        <p className="text-gray-800 text-base leading-relaxed italic">"{query.reply}"</p>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2 text-xs text-rose-700">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Dismantled on {new Date(query.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Submitted</p>
                                <p className="text-sm text-gray-900">{new Date(query.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Last Updated</p>
                                <p className="text-sm text-gray-900">{new Date(query.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Forms */}
                        {activeAction === 'resolve' && (
                            <div className="bg-emerald-50 rounded-xl p-5 border-2 border-emerald-200 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
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

                        {activeAction === 'dismantle' && (
                            <div className="bg-rose-50 rounded-xl p-5 border-2 border-rose-200 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    Reason for Dismantling *
                                </label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Explain why this query is being dismantled..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 resize-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                    rows="4"
                                />
                            </div>
                        )}

                        {activeAction === 'assign' && (
                            <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-200 animate-fadeIn">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                    Select Team Head *
                                </label>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {heads.map((head) => (
                                        <label
                                            key={head._id}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group/option hover:shadow-md ${formData.headId === head._id
                                                ? 'border-amber-500 bg-amber-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
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
                                                        <p className="font-semibold text-gray-900">{head.name}</p>
                                                        <p className="text-xs text-gray-600">{head.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                                                            {head.queriesTaken || 0} active
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

                    {/* Modal Footer with Actions */}
                    <div className="sticky bottom-0 px-6 py-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all duration-200"
                            >
                                Close
                            </button>

                            <div className="flex items-center gap-3">
                                {/* Action buttons for Head (only for assigned queries) */}
                                {canHeadTakeAction && isQueryActive && (
                                    <>
                                        {activeAction === 'dismantle' ? (
                                            <>
                                                <button
                                                    onClick={resetAction}
                                                    className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAction}
                                                    disabled={!formData.reason || actionLoading}
                                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    {actionLoading ? 'Processing...' : 'Confirm Dismantle'}
                                                </button>
                                            </>
                                        ) : activeAction === 'resolve' ? (
                                            <>
                                                <button
                                                    onClick={resetAction}
                                                    className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAction}
                                                    disabled={!formData.reply || actionLoading}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    {actionLoading ? 'Processing...' : 'Confirm Resolve'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setActiveAction('dismantle')}
                                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    Dismantle
                                                </button>
                                                <button
                                                    onClick={() => setActiveAction('resolve')}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    Resolve Query
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* Action buttons for Admin */}
                                {canAdminTakeAction && isQueryActive && (
                                    <>
                                        {activeAction === 'dismantle' ? (
                                            <>
                                                <button
                                                    onClick={resetAction}
                                                    className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAction}
                                                    disabled={!formData.reason || actionLoading}
                                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    {actionLoading ? 'Processing...' : 'Confirm Dismantle'}
                                                </button>
                                            </>
                                        ) : activeAction === 'assign' ? (
                                            <>
                                                <button
                                                    onClick={resetAction}
                                                    className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAction}
                                                    disabled={!formData.headId || actionLoading}
                                                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {query.assignedTo ? <ArrowPathIcon className="w-5 h-5" /> : <UserCircleIcon className="w-5 h-5" />}
                                                    {actionLoading ? 'Processing...' : (query.assignedTo ? 'Confirm Reassign' : 'Confirm Assign')}
                                                </button>
                                            </>
                                        ) : activeAction === 'resolve' ? (
                                            <>
                                                <button
                                                    onClick={resetAction}
                                                    className="px-5 py-2.5 text-gray-700 bg-white hover:bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAction}
                                                    disabled={!formData.reply || actionLoading}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    {actionLoading ? 'Processing...' : 'Confirm Resolve'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setActiveAction('dismantle')}
                                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    <XCircleIcon className="w-5 h-5" />
                                                    Dismantle
                                                </button>
                                                <button
                                                    onClick={() => setActiveAction('assign')}
                                                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    {query.assignedTo ? <ArrowPathIcon className="w-5 h-5" /> : <UserCircleIcon className="w-5 h-5" />}
                                                    {query.assignedTo ? 'Reassign' : 'Assign'}
                                                </button>
                                                <button
                                                    onClick={() => setActiveAction('resolve')}
                                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircleIcon className="w-5 h-5" />
                                                    Resolve
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
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

export default QueryDetailsModal;
