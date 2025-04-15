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
  password: 'Chirag',      // your database password
  port: 5432,                  // PostgreSQL default port
});

// ---------- Check Database Connection on Server Start ---------- //
const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1'); // Simple query to check connection
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// ---------- Base Route to Test Connection ---------- //
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;'); // Replace 'users' with a valid table name
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
    const result = await pool.query('SELECT * FROM users WHERE "userid" = $1', [customerId]);
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
  const { employeeId } = req.body; // Extract employeeId from the request body
  try {
    // Query the database for the employee with the given EmployeeID
    const result = await pool.query('SELECT * FROM employee WHERE "employeeid" = $1', [employeeId]);

    // If no employee is found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Extract the employee's credentials from the query result
    const employee = result.rows[0];

    // Return the employee's credentials as a JSON response
    res.status(200).json({
      EmployeeID: employee.employeeid,
      Name: employee.name,
      BranchID: employee.branchid,
    });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
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
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing custom query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ------------------- Transfer Funds Endpoint ------------------- //
app.post('/transfer-funds', async (req, res) => {
    const { source_account, target_account, transfer_amount } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Lock ACCOUNT and TRANSACTION_HISTORY tables exclusively.
        await client.query('LOCK TABLE account, transaction_history IN ACCESS EXCLUSIVE MODE');

        // Deduct the transfer amount from the source account if funds are sufficient.
        const updateSource = await client.query(
            `UPDATE account
       SET balance = balance - $1
       WHERE accountno = $2 AND balance >= $1`,
            [transfer_amount, source_account]
        );

        if (updateSource.rowCount === 0) {
            // Insufficient funds or invalid source account.
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "Insufficient funds or invalid source account" });
        }

        // Add the transfer amount to the target account.
        await client.query(
            `UPDATE account
       SET balance = balance + $1
       WHERE accountno = $2`,
            [transfer_amount, target_account]
        );

        // Insert the transaction record.
        await client.query(
            `INSERT INTO transaction_history (transactionamount, transactiontime, branchid, accountno1, accountno2)
       VALUES ($1, CURRENT_TIMESTAMP, 1, $2, $3)`,
            [transfer_amount, source_account, target_account]
        );

        await client.query('COMMIT');
        res.status(200).json({ message: "Transfer successful" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transfer Error: ', err);
        res.status(500).json({ error: "Transfer failed" });
    } finally {
        client.release();
    }
});

