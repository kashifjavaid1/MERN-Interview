import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  x2: { type: Number, required: true },
  y2: { type: Number, required: true },
  color: { type: String, default: "black" },
  thickness: { type: Number, default: 2 },
});

const shapeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  radius: { type: Number },
  color: { type: String, default: "black" },
});

const textAnnotationSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  text: { type: String, required: true },
  fontSize: { type: Number, default: 16 },
  color: { type: String, default: "black" },
});

const drawingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lines: [lineSchema],
  shapes: [shapeSchema],
  textAnnotations: [textAnnotationSchema],
  createdAt: { type: Date, default: Date.now },
});

const Drawing = mongoose.model("Drawing", drawingSchema);

export default Drawing;
