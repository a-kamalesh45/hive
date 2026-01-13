const Query = require('../models/Query');
const Member = require('../models/Member');

// Resolve a query (Head and Admin only)
const resolveQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        const { reply } = req.body;

        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        // If user is a Head, they can only resolve queries assigned to them
        if (req.user.role === 'Head') {
            if (!query.assignedTo || query.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only resolve queries assigned to you'
                });
            }
        }

        if (query.status === 'Resolved') {
            return res.status(400).json({
                success: false,
                message: 'Query is already resolved'
            });
        }

        query.status = 'Resolved';
        query.reply = reply || 'Query has been resolved';
        await query.save();

        // Update the assignee's stats if query was assigned
        if (query.assignedTo) {
            await Member.findByIdAndUpdate(query.assignedTo, {
                $inc: { queriesResolved: 1, queriesTaken: -1 }
            });
        }

        const updatedQuery = await Query.findById(queryId)
            .populate('askedBy', 'name email')
            .populate('assignedTo', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Query resolved successfully',
            query: updatedQuery
        });
    } catch (error) {
        console.error('Error resolving query:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resolve query',
            error: error.message
        });
    }
};

// Dismantle a query (Head and Admin only)
const dismantleQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        const { reason } = req.body;

        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        // If user is a Head, they can only dismantle queries assigned to them
        if (req.user.role === 'Head') {
            if (!query.assignedTo || query.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only dismantle queries assigned to you'
                });
            }
        }

        if (query.status === 'Dismantled') {
            return res.status(400).json({
                success: false,
                message: 'Query is already dismantled'
            });
        }

        query.status = 'Dismantled';
        query.reply = reason || 'Query has been dismantled';
        await query.save();

        // Update the assignee's stats if query was assigned
        if (query.assignedTo) {
            await Member.findByIdAndUpdate(query.assignedTo, {
                $inc: { queriesTaken: -1 }
            });
        }

        const updatedQuery = await Query.findById(queryId)
            .populate('askedBy', 'name email')
            .populate('assignedTo', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Query dismantled successfully',
            query: updatedQuery
        });
    } catch (error) {
        console.error('Error dismantling query:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to dismantle query',
            error: error.message
        });
    }
};

// Assign query to a head (Admin only)
const assignQuery = async (req, res) => {
    try {
        const { queryId } = req.params;
        const { headId } = req.body;

        if (!headId) {
            return res.status(400).json({
                success: false,
                message: 'Head ID is required'
            });
        }

        // Verify the head exists and has Head role
        const head = await Member.findById(headId);
        if (!head) {
            return res.status(404).json({
                success: false,
                message: 'Head not found'
            });
        }

        if (head.role !== 'Head' && head.role !== 'Admin') {
            return res.status(400).json({
                success: false,
                message: 'Selected user is not a Head or Admin'
            });
        }

        const query = await Query.findById(queryId);
        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'Query not found'
            });
        }

        if (query.status === 'Resolved' || query.status === 'Dismantled') {
            return res.status(400).json({
                success: false,
                message: `Cannot assign a ${query.status.toLowerCase()} query`
            });
        }

        // Update previous assignee's stats if reassigning
        if (query.assignedTo && query.assignedTo.toString() !== headId) {
            await Member.findByIdAndUpdate(query.assignedTo, {
                $inc: { queriesTaken: -1 }
            });
        }

        query.status = 'Assigned';
        query.assignedTo = headId;
        await query.save();

        // Update new assignee's stats
        await Member.findByIdAndUpdate(headId, {
            $inc: { queriesTaken: 1 }
        });

        const updatedQuery = await Query.findById(queryId)
            .populate('askedBy', 'name email')
            .populate('assignedTo', 'name email role');

        return res.status(200).json({
            success: true,
            message: 'Query assigned successfully',
            query: updatedQuery
        });
    } catch (error) {
        console.error('Error assigning query:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to assign query',
            error: error.message
        });
    }
};

// Get available heads (Admin only)
const getHeads = async (req, res) => {
    try {
        const heads = await Member.find({
            role: { $in: ['Head', 'Admin'] }
        }).select('name email role queriesTaken queriesResolved');

        return res.status(200).json({
            success: true,
            count: heads.length,
            heads
        });
    } catch (error) {
        console.error('Error fetching heads:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch heads',
            error: error.message
        });
    }
};

module.exports = {
    resolveQuery,
    dismantleQuery,
    assignQuery,
    getHeads
};
