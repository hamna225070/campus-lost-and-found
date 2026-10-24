const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_lost_found';

  try {
    // Attempt standard MongoDB connection with a 10s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[MongoDB] Primary connection to "${uri}" failed: ${primaryError.message}`);

    // If local or dev, fallback to MongoMemoryServer so the app runs smoothly
    try {
      console.log('[MongoDB] Starting MongoMemoryServer fallback for local development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memoryUri}`);
      console.log('[MongoDB] Note: Data will be kept in memory during this server session.');
      return conn;
    } catch (fallbackError) {
      console.error('[MongoDB] Both primary and fallback database connections failed:', fallbackError.message);
      throw fallbackError;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB] Error during disconnection:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
