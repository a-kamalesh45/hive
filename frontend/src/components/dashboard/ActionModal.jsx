import { XMarkIcon, CheckBadgeIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const ActionModal = ({
    modalType,
    selectedQuery,
    formData,
    setFormData,
    heads,
    actionLoading,
    onClose,
    onAction
}) => {
    if (!modalType || !selectedQuery) return null;

    const getModalConfig = () => {
        switch (modalType) {
            case 'resolve':
                return {
                    title: 'Resolve Query',
                    icon: CheckBadgeIcon,
                    iconBg: 'bg-emerald-600',
                    buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
                    buttonText: 'Resolve Query'
                };
            case 'dismantle':
                return {
                    title: 'Dismantle Query',
                    icon: XCircleIcon,
                    iconBg: 'bg-red-600',
                    buttonColor: 'bg-red-600 hover:bg-red-700',
                    buttonText: 'Dismantle Query'
                };
            case 'assign':
                return {
                    title: 'Assign Query',
                    icon: UserCircleIcon,
                    iconBg: 'bg-gray-900',
                    buttonColor: 'bg-gray-900 hover:bg-gray-800',
                    buttonText: 'Assign Query'
                };
            default:
                return {};
        }
    };

    const config = getModalConfig();
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
                {/* Modal Header */}
                <div className="relative bg-white px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    {/* Query Details Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Query ID</p>
                                <p className="font-mono text-sm text-gray-900">{selectedQuery._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Issue</p>
                                <p className="text-sm text-gray-900">{selectedQuery.issue}</p>
                            </div>
                            {selectedQuery.askedBy && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Submitted By</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-700 text-xs font-medium">
                                                {selectedQuery.askedBy.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-900">{selectedQuery.askedBy.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action-specific inputs */}
                    {modalType === 'resolve' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Resolution Reply *
                            </label>
                            <textarea
                                value={formData.reply}
                                onChange={(e) => setFormData({ ...formData, reply: e.target.value })}
                                placeholder="Provide details about the resolution..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all text-gray-900"
                                rows="4"
                            />
                        </div>
                    )}

                    {modalType === 'dismantle' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Reason for Dismantling *
                            </label>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Explain why this query is being dismantled..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none transition-all text-gray-900"
                                rows="4"
                            />
                        </div>
                    )}

                    {modalType === 'assign' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Select Team Head *
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {heads.map((head) => (
                                    <label
                                        key={head._id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${formData.headId === head._id
                                            ? 'border-gray-900 bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="head"
                                            value={head._id}
                                            checked={formData.headId === head._id}
                                            onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
                                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-700 text-sm font-medium">
                                                        {head.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{head.name}</p>
                                                    <p className="text-xs text-gray-600">{head.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600">
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
                <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={actionLoading}
                        className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAction}
                        disabled={actionLoading || (modalType === 'assign' && !formData.headId)}
                        className={`px-4 py-2 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
                    >
                        {actionLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : (
                            config.buttonText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
