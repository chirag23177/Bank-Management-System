// Import required modules
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create an Express application
const app = express();
const port = 5000; // or any port you prefer

// Use middleware: CORS for cross-origin requests and express.json() to parse JSON bodies
app.use(cors());
app.use(express.json());

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',            // your PostgreSQL username
  host: 'localhost',           // database host
  database: 'bank',            // your database name
  password: 'Chirag',          // your database password
  port: 5432,                  // PostgreSQL default port
});

// A sample endpoint to test the connection
app.get('/', async (req, res) => {
  try {
    // Test query; adjust the table name if needed
    const result = await pool.query('SELECT * FROM "BANK";');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
