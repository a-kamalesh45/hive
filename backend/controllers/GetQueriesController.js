const Query = require('../models/Query');
const Member = require('../models/Member');

const getQueries = async (req, res) => {
    try {
        let filter = {};
        const userRole = req.user.role;
        const userId = req.user._id;

        // Filter queries based on user role
        if (userRole === 'User') {
            // Users see their own queries
            filter = { askedBy: userId };
        } else if (userRole === 'Head') {
            // Heads see their assigned queries
            filter = { assignedTo: userId };
        }
        // Admin sees all queries (no filter)

        const queries = await Query.find(filter)
            .populate('askedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            count: queries.length,
            queries
        });
    } catch (error) {
        console.error('Error fetching queries:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch queries',
            error: error.message
        });
    }
};

const getQueryStats = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        let filter = {};

        // Apply role-based filtering to stats as well
        if (userRole === 'User') {
            filter = { askedBy: userId };
        } else if (userRole === 'Head') {
            filter = { assignedTo: userId };
        }
        // Admin sees all queries (no filter)

        const totalQueries = await Query.countDocuments(filter);
        const resolvedQueries = await Query.countDocuments({ ...filter, status: 'Resolved' });
        const assignedQueries = await Query.countDocuments({ ...filter, status: 'Assigned' });
        const unassignedQueries = await Query.countDocuments({ ...filter, status: 'Unassigned' });
        const dismantledQueries = await Query.countDocuments({ ...filter, status: 'Dismantled' });
        const pendingQueries = assignedQueries + unassignedQueries;

        return res.status(200).json({
            success: true,
            stats: {
                total: totalQueries,
                resolved: resolvedQueries,
                assigned: assignedQueries,
                unassigned: unassignedQueries,
                dismantled: dismantledQueries,
                pending: pendingQueries
            }
        });
    } catch (error) {
        console.error('Error fetching query stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch query statistics',
            error: error.message
        });
    }
};

module.exports = { getQueries, getQueryStats };
