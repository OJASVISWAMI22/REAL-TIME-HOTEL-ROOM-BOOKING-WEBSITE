import { useState } from "react";
import axios from "axios";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
import Success from "../components/Success.jsx";

const api = axios.create({
    baseURL: 'https://your-render-backend-url.onrender.com'
});

const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cp, setcp] = useState("");

  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [success, setsuccess] = useState();
  const register = async () => {
    if (name == "" || email == "" || password == "" || cp == "") {
      alert("Please enter user details first");
    } else if (password == cp) {
      const user = {
        name,
        email,
        password,
        cp,
      };
      try {
        setloading(true);
        const result = (await api.post("/api/user/register", user)).data;
        setloading(false);
        setsuccess(true);
        setname("");
        setemail("");
        setpassword("");
        setcp("");
      } catch (error) {
        setloading(false);
        console.log(error);
        seterror(true);
      }
    } else {
      alert("Unmatched Password !!");
    }
  };
  return (
    <div>
      {loading && <Loader />}
      {error && <Error></Error>}
      <div className="row justify-content-center mt-5 imgbox1 temp">
        <div className="col-md-5 mt-5">
          {success && <Success message={"Registration Successful"}></Success>}
          <div>
            <center>
              <h1>Register</h1>
            </center>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
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
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cp}
              onChange={(e) => {
                setcp(e.target.value);
              }}
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
