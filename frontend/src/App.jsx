import "./App.css";
import Navbar from "./components/Navbar.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Homescreen from "./screens/homescreen";
import BookingScreen from "./screens/bookingscreen";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Profilescreen from "./screens/profilescreen";
import Landing from "./screens/landing.jsx";
import Help from "./screens/help.jsx";
function App() {
  function NavbarWrapper() {
    const location = useLocation();
    return location.pathname !== "/" && location.pathname !== "/help" ? (
      <Navbar />
    ) : null;
  }
  return (
    <>
      <BrowserRouter>
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Homescreen />} />
          <Route
            path="/book/:roomid/:fromdate/:todate"
            element={<BookingScreen />}
          />
          \
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profilescreen />} />
          <Route path="/help" element={<Help></Help>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
