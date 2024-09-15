import express from "express";
import {
  createDrawing,
  deleteDrawing,
  editDrawingById,
  getDrawing,
  getDrawingById,
} from "../controller/drawing_controller.js";

const router = express.Router();

router.post("/drawing", createDrawing);
router.get("/drawing", getDrawing);
router.delete("/drawing/:id", deleteDrawing);
router.get("/drawing/:id", getDrawingById);
router.put("/drawing/:id", editDrawingById);

export default router;
