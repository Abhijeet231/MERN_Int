## 🚀 Features

## 👤 User Authentication

Secure JWT authentication

Login, register, logout and delete functionality

Protected routes and cookies-based session management


## 🧑‍💼 Agent Management

Admin can create multiple agents

Each agent is linked to the creator admin

Agents display the number of tasks assigned

##  📁 CSV Upload & Task Distribution

Upload files in .csv, .xlsx, or .xls formats

Validate and clean data before saving

Distribute uploaded data equally among agents (round-robin)

Automatically links each record to its assigned agent and creator admin


## 🗑️ Data Cleanup

When a user is deleted, all related agents and distribution lists are deleted automatically

## 🧮 How Distribution Works 

If 1 agent → gets all uploaded records.

If <5 agents → data is distributed using round-robin logic.

If ≥5 agents → still distributed evenly (round-robin).

Remaining records (if not divisible equally) are distributed sequentially.

##  🧠 Edge case 
Upload without agents → toast error prompting to create agents

Deleting a user → cascades deletion of agents and distribution lists

Real-time toast messages for all actions (upload, errors, etc.)

## 🎥 Demonstration Video

👉 Google Drive Demo Link:
🔗 Click here to view the working demo

## 📧 Author

Abhijeet Ghosh

💼 GitHub: Abhijeet231 (https://github.com/Abhijeet231)

📩 Email: ghoshabhijeet778@gmail.com
