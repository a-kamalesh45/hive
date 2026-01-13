const QUERY = require('../models/Query');
const MEMBER = require('../models/Member');

async function newQuery(req, res) {
    try {
        const { issue, askedBy } = req.body;

        // Validation
        if (!issue || !askedBy) {
            return res.status(400).json({
                message: 'Issue description and user ID are required'
            });
        }

        // Verify user exists
        const user = await MEMBER.findById(askedBy);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const newQuery = new QUERY({
            issue,
            askedBy,
            status: 'Unassigned'
        });

        const savedQuery = await newQuery.save();

        res.status(201).json({
            message: 'Query added successfully',
            query: {
                id: savedQuery._id,
                issue: savedQuery.issue,
                status: savedQuery.status,
                createdAt: savedQuery.createdAt
            }
        });
    } catch (err) {
        console.error('Error adding query:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

module.exports = { newQuery };