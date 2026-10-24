const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const { Item } = require('../models/Item');

const seedAdmin = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
    const adminEmail = (process.env.ADMIN_EMAIL || args[0] || 'admin@campus.edu').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || args[1] || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || args[2] || 'Campus Administrator';

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.role = 'admin';
      user.name = adminName;
      user.password = adminPassword; // Pre-save hook will hash this
      await user.save();
      console.log(`[Seed] Successfully promoted existing user "${adminEmail}" to admin role!`);
    } else {
      user = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`[Seed] Successfully created new administrator account for "${adminEmail}"!`);
    }

    // Check if sample data is requested or database is empty
    const shouldSeedSamples = process.argv.includes('--with-sample-data');
    if (shouldSeedSamples) {
      console.log('[Seed] Seeding sample lost and found items...');

      // Also create a demo student account
      let student = await User.findOne({ email: 'student@campus.edu' });
      if (!student) {
        student = await User.create({
          name: 'Alex Johnson',
          email: 'student@campus.edu',
          password: 'Student@12345',
          role: 'student',
        });
        console.log('[Seed] Created demo student: student@campus.edu / Student@12345');
      }

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
          contactInfo: 'admin@campus.edu or Campus Security Office',
          status: 'open',
          user: user._id,
        },
        {
          title: 'Campus Student ID Card - Dept of CS',
          description: 'Lost my official student ID card with lanyard near the main cafeteria during lunch hour.',
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
          contactInfo: 'Contact Lost & Found Helpdesk Counter #2',
          status: 'resolved',
          user: user._id,
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
          title: 'Set of 3 Dorm Keys with Brass Keychain',
          description: 'Found bunch of keys on a blue brass ring near the West Gate bike stands.',
          category: 'Keys',
          type: 'found',
          location: 'West Gate Bicycle Parking',
          dateOfIncident: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          imageUrl: '',
          contactInfo: 'campus-security@campus.edu',
          status: 'open',
          user: user._id,
        },
      ];

      await Item.deleteMany({});
      await Item.insertMany(sampleItems);
      console.log(`[Seed] Inserted ${sampleItems.length} sample reports successfully!`);
    }

    console.log('\n--- Admin Account Ready ---');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin`);
    console.log('---------------------------\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
