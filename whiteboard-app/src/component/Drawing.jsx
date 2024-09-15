import React, { useRef, useState, useEffect } from "react";

const DrawingBoard = ({ shapeType, onSaveShape }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color || "black";
      ctx.lineWidth = shape.thickness || 2;

      if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      } else if (shape.type === "rectangle") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [shapes]);

  const startDrawing = (e) => {
    const startX = e.nativeEvent.offsetX;
    const startY = e.nativeEvent.offsetY;
    setDrawing(true);

    const newShape = { type: shapeType, color: "black" };
    if (shapeType === "line") {
      setCurrentShape({
        ...newShape,
        x1: startX,
        y1: startY,
        x2: startX,
        y2: startY,
        thickness: 2,
      });
    } else if (shapeType === "rectangle") {
      setCurrentShape({
        ...newShape,
        x: startX,
        y: startY,
        width: 0,
        height: 0,
      });
    } else if (shapeType === "circle") {
      setCurrentShape({
        ...newShape,
        x: startX,
        y: startY,
        radius: 0,
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

    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color || "black";
      ctx.lineWidth = shape.thickness || 2;

      if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
      } else if (shape.type === "rectangle") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

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
    setShapes((prevShapes) => [...prevShapes, currentShape]);
    onSaveShape(currentShape); // Notify parent component of the new shape
    setDrawing(false);
    setCurrentShape(null);
  };

  return (
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
  );
};

export default DrawingBoard;
