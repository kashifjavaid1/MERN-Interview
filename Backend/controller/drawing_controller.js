import Drawing from "../model/drawingScheme.js";

export const createDrawing = async (req, res) => {
  try {
    const newDrawing = new Drawing(req.body);
    const savedDrawing = await newDrawing.save();
    res.status(201).json(savedDrawing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDrawing = async (req, res) => {
  try {
    const drawings = await Drawing.find();
    res.status(201).json(drawings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDrawing = async (req, res) => {
  try {
    const deleteDrawing = await Drawing.findByIdAndDelete(req.params.id);
    if (!deleteDrawing) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    res.status(200).json({ message: "Drawing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete drawing", error });
  }
};

export const getDrawingById = async (req, res) => {
  try {
    const getDrawing = await Drawing.findById(req.params.id);
    if (!getDrawing) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    res.status(200).json(getDrawing);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete drawing", error });
  }
};
export const editDrawingById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDrawing = await Drawing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedDrawing) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    res.status(200).json(updatedDrawing);
  } catch (error) {
    res.status(500).json({ message: "Failed to update drawing", error });
  }
};
