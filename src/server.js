require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Boot sequence: connect to MongoDB first, then start listening.
 * Keeping this in server.js (separate from app.js) means app.js stays
 * a pure, importable Express instance — easy to test without opening
 * ports or DB connections.
 */
const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `Vastra AI server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });

  // Safety net: on an unhandled promise rejection, close the server
  // gracefully and exit so the process can be restarted cleanly.
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

start();
