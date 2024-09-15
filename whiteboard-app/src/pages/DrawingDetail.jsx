import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { URL } from "../constance/url";

function DrawingDetail() {
  const { id } = useParams();
  const [drawing, setDrawing] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  // Fetch the specific drawing from the backend
  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        const response = await axios.get(`${URL}/drawing/${id}`);
        setDrawing(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drawing:", error);
        setLoading(false);
      }
    };

    fetchDrawing();
  }, [id]);

  // Function to draw lines on canvas
  const drawLinesOnCanvas = (lines, canvasRef) => {
    const canvas = canvasRef.current;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lines if available
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = line.color || "#000"; // Default color if not provided
        ctx.lineWidth = line.thickness || 2; // Default thickness if not provided
        ctx.stroke();
      });
    }
  };

  // Function to draw rectangles on canvas
  const drawRectanglesOnCanvas = (rectangles, canvasRef) => {
    const canvas = canvasRef.current;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rectangles if available
      rectangles.forEach((rect) => {
        ctx.strokeStyle = rect.color || "#000"; // Default color if not provided
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }
  };

  // Function to draw circles on canvas
  const drawCirclesOnCanvas = (circles, canvasRef) => {
    const canvas = canvasRef.current;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw circles if available
      circles.forEach((circle) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = circle.color || "#000";
        ctx.stroke();
      });
    }
  };

  useEffect(() => {
    if (drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        if (drawing.lines && drawing.lines.length > 0) {
          drawLinesOnCanvas(drawing.lines, canvasRef);
        }
        if (drawing.shapes) {
          // Separate shapes into rectangles and circles
          const rectangles = drawing.shapes.filter(
            (shape) => shape.type === "rectangle"
          );
          const circles = drawing.shapes.filter(
            (shape) => shape.type === "circle"
          );
          if (rectangles.length > 0) {
            drawRectanglesOnCanvas(rectangles, canvasRef);
          }
          if (circles.length > 0) {
            drawCirclesOnCanvas(circles, canvasRef);
          }
        }
      }
    }
  }, [drawing]);

  if (loading) {
    return <p>Loading drawing details...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mt-20 ">Drawing Details</h2>
      <div className="bg-white shadow-md p-6 rounded-md">
        <div className="flex text-lg font-semibold  text-gray-800 ">
          <h1>Title:</h1>
          <p className="mb-4">{drawing?.title}</p>
        </div>
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 w-[50%]"
        ></canvas>
        <Link to={"/"}>
          <div className="mt-4">
            <button className="bg-blue-500 text-white text-xl py-3 px-6 rounded-md">
              back
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DrawingDetail;
