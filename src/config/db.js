const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB using the URI from the environment.
 * On failure we log and exit the process (exit code 1) so a process
 * manager / orchestrator can restart the service rather than run it
 * in a broken, DB-less state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
