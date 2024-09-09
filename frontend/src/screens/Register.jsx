import { useState } from "react";

const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cp, setcp] = useState("");

  const register = () => {
    if(name==" " || email==" " || password==" " || cp==" "){
      alert("Please enter user details first")
    }
    else if (password == cp ) {
      const user = {
        name,
        email,
        password,
        cp,
      };
      console.log(user);
    } else {
      alert("Unmatched Password !!");
    }
  };
  return (
    <div className="row justify-content-center mt-5 imgbox1">
      <div className="col-md-5 mt-5">
        <div>
          <center><h1>Register</h1></center>
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
        <center><button className="btn btn-primary mt-4" onClick={register}>
          Register
        </button></center>
      </div>
    </div>
  );
};

export default Register;
