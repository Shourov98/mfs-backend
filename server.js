const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("MFS API is running...");
});

// TODO: Add routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
