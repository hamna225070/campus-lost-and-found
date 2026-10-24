const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const testConnection = async () => {
  const uri = process.env.MONGODB_URI;
  console.log(`[Test] Connecting to MongoDB Atlas...`);
  console.log(`[Test] Target URI: ${uri.replace(/:([^@]+)@/, ':****@')}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[SUCCESS] Connected to MongoDB Atlas!`);
    console.log(`[Details] Host: ${conn.connection.host}`);
    console.log(`[Details] Database Name: ${conn.connection.name}`);
    console.log(`[Details] ReadyState: ${conn.connection.readyState} (1 = connected)`);

    // Ping database
    const pingResult = await conn.connection.db.admin().ping();
    console.log(`[Details] Admin Ping:`, pingResult);

    await mongoose.disconnect();
    console.log(`[Test] Disconnected cleanly.`);
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Failed to connect to MongoDB Atlas:`);
    console.error(err.message);
    process.exit(1);
  }
};

testConnection();
