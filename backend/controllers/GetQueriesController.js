const Query = require('../models/Query');
const Member = require('../models/Member');

const getQueries = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id || req.user._id; // JWT uses 'id', not '_id'

        console.log(`[getQueries] Fetching queries for role: ${userRole}, userId: ${userId}`);

        // ALL ROLES SEE ALL QUERIES - No filtering
        // Differences are in sorting order and allowed actions (handled on frontend/action controllers)
        const queries = await Query.find({})
            .populate('askedBy', 'name email role')
            .populate('assignedTo', 'name email role')
            .lean(); // Use lean() for better performance since we're not modifying documents

        console.log(`[getQueries] Found ${queries.length} queries`);

        // Role-based sorting
        let sortedQueries;

        if (userRole === 'User') {
            // Participant Ordering: Resolved > Dismantled > Assigned > Unassigned
            const statusOrder = { 'Resolved': 1, 'Dismantled': 2, 'Assigned': 3, 'Unassigned': 4 };
            sortedQueries = queries.sort((a, b) => {
                const orderA = statusOrder[a.status] || 999;
                const orderB = statusOrder[b.status] || 999;
                if (orderA !== orderB) return orderA - orderB;
                return new Date(b.createdAt) - new Date(a.createdAt); // Secondary: newest first
            });
        } else if (userRole === 'Head') {
            // Head Ordering: Assigned to me > Resolved > Dismantled > Assigned (to others) > Unassigned
            sortedQueries = queries.sort((a, b) => {
                // Safely get assignedTo ID - with .lean() populated docs are plain objects
                let aAssignedId = null;
                let bAssignedId = null;

                if (a.assignedTo) {
                    aAssignedId = typeof a.assignedTo === 'object' && a.assignedTo._id
                        ? a.assignedTo._id.toString()
                        : a.assignedTo.toString();
                }

                if (b.assignedTo) {
                    bAssignedId = typeof b.assignedTo === 'object' && b.assignedTo._id
                        ? b.assignedTo._id.toString()
                        : b.assignedTo.toString();
                }

                const userIdStr = userId.toString();

                const aAssignedToMe = aAssignedId === userIdStr && a.status === 'Assigned';
                const bAssignedToMe = bAssignedId === userIdStr && b.status === 'Assigned';

                // Prioritize queries assigned to me first
                if (aAssignedToMe && !bAssignedToMe) return -1;
                if (!aAssignedToMe && bAssignedToMe) return 1;

                // For remaining queries: Resolved > Dismantled > Assigned (to others) > Unassigned
                const statusOrder = { 'Resolved': 1, 'Dismantled': 2, 'Assigned': 3, 'Unassigned': 4 };
                const orderA = statusOrder[a.status] || 999;
                const orderB = statusOrder[b.status] || 999;
                if (orderA !== orderB) return orderA - orderB;

                return new Date(b.createdAt) - new Date(a.createdAt); // Secondary: newest first
            });
        } else if (userRole === 'Admin') {
            // Admin Ordering: Unassigned > Assigned > Resolved > Dismantled
            const statusOrder = { 'Unassigned': 1, 'Assigned': 2, 'Resolved': 3, 'Dismantled': 4 };
            sortedQueries = queries.sort((a, b) => {
                const orderA = statusOrder[a.status] || 999;
                const orderB = statusOrder[b.status] || 999;
                if (orderA !== orderB) return orderA - orderB;
                return new Date(b.createdAt) - new Date(a.createdAt); // Secondary: newest first
            });
        } else {
            // Fallback for unknown roles
            sortedQueries = queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        console.log(`[getQueries] Sorted ${sortedQueries.length} queries for ${userRole}`);

        return res.status(200).json({
            success: true,
            count: sortedQueries.length,
            queries: sortedQueries
        });
    } catch (error) {
        console.error('[getQueries] Error fetching queries:', error);
        console.error('[getQueries] Error stack:', error.stack);
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
        const userId = req.user.id || req.user._id; // JWT uses 'id', not '_id'

        // ALL ROLES SEE THE SAME STATS - Stats are calculated from all queries
        const totalQueries = await Query.countDocuments({});
        const resolvedQueries = await Query.countDocuments({ status: 'Resolved' });
        const assignedQueries = await Query.countDocuments({ status: 'Assigned' });
        const unassignedQueries = await Query.countDocuments({ status: 'Unassigned' });
        const dismantledQueries = await Query.countDocuments({ status: 'Dismantled' });
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
