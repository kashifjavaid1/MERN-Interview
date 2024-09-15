import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../constance/url";

const EditWhiteBoard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [title, setTitle] = useState("");
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapeType, setShapeType] = useState("line");
  const [titleError, setTitleError] = useState(false);
  const navigation = useNavigate();
  const { id } = useParams();

  const startDrawing = (e) => {
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setDrawing(true);

    if (shapeType === "line") {
      setCurrentShape({
        type: "line",
        x1: startX,
        y1: startY,
        x2: startX,
        y2: startY,
        color: "black",
        thickness: 2,
      });
    } else if (shapeType === "rectangle") {
      setCurrentShape({
        type: "rectangle",
        x: startX,
        y: startY,
        width: 0,
        height: 0,
        color: "green",
      });
    } else if (shapeType === "circle") {
      setCurrentShape({
        type: "circle",
        x: startX,
        y: startY,
        radius: 0,
        color: "blue",
      });
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (shapeType === "line") {
      setCurrentShape((prevShape) => ({
        ...prevShape,
        x2: endX,
        y2: endY,
      }));

      ctx.beginPath();
      ctx.moveTo(currentShape.x1, currentShape.y1);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (shapeType === "rectangle") {
      const width = endX - currentShape.x;
      const height = endY - currentShape.y;
      setCurrentShape((prevShape) => ({
        ...prevShape,
        width,
        height,
      }));
      ctx.strokeRect(currentShape.x, currentShape.y, width, height);
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - currentShape.x, 2) + Math.pow(endY - currentShape.y, 2)
      );
      setCurrentShape((prevShape) => ({
        ...prevShape,
        radius,
      }));

      ctx.beginPath();
      ctx.arc(currentShape.x, currentShape.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!drawing) return;
    setShapes([...shapes, currentShape]);
    setDrawing(false);
    setCurrentShape(null);
  };

  const drawLinesOnCanvas = (lines) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = line.color || "#000";
      ctx.lineWidth = line.thickness || 2;
      ctx.stroke();
    });
  };

  const drawRectanglesOnCanvas = (rectangles) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach((rect) => {
      ctx.strokeStyle = rect.color || "#000";
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    });
  };

  const drawCirclesOnCanvas = (circles) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.strokeStyle = circle.color || "#000";
      ctx.stroke();
    });
  };

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const response = await axios.get(`${URL}/drawing/${id}`);
        setDrawing(response.data);
      } catch (error) {
        console.error("Error fetching drawing:", error);
      }
    };

    fetchDrawing();
  }, [id]);

  useEffect(() => {
    if (drawing) {
      if (drawing.lines) {
        drawLinesOnCanvas(drawing.lines);
      }
      if (drawing.shapes) {
        const rectangles = drawing.shapes.filter(
          (shape) => shape.type === "rectangle"
        );
        const circles = drawing.shapes.filter(
          (shape) => shape.type === "circle"
        );
        if (rectangles.length > 0) {
          drawRectanglesOnCanvas(rectangles);
        }
        if (circles.length > 0) {
          drawCirclesOnCanvas(circles);
        }
      }
    }
  }, [drawing]);

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
      const response = await axios.put(
        `http://localhost:4001/drawing/${id}`,
        drawingData
      );

      if (response.status === 200) {
        alert("Drawing saved successfully!");
        setTitle("");
        navigation("/");
        setTitleError(false);
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

      <canvas
        ref={canvasRef}
        className="border border-gray-400 rounded-lg shadow-lg mb-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        width="600"
        height="400"
      ></canvas>

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

export default EditWhiteBoard;
