import { useState } from "react";
import axios from "axios";
import Error from "../components/Error.jsx";
import Loader from "../components/Loader.jsx";
import styles from "./Login.module.css";

const api = axios.create({
  baseURL: "https://real-time-hotel-room-booking-website.onrender.com",
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
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      seterror(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className={styles.page}>
      {loading && <Loader />}

      <div className={styles.container}>
        <div className={styles.left}>
          <img src="../../public/register.png" alt="Login Visual" />
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>Welcome Back</h2>

          {error && <Error message={error} />}

          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <button className={styles.button} onClick={login}>
            Login
          </button>

          <p className={styles.bottomText}>
            Dont have an account?{" "}
            <a href="/register" className={styles.link}>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
