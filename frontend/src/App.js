import React, { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskPage from "./pages/TaskPage";

function App() {

  const token =
    localStorage.getItem("token");

  const [showRegister, setShowRegister] =
    useState(false);

  if (token) {
    return <TaskPage />;
  }

  return (

    <div>

      {showRegister ? (

        <>
          <Register />

          <p style={{ textAlign: "center" }}>
            Already have an account?
            <button
              onClick={() =>
                setShowRegister(false)
              }
            >
              Login
            </button>
          </p>
        </>

      ) : (

        <>
          <Login />

          <p style={{ textAlign: "center" }}>
            New user?
            <button
              onClick={() =>
                setShowRegister(true)
              }
            >
              Register
            </button>
          </p>
        </>

      )}

    </div>

  );

}

export default App;