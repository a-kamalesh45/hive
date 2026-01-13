const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // Agar password hashing use kar rahe ho to
const Member = require('./models/Member');   // Apne User model ka path check karlena
const Query = require('./models/Query'); // Apne Query model ka path check karlena
MONGO_URL = 'mongodb+srv://kamaleshacharya:HWjBaNMII8NUpNsN@kamalesh.6ib85h8.mongodb.net/?retryWrites=true&w=majority&appName=Kamalesh'
// --- 1. USERS DATA (Based on your list) ---
// Kuch ko 'Head'/'Admin' banaya hai taaki queries resolve ho sakein, baaki sab 'User'.
const dummyUsers = [
  // --- ADMINS / HEADS ---
  { name: "Vipin", email: "vipin@fest.com", role: "Head", password: "hash" },
  { name: "Ved", email: "ved@fest.com", role: "User", password: "hash" },
  { name: "Nishita", email: "nishita@fest.com", role: "User", password: "hash" },
  { name: "Pratik", email: "pratik@student.com", role: "User", password: "hash" },
  { name: "Vedant", email: "vedant@student.com", role: "User", password: "hash" },
  { name: "Aanya", email: "aanya@student.com", role: "User", password: "hash" },
  { name: "Anushka", email: "anushka@student.com", role: "User", password: "hash" },
  { name: "Sachin", email: "sachin@student.com", role: "User", password: "hash" },
  { name: "Aadi", email: "aadi@student.com", role: "User", password: "hash" },
  { name: "Abhinav", email: "abhinav@student.com", role: "User", password: "hash" },
  { name: "Ishan", email: "ishan@student.com", role: "User", password: "hash" },
  { name: "Srajan", email: "srajan@student.com", role: "User", password: "hash" },
  { name: "Ashutosh", email: "ashutosh@student.com", role: "User", password: "hash" },
  { name: "Soham", email: "soham@student.com", role: "User", password: "hash" },
  { name: "Ayush", email: "ayush@student.com", role: "User", password: "hash" }
];

