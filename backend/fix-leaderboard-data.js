// Run this script to fix existing leaderboard data
// Usage: node fix-leaderboard-data.js

const mongoose = require('mongoose');
const Member = require('./models/Member');
const Query = require('./models/Query');
// require('dotenv').config();

const fixLeaderboardData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/query-management', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Get all Heads and Admins
        const heads = await Member.find({ role: { $in: ['Head', 'Admin'] } });
        console.log(`Found ${heads.length} heads/admins`);

        // For each head, count their resolved queries
        for (const head of heads) {
            const resolvedCount = await Query.countDocuments({
                assignedTo: head._id,
                status: 'Resolved'
            });

            const assignedCount = await Query.countDocuments({
                assignedTo: head._id,
                status: 'Assigned'
            });

            // Update the member's stats
            await Member.findByIdAndUpdate(head._id, {
                queriesResolved: resolvedCount,
                queriesTaken: assignedCount
            });

            console.log(`Updated ${head.name}: ${resolvedCount} resolved, ${assignedCount} assigned`);
        }

        console.log('\n✅ Leaderboard data fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing leaderboard data:', error);
        process.exit(1);
    }
};

fixLeaderboardData();
