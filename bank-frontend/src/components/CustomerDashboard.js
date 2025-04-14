import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomerDashboard() {
  const { customerId } = useParams();
  const [customerInfo, setCustomerInfo] = useState({
    UserID: customerId,
    Name: "Amit Sharma",
    MobileNumber: "9876543210",
    Address: "123 MG Road, Bengaluru, Karnataka - 560001"
  });
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  // Use useEffect to fetch data from your API endpoints when the component mounts
  useEffect(() => {
    // Example:
    // fetch(`http://localhost:5000/customers/${customerId}/accounts`)
    //   .then(res => res.json())
    //   .then(data => setAccounts(data));

    // Similarly, fetch transactions and loans.
  }, [customerId]);

  return (
    <div className="container">
      <header>
        <h1>Customer Dashboard</h1>
      </header>
      <h2>Welcome, {customerInfo.Name}</h2>
      <section>
        <h3>Personal Information</h3>
        <p><strong>Customer ID:</strong> {customerInfo.UserID}</p>
        <p><strong>Name:</strong> {customerInfo.Name}</p>
        <p><strong>Mobile Number:</strong> {customerInfo.MobileNumber}</p>
        <p><strong>Address:</strong> {customerInfo.Address}</p>
      </section>
      <section>
        <h3>Your Accounts</h3>
        {/* Map through accounts array and display account info */}
        {accounts.length === 0 ? (
          <p>No accounts to display.</p>
        ) : (
          accounts.map((acc) => (
            <div key={acc.AccountNo}>
              <p>Account No: {acc.AccountNo} | Balance: {acc.Balance}</p>
            </div>
          ))
        )}
      </section>
      <section>
        <h3>Your Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions to display.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.TransactionID}>
              <p>Tx ID: {tx.TransactionID} | Amount: {tx.TransactionAmount}</p>
            </div>
          ))
        )}
      </section>
      <section>
        <h3>Your Loans</h3>
        {loans.length === 0 ? (
          <p>No loans to display.</p>
        ) : (
          loans.map((loan) => (
            <div key={loan.LoanID}>
              <p>Loan ID: {loan.LoanID} | Amount: {loan.LoanAmount} | Interest: {loan.Interest}%</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default CustomerDashboard;
