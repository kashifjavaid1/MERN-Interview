import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DrawingBoard from "../component/Drawing";
import { URL } from "../constance/url";

const Whiteboard = () => {
  const [shapes, setShapes] = useState([]);
  const [shapeType, setShapeType] = useState("line");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const navigate = useNavigate();

  const saveShape = (newShape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  const saveDrawing = async () => {
    if (!title) {
      setTitleError(true);
      return;
    }

    const drawingData = {
      title,
      lines: shapes.filter((shape) => shape.type === "line"),
      shapes: shapes.filter((shape) => shape.type !== "line"),
    };

    try {
      const response = await axios.post(`${URL}/drawing`, drawingData);
      if (response.status === 201) {
        alert("Drawing saved successfully!");
        setTitle("");
        setShapes([]); // Clear shapes after saving
        navigate("/");
      } else {
        alert("Failed to save drawing");
      }
    } catch (error) {
      console.error("Error saving drawing:", error);
      alert("Error saving drawing");
    }
  };

  return (
    <div className="whiteboard-container bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Interactive Whiteboard
      </h2>

      {/* Input for Drawing Title */}
      <input
        type="text"
        className={`border p-3 mb-2 w-full rounded-md shadow-sm focus:outline-none ${
          titleError ? "border-red-500" : "border-gray-400"
        } focus:ring-2 ${
          titleError ? "focus:ring-red-500" : "focus:ring-purple-500"
        }`}
        placeholder="Enter drawing title..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (e.target.value) setTitleError(false);
        }}
      />
      {titleError && (
        <p className="text-red-500 text-sm mb-4">
          Title is required to save the drawing.
        </p>
      )}

      {/* Shape Selector */}
      <div className="mb-4">
        <label className="mr-2 text-lg font-medium text-gray-700">
          Select Shape:
        </label>
        <select
          value={shapeType}
          onChange={(e) => setShapeType(e.target.value)}
          className="border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="line">Line</option>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
        </select>
      </div>

      {/* Drawing Board */}
      <DrawingBoard shapeType={shapeType} onSaveShape={saveShape} />

      {/* Save Drawing Button */}
      <div className="mt-6">
        <button
          onClick={saveDrawing}
          className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Save Drawing
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
