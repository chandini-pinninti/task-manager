import React, { useEffect, useState } from "react";
import API from "../services/api";

function TaskPage() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const role = localStorage.getItem("role");

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load tasks");
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Task
  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks/create", {
        title,
        description,
        assignedTo
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");

      fetchTasks();

    } catch (error) {
      alert("Failed to create task");
    }
  };

  // Start Edit
  const startEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Save Edit
  const saveEdit = async () => {
    try {
      await API.put(`/tasks/edit/${editId}`, {
        title,
        description
      });

      setEditId(null);
      setTitle("");
      setDescription("");

      fetchTasks();

    } catch (error) {
      alert("Failed to update task");
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  // Complete Task
  const completeTask = async (id) => {
    try {
      await API.put(`/tasks/update/${id}`, {
        status: "completed"
      });

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchTasks();

    if (role === "admin") {
      fetchUsers();
    }

  }, []);

  return (

    <div className="container mt-4">

      {/* Header */}

      <div className="d-flex justify-content-between mb-4">

        <h2 className="text-primary">
          Task Manager
        </h2>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* Create / Edit */}

      {role === "admin" && (

        <div className="card p-4 mb-4 shadow">

          <h4>
            {editId ? "Edit Task" : "Create Task"}
          </h4>

          <form
            onSubmit={
              editId
                ? (e) => {
                    e.preventDefault();
                    saveEdit();
                  }
                : createTask
            }
          >

            <div className="row g-2">

              <div className="col-md-3">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />

              </div>

              <div className="col-md-3">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                />

              </div>

              {!editId && (

                <div className="col-md-3">

                  <select
                    className="form-select"
                    value={assignedTo}
                    onChange={(e) =>
                      setAssignedTo(e.target.value)
                    }
                    required
                  >

                    <option value="">
                      Select User
                    </option>

                    {users.map((user) => (

                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.email}
                      </option>

                    ))}

                  </select>

                </div>

              )}

              <div className="col-md-3">

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {editId ? "Save" : "Create"}
                </button>

                {editId && (

                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>

                )}

              </div>

            </div>

          </form>

        </div>

      )}

      {/* Task List */}

      <div className="card p-4 shadow">

        <div className="d-flex justify-content-between mb-3">

          <h4>Task List</h4>

          <div className="d-flex gap-2">

            <input
              type="text"
              className="form-control"
              placeholder="Search task"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{ width: "200px" }}
            />

            <select
              className="form-select"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              style={{ width: "150px" }}
            >

              <option value="all">
                All
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

        </div>

        {tasks.length === 0 ? (

          <p>No tasks available</p>

        ) : (

          tasks
            .filter((task) => {

              const matchesSearch =
                task.title
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  );

              const matchesFilter =
                filter === "all" ||
                task.status === filter;

              return (
                matchesSearch &&
                matchesFilter
              );

            })

            .map((task) => (

              <div
                key={task._id}
                className="d-flex justify-content-between border rounded p-3 mb-2"
              >

                <div>

                  <strong>
                    {task.title}
                  </strong>

                  {" — "}

                  {task.description}

                  {" — "}

                  <span
                    className={
                      task.status === "completed"
                        ? "badge bg-success"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {task.status}
                  </span>

                  {/* Assigned user */}

                  {role === "admin" && (

                    <div
                      style={{
                        fontSize: "13px",
                        color: "gray"
                      }}
                    >

                      Assigned to:

                      <b>
                        {" "}
                        {task.assignedTo?.name} (
                        {task.assignedTo?.email})
                      </b>

                    </div>

                  )}

                </div>

                <div>

                  {role === "user" &&
                    task.status !== "completed" && (

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() =>
                          completeTask(task._id)
                        }
                      >
                        Complete
                      </button>

                    )}

                  {role === "admin" && (

                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          startEdit(task)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          deleteTask(task._id)
                        }
                      >
                        Delete
                      </button>
                    </>

                  )}

                </div>

              </div>

            ))

        )}

      </div>

    </div>

  );

}

export default TaskPage;