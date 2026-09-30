const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

const connectDB = async () => {
  let conn;

  try {
    conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    if (error.code !== "ESERVFAIL" || !process.env.MONGO_URI?.startsWith("mongodb+srv://")) {
      throw error;
    }

    const servers = (process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8")
      .split(",")
      .map((server) => server.trim())
      .filter(Boolean);

    dns.setServers(servers);
    conn = await mongoose.connect(process.env.MONGO_URI);
  }

  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
