import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import DrawingDetail from "./pages/DrawingDetail";
import Whiteboard from "./pages/Whiteboard";
import EditWhiteBoard from "./pages/editWhiteBoard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className=" shadow-md p-4 flex justify-between fixed w-full bg-black">
          <h1 className="text-xl font-bold text-white">Whiteboard App</h1>
          <Link
            to="/whiteboard"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            New Drawing
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drawing/:id" element={<DrawingDetail />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/edit/:id" element={<EditWhiteBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
