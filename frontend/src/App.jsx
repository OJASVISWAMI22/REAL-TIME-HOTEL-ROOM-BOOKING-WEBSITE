import "./App.css";
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Homescreen from "./screens/homescreen";
import BookingScreen from "./screens/bookingscreen";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Profilescreen from "./screens/profilescreen";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/home" element={<Homescreen />} />
          <Route path="/book/:roomid/:fromdate/:todate" element={<BookingScreen />} />\
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profilescreen/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
