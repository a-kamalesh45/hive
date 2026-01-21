const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Member = require('./models/Member');
const Query = require('./models/Query');
const MONGO_URL = 'mongodb+srv://kamaleshacharya:HWjBaNMII8NUpNsN@kamalesh.6ib85h8.mongodb.net/?retryWrites=true&w=majority&appName=Kamalesh'
// --- 1. USERS DATA (All participants with User role) ---
const dummyUsers = [
  { name: "Kamalesh", email: "kamalesh@fest.com", role: "Admin", password: "123123" },
  { name: "Vipin", email: "vipin@fest.com", role: "User", password: "vvvvvv" },
  { name: "Ved", email: "ved@fest.com", role: "User", password: "vvvvvv" },
  { name: "Nishita", email: "nishita@fest.com", role: "User", password: "nnnnnn" },
  { name: "Pratik", email: "pratik@fest.com", role: "User", password: "pppppp" },
  { name: "Vedant", email: "vedant@fest.com", role: "User", password: "vvvvvv" },
  { name: "Aanya", email: "aanya@fest.com", role: "User", password: "aaaaaa" },
  { name: "Anushka", email: "anushka@fest.com", role: "User", password: "aaaaaa" },
  { name: "Sachin", email: "sachin@fest.com", role: "User", password: "ssssss" },
  { name: "Aadi", email: "aadi@fest.com", role: "User", password: "aaaaaa" },
  { name: "Abhinav", email: "abhinav@fest.com", role: "User", password: "aaaaaa" },
  { name: "Ishan", email: "ishan@fest.com", role: "User", password: "iiiiii" },
  { name: "Srajan", email: "srajan@fest.com", role: "User", password: "ssssss" },
  { name: "Ashutosh", email: "ashutosh@fest.com", role: "User", password: "aaaaaa" },
  { name: "Soham", email: "soham@fest.com", role: "User", password: "ssssss" },
  { name: "Ayush", email: "ayush@fest.com", role: "User", password: "aaaaaa" }
];

