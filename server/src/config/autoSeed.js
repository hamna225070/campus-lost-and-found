const User = require('../models/User');
const { Item } = require('../models/Item');

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already initialized
    }

    console.log('[AutoSeed] Database is empty. Initializing demo accounts and sample items...');

    const admin = await User.create({
      name: 'Campus Administrator',
      email: 'admin@campus.edu',
      password: 'Admin@12345',
      role: 'admin',
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@campus.edu',
      password: 'Student@12345',
      role: 'student',
    });

    const sampleItems = [
      {
        title: 'Blue Leather Wallet',
        description: 'Dark blue leather wallet containing a student ID card, bus pass, and library card. Lost near the Central Library 2nd floor study area.',
        category: 'Wallets',
        type: 'lost',
        location: 'Central Library, 2nd Floor',
        dateOfIncident: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60',
        contactInfo: 'student@campus.edu | 555-0192',
        status: 'open',
        user: student._id,
      },
      {
        title: 'Scientific Calculator Casio fx-991EX',
        description: 'Black scientific calculator left on desk 14 in Engineering Block B Room 204 after the morning physics lecture.',
        category: 'Electronics',
        type: 'found',
        location: 'Engineering Block B, Room 204',
        dateOfIncident: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=60',
        contactInfo: 'admin@campus.edu or Security Office',
        status: 'open',
        user: admin._id,
      },
      {
        title: 'Campus Student ID Card - Dept of CS',
        description: 'Lost my official student ID card with blue lanyard near the main cafeteria during lunch hour.',
        category: 'ID Cards',
        type: 'lost',
        location: 'Main Cafeteria',
        dateOfIncident: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        imageUrl: '',
        contactInfo: '555-0144 or alex.j@campus.edu',
        status: 'open',
        user: student._id,
      },
      {
        title: 'Stainless Steel Water Bottle (Silver)',
        description: 'Found a silver HydroFlask style insulated bottle on the bench outside the sports complex.',
        category: 'Other',
        type: 'found',
        location: 'Sports Complex Main Entrance',
        dateOfIncident: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
        contactInfo: 'Lost & Found Desk Counter #2',
        status: 'resolved',
        user: admin._id,
      },
      {
        title: 'Black HP Laptop Charger (65W USB-C)',
        description: 'Left in Seminar Hall C under seat 12 during the robotics club meeting yesterday evening.',
        category: 'Electronics',
        type: 'lost',
        location: 'Seminar Hall C',
        dateOfIncident: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        imageUrl: '',
        contactInfo: 'alex.j@campus.edu',
        status: 'open',
        user: student._id,
      },
      {
        title: 'Set of 3 Dorm Keys with Brass Ring',
        description: 'Found bunch of keys on a blue brass ring near the West Gate bike stands.',
        category: 'Keys',
        type: 'found',
        location: 'West Gate Bicycle Parking',
        dateOfIncident: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        imageUrl: '',
        contactInfo: 'campus-security@campus.edu',
        status: 'open',
        user: admin._id,
      },
    ];

    await Item.insertMany(sampleItems);
    console.log('[AutoSeed] Demo data loaded successfully.');
    console.log('   Admin:   admin@campus.edu / Admin@12345');
    console.log('   Student: student@campus.edu / Student@12345');
  } catch (error) {
    console.warn('[AutoSeed] Warning: Auto-seed skipped:', error.message);
  }
};

module.exports = { autoSeedIfEmpty };
