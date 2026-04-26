import React, { useState } from "react";
import API from "../services/api";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");
  const [adminKey, setAdminKey] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    // Password validation rule
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordPattern.test(password)) {

      alert(
        "Password must be at least 6 characters and contain a number"
      );

      return;

    }

    // Confirm password check
    if (password !== confirmPassword) {

      alert(
        "Passwords do not match"
      );

      return;

    }

    // Admin key validation (frontend check)
    if (role === "admin" && !adminKey) {

      alert(
        "Admin secret key is required"
      );

      return;

    }

    try {

      await API.post(
        "/auth/signup",
        {
          name,
          email,
          password,
          role,
          adminKey
        }
      );

      alert(
        "Registration successful"
      );

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );

    }

  };

  return (

    <div className="container mt-5">

      <div
        className="card p-4 mx-auto shadow"
        style={{ width: "380px" }}
      >

        <h3 className="text-center mb-3">
          Registration
        </h3>

        <form onSubmit={handleRegister}>

          {/* Name */}

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          {/* Email */}

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          {/* Password */}

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {/* Confirm Password */}

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          {/* Role Selection */}

          <select
            className="form-control mb-3"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >

            <option value="user">
              Register as User
            </option>

            <option value="admin">
              Register as Admin
            </option>

          </select>

          {/* Admin Key */}

          {role === "admin" && (

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Admin Secret Key"
              value={adminKey}
              onChange={(e) =>
                setAdminKey(e.target.value)
              }
              required
            />

          )}

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Register
          </button>

        </form>

      </div>

    </div>

  );

}

export default Register;