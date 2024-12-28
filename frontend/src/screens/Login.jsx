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
  const [error, seterror] = useState();

  const login = async () => {
    if (email == " " || password == " ") {
      alert("Please enter details first");
    }
    const user = {
      email,
      password,
    };
    try {
      setloading(true);
      const result = (await api.post("/api/user/login", user)).data;
      setloading(false);
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      setloading(false);
      seterror(true);
    }
  };
  return (
    <div>
      {loading && <Loader />}

      <div className="row justify-content-center mt-5 imgbox1">
        <div className="col-md-5 mt-5">
          {error && <Error message="Invalid Credentials"></Error>}
          <div>
            <center>
              <h1>Login</h1>
            </center>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
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
