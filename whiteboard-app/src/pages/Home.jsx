import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { URL } from "../constance/url";

const Home = () => {
  const [drawings, setDrawings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for canvas elements
  const canvasRefs = useRef([]);

  // Fetch all drawings from the backend
  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const response = await axios.get(`${URL}/drawing`);
        setDrawings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drawings:", error);
        setLoading(false);
      }
    };

    fetchDrawings();
  }, []);

  // Function to draw lines on canvas
  const drawLinesOnCanvas = (lines, canvasRef) => {
    const canvas = canvasRef;

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
    const canvas = canvasRef;

    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rectangles if available
      rectangles.forEach((rect) => {
        ctx.strokeStyle = rect.color || "#000";
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }
  };

  // Function to draw circles on canvas
  const drawCirclesOnCanvas = (circles, canvasRef) => {
    const canvas = canvasRef;

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

  // Draw shapes when drawings are loaded
  useEffect(() => {
    drawings?.forEach((drawing, index) => {
      const canvasRef = canvasRefs.current[index];
      if (canvasRef) {
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
    });
  }, [drawings]);

  const handleDelete = async (id) => {
    confirm("Are you sure you want to delete this drawing?");
    try {
      await axios.delete(`${URL}/drawing/${id}`);
      setDrawings(drawings.filter((drawing) => drawing._id !== id));
      alert("Drawing deleted successfully");
    } catch (error) {
      console.error("Error deleting drawing:", error.message);
      alert("Failed to delete drawing");
    }
  };

  if (loading) {
    return <p>Loading drawings...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 mt-20">
        All Drawings
      </h2>
      {drawings.length === 0 ? (
        <p className="text-center text-gray-600">No drawings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 cursor-pointer ">
          {drawings?.map((drawing, index) => (
            <div
              key={drawing._id}
              className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out "
            >
              <div className="flex space-x-2">
                <h1 className="text-lg font-semibold  text-gray-800">Title:</h1>
                <h3 className="text-lg font-semibold  text-gray-800 ">
                  {drawing.title}
                </h3>
              </div>

              <canvas
                ref={(el) => (canvasRefs.current[index] = el)}
                className="w-full mb-4 mx-auto"
              ></canvas>

              <div className="mt-4 flex justify-between ">
                <div className="flex space-x-2">
                  <Link
                    to={`/drawing/${drawing._id}`}
                    className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
                  >
                    View
                  </Link>{" "}
                  <Link
                    to={`/edit/${drawing._id}`}
                    className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
                  >
                    edit
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(drawing._id)}
                  className="text-black font-semibold hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
