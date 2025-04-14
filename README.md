# 🏦 Bank Management System – DBMS Project

A full-stack Bank Management System built for a Database Management Systems (DBMS) course project. The system provides a GUI interface for customers and employees to view and manage banking operations such as viewing personal details, accounts, transactions, loans, and transferring funds.

---

## 📚 Description

This system enables a bank to manage and streamline key operations like:

- Storing and retrieving customer and employee information
- Managing multiple bank accounts and transactions
- Tracking loans
- Executing custom SQL queries securely
- Transferring funds between accounts in real-time

It integrates a PostgreSQL database with a Node.js/Express backend and a React frontend to deliver a smooth, user-friendly experience.

---

## 🛠️ Tech Stack

| Layer       | Technology                |
|------------|---------------------------|
| Frontend   | React (JavaScript, JSX)   |
| Backend    | Node.js, Express.js       |
| Database   | PostgreSQL (via pgAdmin4) |
| API Comm   | REST (Fetch API / AJAX)   |

---

## ✨ Features

- Customer and Employee Login Dashboards
- View personal info, accounts, transactions, and loans
- Transfer funds securely between accounts (with locking and rollback)
- Employee panel to view branch-specific data and run custom SQL queries
- Clean and interactive UI

---

## 📁 Project Structure

```
bank-project/
├── bank-frontend/         # React Frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── components/
│   │       ├── LoginPage.js
│   │       ├── CustomerDashboard.js
│   │       ├── EmployeeDashboard.js
│   │       ├── TransferFunds.js
│   │       └── CustomQuery.js
│   └── public/
├── bank-backend/          # Node.js + Express Backend
│   └── index.js
└── README.md
```

---

## 🧑‍💻 How to Run the Project

### 📦 Prerequisites

- Node.js & npm installed → [https://nodejs.org](https://nodejs.org)
- PostgreSQL and pgAdmin4 installed & running
- Database created with required schema & populated data

---

### 🔌 Database Setup (PostgreSQL)

Ensure your database is created with:
- Tables like `BANK`, `BRANCH`, `ACCOUNT`, `USERS`, `EMPLOYEE`, `TRANSACTION_HISTORY`, `LOAN`, etc.
- Use `BankSchema.sql` and `BankData.sql` files provided.

Set up your DB credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD="Your Password"
DB_NAME="Your Database Name"
```

---

### 🖥️ Backend Setup (Express + PostgreSQL)

```bash
cd bank-backend
npm install
node index.js
```

✅ Should log: `Server is running on http://localhost:5000`

---

### 🌐 Frontend Setup (React)

```bash
cd bank-frontend
npm install
npm start
```

✅ React app runs at: `http://localhost:3000`

---

### 🔄 Transfer Fund Functionality

- Accessible via the **Customer Dashboard**
- Inputs:
  - Source Account
  - Target Account
  - Amount
- Backend handles:
  - Locking tables
  - Deducting balance (with validation)
  - Recording transaction
  - Committing or rolling back safely

---

## 📸 UI Preview

*(Add screenshots of Login Page, Customer Dashboard, Transfer Funds form here if you want)*

---

## 💡 Notes

- Frontend communicates with backend via `http://localhost:5000` using REST APIs
- CORS enabled in backend to allow cross-origin access
- PostgreSQL queries are parameterized to prevent SQL injection

---

## 🤝 Acknowledgements

- Project by Chirag Yadav, IIIT-Delhi  
- Guided by DBMS course curriculum  



