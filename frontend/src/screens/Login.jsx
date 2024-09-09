import { useState } from "react";

const Login=()=>{
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const login = () => {
    if( email==" " || password==" " ){
      alert("Please enter details first")
    }
      const user = {
        email,
        password,
      };
      console.log(user);
   
  };
  return (
    <div className="row justify-content-center mt-5 imgbox1">
      <div className="col-md-5 mt-5">
        <div>
          <center><h1>Login</h1></center>
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
        <center><button className="btn btn-primary mt-4" onClick={login}>
          Login
        </button></center>
      </div>
    </div>
  )
}

export default Login;