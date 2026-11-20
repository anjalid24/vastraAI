require("dotenv").config();
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
if (
  process.env.NODE_ENV === "production" &&
  (process.env.JWT_SECRET.length < 32 ||
    /your|change|secret_key/i.test(process.env.JWT_SECRET))
) {
  throw new Error("Set a unique random JWT_SECRET of at least 32 characters");
}
const app = require("./src/app");
const connectDB = require("./src/config/database");
const PORT = process.env.PORT || 5000;
let server;
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Vastra AI API listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database startup failed:", error.message);
    process.exit(1);
  });
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});
process.on("SIGTERM", () => {
  if (server) server.close(() => process.exit(0));
  else process.exit(0);
});
