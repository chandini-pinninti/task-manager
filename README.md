# Task Manager Application with Role-Based Access

## Project Description

This is a full-stack Task Manager application built using React, Node.js, Express, and MongoDB.

The application supports role-based access:

* Admin can create, assign, edit, and delete tasks
* User can view assigned tasks and update task status

---

## Features

Admin:

* Register and login as Admin
* Create tasks
* Assign tasks to users
* Edit tasks
* Delete tasks
* View all tasks

User:

* Register and login as User
* View assigned tasks
* Update task status (Pending → Completed)

---

## Technologies Used

Frontend:

* React
* Bootstrap
* Axios

Backend:

* Node.js
* Express

Database:

* MongoDB

Authentication:

* JWT

---

## How to Run the Project

### Backend

Open terminal:

```bash
cd backend
npm install
npm start
```

Server runs on:

```text
http://localhost:5000
```

---

### Frontend

Open new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Admin Registration

To register as Admin, use this Admin Key:

Admin Key:

```text
ADMIN123
```

Steps:

1. Open Registration page
2. Select role as Admin
3. Enter Admin Key
4. Click Register

---

## Demo Accounts

Admin:
Full Name: Admin
Email: [admin1@gmail.com]
Password: admin1234
Admin Key: ADMIN123

User:
Full name: user
Email: [user1@gmail.com](mailto:user1@gmail.com)
Password: user1234

---

## Folder Structure

```text
task-manager
   backend
   frontend
   screenshots
   README.md
```


