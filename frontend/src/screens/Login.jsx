import { useState } from "react";
import axios from "axios";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
const api = axios.create({
  baseURL: 'https://real-time-hotel-room-booking-website.onrender.com'
});

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");  

  const login = async () => {
    seterror("");

    if (!email.trim() || !password.trim()) {
      seterror("Please enter both email and password");
      return;
    }

    const user = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      setloading(true);
      const result = (await api.post("/api/user/login", user)).data;
      setloading(false);
      
      localStorage.setItem("currentUser", JSON.stringify(result));
      
      window.location.href = "/home";
      
    } catch (error) {
      setloading(false);
      
      const errorMessage = error.response?.data?.message || 
                          "Login failed. Please try again.";
      seterror(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div>
      {loading && <Loader />}

      <div className="row justify-content-center mt-5 imgbox1">
        <div className="col-md-5 mt-5">
          {error && <Error message={error} />}
          
          <div>
            <center>
              <h1>Login</h1>
            </center>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="email"
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="current-password"
            />
          </div>
          <center>
            <button className="btn btn-primary mt-4" onClick={login}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Login;