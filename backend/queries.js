const bcrypt = require('bcrypt'); // If you use hashing, otherwise remove
// For dummy data, I'm using plain text or a fake hash string

const dummyUsers = [
  // --- ADMINS & HEADS (Who resolve queries) ---
  {
    name: "Sarah Conner",
    email: "head@fest.com",
    password: "$2b$10$FakeHashForDummyData123", // hash of 'admin123'
    role: "Head",
    queriesTaken: 15,
    queriesResolved: 12
  },
  {
    name: "Tech Lead",
    email: "admin.tech@fest.com",
    password: "$2b$10$FakeHashForDummyData123",
    role: "Admin",
    queriesTaken: 5,
    queriesResolved: 2
  },
  {
    name: "Logistics Coord",
    email: "admin.logistics@fest.com",
    password: "$2b$10$FakeHashForDummyData123",
    role: "Admin",
    queriesTaken: 8,
    queriesResolved: 8
  },
  
  // --- REGULAR USERS (Who ask queries) ---
  { name: "Rahul Sharma", email: "rahul@student.com", password: "password", role: "User" },
  { name: "Priya Patel", email: "priya@student.com", password: "password", role: "User" },
  { name: "Amit Verma", email: "amit@student.com", password: "password", role: "User" },
  { name: "Sneha Gupta", email: "sneha@student.com", password: "password", role: "User" },
  { name: "John Doe", email: "john@student.com", password: "password", role: "User" },
  { name: "Riya Singh", email: "riya@student.com", password: "password", role: "User" },
  { name: "Vikram Malhotra", email: "vikram@student.com", password: "password", role: "User" },
  { name: "Ananya Roy", email: "ananya@student.com", password: "password", role: "User" },
  { name: "Karthik R", email: "karthik@student.com", password: "password", role: "User" },
  { name: "Simran Kaur", email: "simran@student.com", password: "password", role: "User" }
];

module.exports = dummyUsers;