// --- 2. QUERIES DATA (50+ Items) ---
// Note: 'askedBy' aur 'assignedTo' hum niche code mein dynamically fill karenge.
const rawQueries = [
  // --- URGENT / PAYMENT ISSUES ---
  { issue: "Payment deduced but status shows 'Pending' for Hackathon 2026.", status: 'Unassigned' },
  { issue: "I paid twice for the EDM night pass. I need a refund ASAP.", status: 'Unassigned' },
  { issue: "Razorpay gateway crashed at the OTP screen.", status: 'Unassigned' },
  { issue: "Is UPI accepted at the food stalls or only cash?", status: 'Unassigned' },
  { issue: "My transaction ID is TXN12345678 but ticket isn't generated.", status: 'Unassigned' },
  { issue: "Can I pay on spot for the workshop registration?", status: 'Unassigned' },
  { issue: "Group discount coupon 'FEST20' isn't applying on checkout.", status: 'Unassigned' },
  { issue: "I got a receipt for the wrong event.", status: 'Unassigned' },

  // --- TECHNICAL BUGS ---
  { issue: "Login button doesn't work on Safari browser.", status: 'Unassigned' },
  { issue: "The 'My Events' page is throwing a 404 error.", status: 'Unassigned' },
  { issue: "I can't upload my abstract PDF. Size limit is too small.", status: 'Unassigned' },
  { issue: "Forgot Password email is taking 2 hours to arrive.", status: 'Unassigned' },
  { issue: "The countdown timer on the homepage is stuck at 00:00:00.", status: 'Unassigned' },
  { issue: "CSS is broken on mobile view for the gallery page.", status: 'Unassigned' },
  { issue: "Profile picture upload fails with 'Server Error'.", status: 'Unassigned' },

  // --- EVENT LOGISTICS ---
  { issue: "What is the reporting time for the Robotics competition?", status: 'Unassigned' },
  { issue: "Do we need to bring our own laptops for the AI workshop?", status: 'Unassigned' },
  { issue: "Is the debating competition in the Main Building or the Library?", status: 'Unassigned' },
  { issue: "Can I participate in both Battle of Bands and Dance Off? They overlap.", status: 'Unassigned' },
  { issue: "Are parents allowed to watch the fashion show?", status: 'Unassigned' },
  { issue: "Will there be participation certificates for non-winners?", status: 'Unassigned' },
  { issue: "Is there a cloakroom to keep our bags?", status: 'Unassigned' },
  { issue: "Can I edit my team name after registration?", status: 'Unassigned' },
  { issue: "Is the guest lecture by Dr. Sivan confirmed?", status: 'Unassigned' },

  // --- ACCOMMODATION & TRAVEL ---
  { issue: "I'm coming from Delhi. Is accommodation provided in hostels?", status: 'Unassigned' },
  { issue: "How far is the campus from the railway station?", status: 'Unassigned' },
  { issue: "Are boys allowed in the girls' hostel waiting area for team meetings?", status: 'Unassigned' },
  { issue: "Do you provide bedding or should we bring sleeping bags?", status: 'Unassigned' },
  { issue: "Is there a bus service from the city center?", status: 'Unassigned' },
  { issue: "What are the hostel gate closing timings?", status: 'Unassigned' },

  // --- SPAM / DISMANTLED ---
  { issue: "Your website looks like it was made in 1990.", status: 'Dismantled', reply: "Constructive criticism only." },
  { issue: "Can you introduce me to the Cultural Secretary? ;)", status: 'Dismantled', reply: "Official queries only." },
  { issue: "Selling cheap Ray-Bans. Click here!", status: 'Dismantled', reply: "User banned." },
  { issue: "Test query 123", status: 'Dismantled', reply: "Testing complete." },
  { issue: "hello???? anyone there?", status: 'Unassigned' },

  // --- RESOLVED ---
  { issue: "Where is the registration desk?", status: 'Resolved', reply: "Main entrance, left side." },
  { issue: "What is the dress code for the gala?", status: 'Resolved', reply: "Formal wear." },
  { issue: "Is the hackathon 24 hours or 48 hours?", status: 'Resolved', reply: "36 hours this year." },
  { issue: "Can I bring outside food?", status: 'Resolved', reply: "No, food court is available inside." },
  { issue: "Are pets allowed?", status: 'Resolved', reply: "No pets allowed on campus." },
  { issue: "Do I need a physical ticket?", status: 'Resolved', reply: "Digital QR code is sufficient." },
  { issue: "Is alcohol allowed?", status: 'Resolved', reply: "Strictly prohibited." },

  // --- ASSIGNED / IN PROGRESS ---
  { issue: "My name is misspelled on the ID card generated.", status: 'Assigned', reply: "We are regenerating it. Collect from desk." },
  { issue: "Refund for cancelled event 'Sky Watching'.", status: 'Assigned', reply: "Processing with accounts team." },
  { issue: "Unable to join the Discord server.", status: 'Assigned', reply: "Refreshing the invite link." },
  { issue: "Website footer overlapping content.", status: 'Assigned', reply: "Dev team is on it." },
  { issue: "Need extra table for hardware exhibition.", status: 'Assigned', reply: "Checking inventory." },

  // --- FILLERS (To reach 50+) ---
  { issue: "Schedule clash between Quiz and Debate.", status: 'Unassigned' },
  { issue: "Can I volunteer for the organizing team?", status: 'Unassigned' },
  { issue: "Sponsor looking for contact details.", status: 'Unassigned' },
  { issue: "Press pass requirements?", status: 'Unassigned' },
  { issue: "Is there an ATM inside the campus?", status: 'Unassigned' },
  { issue: "Emergency contact number?", status: 'Unassigned' },
  { issue: "App crashing on Android 12.", status: 'Unassigned' },
  { issue: "Typo in event brochure page 3.", status: 'Unassigned' },
  { issue: "Sound system feedback in Hall 2.", status: 'Unassigned' },
  { issue: "Mic not working for announcer.", status: 'Unassigned' },
  { issue: "Lighting too dim in art gallery.", status: 'Unassigned' },
  { issue: "Fan broken in room 304.", status: 'Unassigned' },
  { issue: "Water leakage in washroom block B.", status: 'Unassigned' },
  { issue: "Projector flickering in the Seminar Hall.", status: 'Unassigned' }
];


const seedDB = async () => {
  try {
    // DB Connection URL - yahan apna sahi URL daalna
    await mongoose.connect(MONGO_URL);
    console.log("🔥 Connected to DB.");
    // 1. Clear Old Data
    await Member.deleteMany({});
    await Query.deleteMany({});
    console.log("🧹 Old data cleared.");

    // 2. Insert Users
    // Password hash manually kar rahe ho ya pre-save hook hai, wo check kar lena.
    // Yahan simple text daal rahe hain demo ke liye.
    const createdUsers = await Member.insertMany(dummyUsers);
    console.log(`✅ Created ${createdUsers.length} users.`);

    // Users ko separate karte hain roles ke hisaab se
    const admins = createdUsers.filter(u => u.role === 'Head' || u.role === 'Admin');
    const students = createdUsers.filter(u => u.role === 'User');

    if (admins.length === 0 || students.length === 0) {
      throw new Error("Admins or Students missing! Check role assignments.");
    }

    // 3. Link Queries to Users
    const finalQueries = rawQueries.map(q => {
      // Har query ke liye ek random Student pick karo jo 'askedBy' banega
      const randomStudent = students[Math.floor(Math.random() * students.length)];

      let assignedTo = null;

      // Agar query Unassigned nahi hai (Resolved/Assigned etc.), to kisi Admin ko assign karo
      if (q.status !== 'Unassigned') {
        const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
        assignedTo = randomAdmin._id;
      }

      return {
        ...q,
        askedBy: randomStudent._id, // Real MongoDB ID link ho gaya
        assignedTo: assignedTo      // Real MongoDB ID link ho gaya
      };
    });

    // 4. Insert Queries
    await Query.insertMany(finalQueries);
    console.log(`✅ Seeded ${finalQueries.length} linked queries.`);

    mongoose.connection.close();
    console.log("👋 Connection closed.");

  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    mongoose.connection.close();
  }
};

seedDB();