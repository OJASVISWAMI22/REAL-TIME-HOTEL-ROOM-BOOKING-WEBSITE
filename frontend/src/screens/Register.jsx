import { useState } from "react";
import axios from "axios";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
import Success from "../components/Success.jsx";
import styles from "./Register.module.css";

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

    if (!name || !email || !password || !cp) {
      seterror("Please enter all user details");
      return;
    }

    if (password !== cp) {
      seterror("Passwords don't match!");
      return;
    }

    const user = { name, email, password, cp };

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
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      seterror(errorMessage);
    }
  };

  return (
    <div className={styles.page}>
      {loading && <Loader />}

      <div className={styles.container}>

        <div className={styles.leftPanel}>
          <img
            src="../../public/register.png"  
            className={styles.illustration}
            alt="side"
          />
        </div>
        <div className={styles.rightPanel}>
          <h1 className={styles.title}>Create Account</h1>

          {error && <Error message={error} />}
          {success && <Success message={success} />}

          <input
            type="text"
            className={styles.input}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Confirm Password"
            value={cp}
            onChange={(e) => setcp(e.target.value)}
          />

          <button className={styles.btn} onClick={register}>
            Register
          </button>

          <p className={styles.switchText}>
            Already have an account ? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
