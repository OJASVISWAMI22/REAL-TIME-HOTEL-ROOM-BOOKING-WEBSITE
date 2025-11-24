import { useState } from "react";
import axios from "axios";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
import Success from "../components/Success.jsx";

const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cp, setcp] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");  
  const [success, setsuccess] = useState("");  

  const register = async () => {

    seterror("");
    setsuccess("");

    if (name == "" || email == "" || password == "" || cp == "") {
      seterror("Please enter all user details");
      return;
    }
    
    if (password !== cp) {
      seterror("Passwords don't match!");
      return;
    }

    const user = {
      name,
      email,
      password,
      cp,
    };

    try {
      setloading(true);
      const result = await axios.post(
        "https://real-time-hotel-room-booking-website.onrender.com/api/user/register",
        user
      );
      setloading(false);
      
      setsuccess(result.data.message || "Registration Successful");
      
      setname("");
      setemail("");
      setpassword("");
      setcp("");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (error) {
      setloading(false);
      console.log(error);
      
      const errorMessage = error.response?.data?.message || 
                          "Registration failed. Please try again.";
      seterror(errorMessage);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      
      <div className="row justify-content-center mt-5 imgbox1">
        <div className="col-md-5 mt-5">

          {error && <Error message={error} />}
          
          {success && <Success message={success} />}
          
          <div>
            <center>
              <h1>Register</h1>
            </center>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cp}
              onChange={(e) => setcp(e.target.value)}
            />
          </div>
          <center>
            <button className="btn btn-primary mt-4" onClick={register}>
              Register
            </button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Register;