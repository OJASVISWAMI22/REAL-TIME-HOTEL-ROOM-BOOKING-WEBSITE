import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Homescreen from "./screens/homescreen";
import BookingScreen from "./screens/bookingscreen";
import Register from "./screens/Register";
import Login from "./screens/Login";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/home" element={<Homescreen />} />
          <Route path="/book/:roomid" element={<BookingScreen />} />\
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
