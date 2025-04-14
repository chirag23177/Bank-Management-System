// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Set up PostgreSQL connection pool with your credentials
const pool = new Pool({
  user: 'postgres',            // your PostgreSQL username
  host: 'localhost',           // your host
  database: 'bank',            // your database name
  password: 'Chirag',          // your database password
  port: 5432,                  // PostgreSQL default port
});

// ---------- Base Route to Test Connection ---------- //
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bank;'); // Adjust table name if needed
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Customer Login Endpoint ---------- //
app.post('/customer/login', async (req, res) => {
  const { customerId } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE "UserID" = $1', [customerId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error in customer login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Employee Login Endpoint ---------- //
app.post('/employee/login', async (req, res) => {
  const { employeeId } = req.body;
  try {
    const result = await pool.query('SELECT * FROM employee WHERE "EmployeeID" = $1', [employeeId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error in employee login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Fetch Customer Details ---------- //
app.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE "UserID" = $1', [customerId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Fetch Accounts for a Customer ---------- //
app.get('/customer/:customerId/accounts', async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM account WHERE "UserID" = $1', [customerId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching customer accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Fetch Transactions for an Account ---------- //
app.get('/account/:accountNo/transactions', async (req, res) => {
  const { accountNo } = req.params;
  try {
    // This query assumes transactions where the given account appears as sender or receiver.
    const result = await pool.query(
      'SELECT * FROM transaction_history WHERE "AccountNo1" = $1 OR "AccountNo2" = $1', [accountNo]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching account transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Custom SQL Query Execution ---------- //
app.post('/custom-query', async (req, res) => {
  const { query } = req.body;
  // Warning: Executing raw queries can be dangerous.
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing custom query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