// --- 2. QUERIES DATA (Mix of Unassigned, Resolved, and Dismantled) ---
const rawQueries = [
  // --- UNASSIGNED QUERIES (Waiting for assignment) ---
  { issue: "Payment deducted but registration status shows 'Pending' for TechFest 2026.", status: 'Unassigned' },
  { issue: "I paid twice for the concert pass. Need refund for transaction ID: TXN987654.", status: 'Unassigned' },
  { issue: "UPI payment failed at the last step but money was debited from my account.", status: 'Unassigned' },
  { issue: "Group discount code 'FEST2026' is not applying at checkout. Please help!", status: 'Unassigned' },
  { issue: "Can I get an invoice for my workshop registration? Need it for reimbursement.", status: 'Unassigned' },

  { issue: "Login button not working on Safari browser. Stuck on loading screen.", status: 'Unassigned' },
  { issue: "The event schedule PDF download link is broken. Returns 404 error.", status: 'Unassigned' },
  { issue: "Cannot upload team logo. File size limit of 500KB is too small.", status: 'Unassigned' },
  { issue: "Forgot password email takes 2+ hours to arrive. Need faster solution.", status: 'Unassigned' },
  { issue: "Mobile app crashes when trying to view the venue map on Android 13.", status: 'Unassigned' },
  { issue: "My registered email ID has a typo. How can I update it before the event?", status: 'Unassigned' },

  { issue: "What is the exact reporting time for the Robotics Workshop on Day 2?", status: 'Unassigned' },
  { issue: "Is the debating competition happening in Main Building or Library Block?", status: 'Unassigned' },
  { issue: "Do we need to bring our own laptops for the AI/ML workshop?", status: 'Unassigned' },
  { issue: "Can one person participate in both Hackathon and Battle of Bands? They overlap.", status: 'Unassigned' },
  { issue: "Are outside guests (parents/friends) allowed to attend the cultural night?", status: 'Unassigned' },
  { issue: "Will participation certificates be given to all participants or only winners?", status: 'Unassigned' },
  { issue: "Is there a cloakroom facility to keep bags during events?", status: 'Unassigned' },
  { issue: "Can we change our team name after final registration deadline?", status: 'Unassigned' },
  { issue: "What's the dress code for the inauguration ceremony and gala dinner?", status: 'Unassigned' },

  { issue: "I'm traveling from Mumbai. Is hostel accommodation provided for outstation students?", status: 'Unassigned' },
  { issue: "How far is the campus from the nearest railway station? Any shuttle service?", status: 'Unassigned' },
  { issue: "Do we need to bring our own bedding or is it provided in hostels?", status: 'Unassigned' },
  { issue: "What are the hostel gate timings? Any restrictions for late-night events?", status: 'Unassigned' },
  { issue: "Is there parking available on campus for people coming by car?", status: 'Unassigned' },

  { issue: "My team member's name is misspelled on the ID card. How to get it corrected?", status: 'Unassigned' },
  { issue: "Is there an ATM or cash withdrawal facility available on campus?", status: 'Unassigned' },
  { issue: "Can we bring our own food, or are only campus food stalls allowed?", status: 'Unassigned' },
  { issue: "What's the emergency contact number for medical assistance during the fest?", status: 'Unassigned' },
  { issue: "Is photography allowed during performances? Any specific zones for photographers?", status: 'Unassigned' },
  { issue: "Can I volunteer for the organizing committee? How to apply?", status: 'Unassigned' },

  // --- RESOLVED QUERIES (Successfully answered) ---
  { issue: "Where exactly is the main registration desk located?", status: 'Resolved', reply: "Main entrance, left side near the information kiosk. Open from 8 AM to 8 PM." },
  { issue: "Is the hackathon 24 hours or 48 hours this year?", status: 'Resolved', reply: "It's a 36-hour hackathon this year, starting Friday 6 PM till Sunday 6 AM." },
  { issue: "Do I need a physical ticket or is digital QR code enough?", status: 'Resolved', reply: "Digital QR code on your phone is sufficient. No need for physical tickets." },
  { issue: "Are pets allowed on campus during the festival?", status: 'Resolved', reply: "No, pets are not allowed on campus during the event for safety reasons." },
  { issue: "What payment methods are accepted at food stalls?", status: 'Resolved', reply: "UPI, cards, and cash - all payment methods are accepted at food stalls." },
  { issue: "Is there WiFi available for participants during the event?", status: 'Resolved', reply: "Yes, guest WiFi network 'TechFest_Guest' is available. Password will be shared on Day 1." },
  { issue: "Can we submit our hackathon project in Python or only Java/C++?", status: 'Resolved', reply: "Any programming language is allowed. Focus is on solving the problem statement." },
  { issue: "Is the guest lecture by Dr. APJ Abdul Kalam Scholar confirmed?", status: 'Resolved', reply: "Yes, confirmed for Day 2 at 3 PM in the Main Auditorium. Open seating." },
  { issue: "What's the prize money for the coding competition winners?", status: 'Resolved', reply: "1st: ₹50,000, 2nd: ₹30,000, 3rd: ₹20,000. Consolation prizes for top 10." },
  { issue: "Are there charging points available in the hackathon venue?", status: 'Resolved', reply: "Yes, multiple charging stations are set up. Bring your own cables and adapters." },
  { issue: "Can international students participate in the fest?", status: 'Resolved', reply: "Absolutely! International students are welcome. Register with your passport details." },
  { issue: "What time does the cultural night start and end?", status: 'Resolved', reply: "Cultural night starts at 6 PM and concludes by 11 PM as per college regulations." },
  { issue: "Is there a student discount for workshop registrations?", status: 'Resolved', reply: "Yes, use code 'STUDENT2026' for 20% off on all workshop registrations." },
  { issue: "Will food be provided during the overnight hackathon?", status: 'Resolved', reply: "Yes, dinner, midnight snacks, breakfast, and refreshments will be provided." },
  { issue: "Is first aid or medical assistance available on campus?", status: 'Resolved', reply: "Yes, medical room is in Block C, Ground Floor. Ambulance on standby 24/7." },

  // --- DISMANTLED QUERIES (Spam/Inappropriate/Duplicates) ---
  { issue: "Your website design looks outdated. Did you make it in MS Paint?", status: 'Dismantled', reply: "Please provide constructive feedback through the official feedback form." },
  { issue: "Can you share the phone number of the Cultural Secretary? Need to talk personally.", status: 'Dismantled', reply: "For official queries only. Use the contact form on the website." },
  { issue: "Selling branded watches at 90% discount! Limited stock! Click here NOW!", status: 'Dismantled', reply: "Commercial spam. User has been reported and blocked." },
  { issue: "test test 123 checking if this works lol", status: 'Dismantled', reply: "Test query removed. Please use the system for genuine queries only." },
  { issue: "hello???? is anyone even monitoring this????", status: 'Dismantled', reply: "Query resolved. Our team monitors 24/7 during the registration period." },
  { issue: "Why is this fest even happening? Waste of money and time honestly.", status: 'Dismantled', reply: "Feedback noted. Inappropriate tone. Dismissed." },
  { issue: "URGENT URGENT URGENT HELP ME NOW IMMEDIATE RESPONSE NEEDED!!!", status: 'Dismantled', reply: "Duplicate query. Already addressed in ticket #2847." },
  { issue: "Can you give me free passes for my entire family? We are VIPs.", status: 'Dismantled', reply: "All registrations must follow standard procedure. No exceptions." }
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

    // 2. Hash passwords and insert Users
    const usersWithHashedPasswords = await Promise.all(dummyUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10)
    })));

    const createdUsers = await Member.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users (all participants, passwords hashed).`);

    // 3. Link Queries to Users (no assignment since no heads/admins yet)
    const finalQueries = rawQueries.map(q => {
      // Random participant who asked the query
      const randomStudent = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      return {
        ...q,
        askedBy: randomStudent._id,
        assignedTo: null // No assignments yet - you'll add heads manually
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