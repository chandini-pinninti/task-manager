import React, { useState } from "react";
import API from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN FUNCTION
  const handleLogin = async (roleType) => {

    // Clear previous session
    localStorage.clear();

    // Validate input
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
          role: roleType
        }
      );

      console.log(
        "Login response:",
        res.data
      );

      // Store session
      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        res.data.role
      );

      alert("Login successful");

      // Redirect to dashboard
      window.location.reload();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    }

  };

  return (

    <div className="container mt-5">

      <div
        className="card p-4 mx-auto"
        style={{ width: "320px" }}
      >

        <h3 className="text-center">
          Task Manager Login
        </h3>

        {/* Email */}

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* ADMIN LOGIN */}

        <button
          className="btn btn-danger w-100 mb-2"
          onClick={() =>
            handleLogin("admin")
          }
        >
          Login as Admin
        </button>

        {/* USER LOGIN */}

        <button
          className="btn btn-primary w-100"
          onClick={() =>
            handleLogin("user")
          }
        >
          Login as User
        </button>

      </div>

    </div>

  );

}

export default Login;