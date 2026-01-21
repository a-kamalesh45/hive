const Query = require('../models/Query');
const Member = require('../models/Member');
const { createTransporter, getResolutionEmailHTML } = require('../config/email');

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

        // PERMISSION CHECK:
        // - Head: Can only resolve queries assigned to them
        // - Admin: Can resolve any query (assigned or unassigned)
        if (req.user.role === 'Head') {
            const userId = req.user.id || req.user._id;
            if (!query.assignedTo || query.assignedTo.toString() !== userId.toString()) {
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

        if (query.status === 'Dismantled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot resolve a dismantled query'
            });
        }

        query.status = 'Resolved';
        query.reply = reply || 'Query has been resolved';
        await query.save();

        // STATS UPDATE - Resolution Ownership Rule:
        // - If admin resolves, credit admin (regardless of assignment)
        // - If head resolves their own query, credit head

        const resolverId = req.user.id || req.user._id; // Person who is resolving
        const wasAssigned = query.assignedTo;

        if (req.user.role === 'Admin') {
            // Admin resolves: credit admin, decrement assignee's queriesTaken if it was assigned
            await Member.findByIdAndUpdate(
                resolverId,
                { $inc: { queriesResolved: 1 } },
                { new: true }
            );

            if (wasAssigned) {
                // Decrement the assigned head's queriesTaken
                await Member.findByIdAndUpdate(
                    wasAssigned,
                    { $inc: { queriesTaken: -1 } },
                    { new: true }
                );
            }
        } else if (req.user.role === 'Head' && wasAssigned) {
            // Head resolves their own assigned query: credit head
            await Member.findByIdAndUpdate(
                resolverId,
                { $inc: { queriesResolved: 1, queriesTaken: -1 } },
                { new: true }
            );
        }

        const updatedQuery = await Query.findById(queryId)
            .populate('askedBy', 'name email role')
            .populate('assignedTo', 'name email role');

        // Send notification email to the participant who asked the query
        try {
            const resolverId = req.user.id || req.user._id;
            const resolver = await Member.findById(resolverId).select('name email');
            const resolverName = (resolver && resolver.name) ? resolver.name : 'HIVE Team';

            if (updatedQuery && updatedQuery.askedBy && updatedQuery.askedBy.email) {
                const transporter = createTransporter();
                const mailOptions = {
                    from: `"HIVE Query Management" <${process.env.EMAIL_USER}>`,
                    to: updatedQuery.askedBy.email,
                    subject: `Your query has been resolved - ${updatedQuery._id}`,
                    html: getResolutionEmailHTML(updatedQuery, resolverName)
                };

                transporter.sendMail(mailOptions).catch(err => {
                    console.error('Failed to send resolution email:', err && err.message ? err.message : err);
                });
            }
        } catch (emailErr) {
            console.error('Error while sending resolution email:', emailErr && emailErr.message ? emailErr.message : emailErr);
        }

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

        // PERMISSION CHECK:
        // - Head: Can only dismantle queries assigned to them
        // - Admin: Can dismantle any query (assigned or unassigned)
        if (req.user.role === 'Head') {
            const userId = req.user.id || req.user._id;
            if (!query.assignedTo || query.assignedTo.toString() !== userId.toString()) {
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

        if (query.status === 'Resolved') {
            return res.status(400).json({
                success: false,
                message: 'Cannot dismantle a resolved query'
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
            .populate('askedBy', 'name email role')
            .populate('assignedTo', 'name email role');

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

// Get available heads (all authenticated users)
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

// Get leaderboard (all authenticated users)
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Member.find({
            role: { $in: ['Head', 'Admin'] }
        })
            .select('name email role queriesResolved')
            .sort({ queriesResolved: -1 })
            .limit(10);

        console.log('Leaderboard raw data:', leaderboard.map(h => ({
            name: h.name,
            queriesResolved: h.queriesResolved
        })));

        // Add resolvedCount for frontend compatibility
        const formattedLeaderboard = leaderboard.map(head => ({
            _id: head._id,
            name: head.name,
            email: head.email,
            role: head.role,
            resolvedCount: head.queriesResolved || 0
        }));

        return res.status(200).json({
            success: true,
            count: formattedLeaderboard.length,
            leaderboard: formattedLeaderboard
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
};

module.exports = {
    resolveQuery,
    dismantleQuery,
    assignQuery,
    getHeads,
    getLeaderboard
};
