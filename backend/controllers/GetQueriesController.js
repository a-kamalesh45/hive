const Query = require('../models/Query');
const Member = require('../models/Member');

const getQueries = async (req, res) => {
    try {
        const queries = await Query.find()
            .populate('askedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })
            .limit(50);

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
        const totalQueries = await Query.countDocuments();
        const resolvedQueries = await Query.countDocuments({ status: 'Resolved' });
        const assignedQueries = await Query.countDocuments({ status: 'Assigned' });
        const unassignedQueries = await Query.countDocuments({ status: 'Unassigned' });
        const dismantledQueries = await Query.countDocuments({ status: 'Dismantled' });

        return res.status(200).json({
            success: true,
            stats: {
                total: totalQueries,
                resolved: resolvedQueries,
                assigned: assignedQueries,
                unassigned: unassignedQueries,
                dismantled: dismantledQueries,
                pending: assignedQueries + unassignedQueries
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