// ---------- Endpoint: Fetch Users ---------- //
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT userid, name, address FROM users'); // Include the address field
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Accounts with User and Branch Details
app.get('/accounts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.accountno, 
        a.balance, 
        COALESCE(u.name, 'N/A') AS username, 
        COALESCE(b.branchid, -1) AS branchid, -- Replace NULL with -1 for branchid
        COALESCE(b.branchadd, 'N/A') AS branchaddress -- Replace NULL with 'N/A' for branchadd
      FROM account a
      LEFT JOIN users u ON a.userid = u.userid
      LEFT JOIN branch b ON a.branchid = b.branchid
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Loans with User and Bank Details
app.get('/loans', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.loanid, 
        COALESCE(u.name, 'N/A') AS username, 
        l.loanamount, 
        l.duration, 
        l.interest, 
        l.loantype, 
        COALESCE(b.bankname, 'N/A') AS bankname, 
        l.issuedate
      FROM loan l
      LEFT JOIN users u ON l.userid = u.userid
      LEFT JOIN bank b ON l.bankid = b.bankid
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Branches
app.get('/branches', async (req, res) => {
  try {
    const result = await pool.query('SELECT branchid FROM branch'); // Fetch all branches
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Bank Information
app.get('/banks', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bankid, 
        bankname, 
        bankmoney, 
        noofbranches
      FROM bank
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching bank information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Fetch User Details ---------- //
app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE userid = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------- Endpoint: Fetch Accounts for a User ---------- //
app.get('/user/:userId/accounts', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM account WHERE userid = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Transactions for All User Accounts
app.get('/user/:userId/transactions', async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch all accounts owned by the user
    const accountsResult = await pool.query('SELECT accountno FROM account WHERE userid = $1', [userId]);
    const accountNumbers = accountsResult.rows.map((row) => row.accountno);

    if (accountNumbers.length === 0) {
      return res.status(200).json([]); // No accounts, return empty array
    }

    // Fetch transactions involving any of the user's accounts
    const transactionsResult = await pool.query(
      `
      SELECT 
        t.transactionid, 
        t.transactiontime, 
        t.transactionamount, 
        t.accountno1, 
        t.accountno2
      FROM transaction_history t
      WHERE t.accountno1 = ANY($1) OR t.accountno2 = ANY($1)
      ORDER BY t.transactiontime DESC
      `,
      [accountNumbers]
    );

    res.status(200).json(transactionsResult.rows);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Loans for All User Accounts
app.get('/user/:userId/loans', async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch loans associated with the user
    const loansResult = await pool.query(
      `
      SELECT 
        l.loanid, 
        l.loantype, 
        l.loanamount, 
        l.interest, 
        l.duration, 
        l.issuedate, 
        b.bankname AS issuedby
      FROM loan l
      JOIN bank b ON l.bankid = b.bankid
      WHERE l.userid = $1
      ORDER BY l.issuedate DESC
      `,
      [userId]
    );

    res.status(200).json(loansResult.rows);
  } catch (error) {
    console.error('Error fetching user loans:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Users by Branch ID
app.get('/users/:branchId', async (req, res) => {
  const { branchId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT u.userid, u.name, u.address
      FROM users u
      JOIN account a ON u.userid = a.userid
      WHERE a.branchid = $1
      `,
      [branchId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Accounts by Branch ID
app.get('/accounts/:branchId', async (req, res) => {
  const { branchId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        a.accountno, 
        a.balance, 
        COALESCE(u.name, 'N/A') AS username, 
        COALESCE(b.branchid, -1) AS branchid, 
        COALESCE(b.branchadd, 'N/A') AS branchaddress
      FROM account a
      LEFT JOIN users u ON a.userid = u.userid
      LEFT JOIN branch b ON a.branchid = b.branchid
      WHERE a.branchid = $1
      `,
      [branchId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Loans by Branch ID
app.get('/loans/:branchId', async (req, res) => {
  const { branchId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        l.loanid, 
        l.loanamount, 
        l.duration, 
        l.interest, 
        l.loantype, 
        l.issuedate, 
        COALESCE(u.name, 'N/A') AS username, 
        COALESCE(b.bankname, 'N/A') AS bankname
      FROM loan l
      JOIN users u ON l.userid = u.userid
      JOIN account a ON u.userid = a.userid
      JOIN branch br ON a.branchid = br.branchid
      JOIN bank b ON l.bankid = b.bankid
      WHERE br.branchid = $1
      ORDER BY l.issuedate DESC
      `,
      [branchId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Bank and Branch Info by Branch ID
app.get('/bank-info/:branchId', async (req, res) => {
  const { branchId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        br.branchid, 
        br.branchadd, 
        b.bankid, 
        b.bankname, 
        b.bankmoney
      FROM branch br
      JOIN bank b ON br.bankid = b.bankid
      WHERE br.branchid = $1
      `,
      [branchId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No bank or branch information found for the given branch ID.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching bank and branch info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Register a New User
app.post('/customer/register', async (req, res) => {
  const { name, address, mobilenumber } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO users (name, address, mobilenumber)
      VALUES ($1, $2, $3)
      RETURNING userid
      `,
      [name, address, mobilenumber]
    );

    res.status(201).json({ userid: result.rows[0].userid });
  } catch (error) {
    console.error('Error registering new user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Open a New Account
app.post('/user/:userId/open-account', async (req, res) => {
  const { userId } = req.params;
  const { branchId, startingBalance } = req.body; // Remove bankId

  try {
    // Ensure the starting balance is at least 1000
    if (startingBalance < 1000) {
      return res.status(400).json({ error: 'Starting balance must be at least ₹1000.' });
    }

    // Insert the new account into the database
    const result = await pool.query(
      `
      INSERT INTO account (userid, branchid, balance)
      VALUES ($1, $2, $3)
      RETURNING accountno
      `,
      [userId, branchId, startingBalance]
    );

    res.status(201).json({ accountNo: result.rows[0].accountno });
  } catch (error) {
    console.error('Error opening new account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Branches by Bank ID
app.get('/branches/:bankId', async (req, res) => {
  const { bankId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT branchid, branchadd
      FROM branch
      WHERE bankid = $1
      `,
      [bankId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch User Accounts by Bank ID and User ID
app.get('/accounts/:bankId/:userId', async (req, res) => {
  const { bankId, userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT a.accountno, a.balance
      FROM account a
      JOIN branch b ON a.branchid = b.branchid
      WHERE b.bankid = $1 AND a.userid = $2
      `,
      [bankId, userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Issue Loan
app.post('/issue-loan', async (req, res) => {
  const { userId, accountNo, loanAmount, duration, interest, loanType, employeeId } = req.body;

  try {
    // Fetch the bank ID and bank money for the employee's branch
    const bankResult = await pool.query(
      `
      SELECT b.bankid, b.bankmoney
      FROM employee e
      JOIN branch br ON e.branchid = br.branchid
      JOIN bank b ON br.bankid = b.bankid
      WHERE e.employeeid = $1
      `,
      [employeeId]
    );

    if (bankResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bank not found for the employee.' });
    }

    const { bankid, bankmoney } = bankResult.rows[0];

    // Check if the loan amount exceeds the bank money
    if (loanAmount > bankmoney) {
      return res.status(400).json({ error: 'Loan amount exceeds available bank money.' });
    }

    // Insert the loan into the loan table
    const loanResult = await pool.query(
      `
      INSERT INTO loan (loanamount, duration, interest, loantype, issuedate, userid, bankid)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6)
      RETURNING loanid
      `,
      [loanAmount, duration, interest, loanType, userId, bankid]
    );

    // Subtract the loan amount from the bank money
    await pool.query(
      `
      UPDATE bank
      SET bankmoney = bankmoney - $1
      WHERE bankid = $2
      `,
      [loanAmount, bankid]
    );

    // Add the loan amount to the user's account balance
    await pool.query(
      `
      UPDATE account
      SET balance = balance + $1
      WHERE accountno = $2
      `,
      [loanAmount, accountNo]
    );

    res.status(201).json({ loanId: loanResult.rows[0].loanid });
  } catch (error) {
    console.error('Error issuing loan:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint: Fetch Users by Bank ID
app.get('/users-by-bank/:bankId', async (req, res) => {
  const { bankId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT DISTINCT u.userid, u.name, u.address
      FROM users u
      JOIN account a ON u.userid = a.userid
      JOIN branch b ON a.branchid = b.branchid
      WHERE b.bankid = $1
      `,
      [bankId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users by bank:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, async () => {
  console.log(`Server is starting on http://localhost:${port}`);
  await checkDatabaseConnection(); // Check database connection when the server starts
});
