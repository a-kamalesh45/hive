import {
    CheckBadgeIcon,
    ClipboardDocumentCheckIcon,
    ExclamationCircleIcon,
    XCircleIcon,
    ClockIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const StatusBadge = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'Resolved':
                return {
                    color: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                    label: 'Resolved'
                };
            case 'Assigned':
                return {
                    color: 'bg-amber-50 text-amber-700 border border-amber-200',
                    label: 'Assigned'
                };
            case 'Unassigned':
                return {
                    color: 'bg-gray-50 text-gray-600 border border-gray-300',
                    label: 'Unassigned'
                };
            case 'Dismantled':
                return {
                    color: 'bg-red-50 text-red-700 border border-red-200',
                    label: 'Dismantled'
                };
            default:
                return {
                    color: 'bg-gray-50 text-gray-600 border border-gray-200',
                    label: status
                };
        }
    };

    const config = getStatusConfig();

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium ${config.color}`}>

            {config.label}
        </span>
    );
};

export default StatusBadge;
