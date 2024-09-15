import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import drawingRoute from "./routes/drawing.route.js"; // Add .js extension
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

connectDB();

app.use("/", drawingRoute);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
