// const mongoose = require('mongoose');
// const Member = require('./models/Member');
// require('dotenv').config();

// async function checkHeads() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('✅ Connected to MongoDB');

//         // Find all Head users
//         const heads = await Member.find({ role: 'Head' });
//         console.log(`\n📊 Found ${heads.length} Head users:\n`);
        
//         if (heads.length === 0) {
//             console.log('⚠️  No Head users found in database!');
//         } else {
//             heads.forEach((head, index) => {
//                 console.log(`${index + 1}. Name: ${head.name}`);
//                 console.log(`   Email: ${head.email}`);
//                 console.log(`   Role: ${head.role}`);
//                 console.log(`   Queries Taken: ${head.queriesTaken}`);
//                 console.log(`   Queries Resolved: ${head.queriesResolved}`);
//                 console.log(`   Has PIN: ${head.pin ? 'Yes' : 'No'}`);
//                 console.log(`   Created: ${head.createdAt}\n`);
//             });
//         }

//         // Also check all users
//         const allUsers = await Member.find({});
//         console.log(`\n📋 Total users in database: ${allUsers.length}`);
//         console.log(`   - Admins: ${allUsers.filter(u => u.role === 'Admin').length}`);
//         console.log(`   - Heads: ${allUsers.filter(u => u.role === 'Head').length}`);
//         console.log(`   - Users: ${allUsers.filter(u => u.role === 'User').length}`);

//         await mongoose.disconnect();
//         console.log('\n✅ Disconnected from MongoDB');
//     } catch (error) {
//         console.error('❌ Error:', error);
//         process.exit(1);
//     }
// }

// checkHeads();
