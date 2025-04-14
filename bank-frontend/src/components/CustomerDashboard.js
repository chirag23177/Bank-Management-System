import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Keep your CSS styling

function CustomerDashboard() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setCustomerInfo(data);
        } else {
          console.error('Customer not found');
        }
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer/${customerId}/accounts`);
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error('Error fetching accounts');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchCustomerInfo();
    fetchAccounts();
  }, [customerId]);

  const redirectToTransferPage = () => {
    window.location.href = 'http://localhost:3000/transfer-funds';
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="customer-dashboard-container">
      <div className="top-buttons">
        <button onClick={handleBack} className="back-button">Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <header className="dashboard-header">
        <h1>Customer Dashboard</h1>
      </header>

      {customerInfo ? (
        <section className="customer-info">
          <h2>Welcome, {customerInfo.Name}</h2>
          <div className="info-card">
            <p><strong>Customer ID:</strong> {customerInfo.UserID}</p>
            <p><strong>Name:</strong> {customerInfo.Name}</p>
            <p><strong>Mobile Number:</strong> {customerInfo.MobileNumber}</p>
            <p><strong>Address:</strong> {customerInfo.Address}</p>
          </div>
        </section>
      ) : (
        <p className="loading-message">Loading customer information...</p>
      )}

      <section className="accounts-section">
        <h3>Your Accounts</h3>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.AccountNo} className="data-card">
              <p><strong>Account No:</strong> {account.AccountNo}</p>
              <p><strong>Balance:</strong> ₹{account.Balance}</p>
            </div>
          ))
        ) : (
          <p>No accounts available.</p>
        )}
      </section>

      {/* Transfer Funds Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={redirectToTransferPage}
          className="transfer-button"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Transfer Funds
        </button>
      </div>

      <section className="transactions-section">
        <h3>Your Transactions</h3>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.TransactionID} className="data-card">
              <p><strong>Transaction ID:</strong> {tx.TransactionID}</p>
              <p><strong>Amount:</strong> ₹{tx.TransactionAmount}</p>
            </div>
          ))
        ) : (
          <p>No transactions available.</p>
        )}
      </section>

      <section className="loans-section">
        <h3>Your Loans</h3>
        {loans.length > 0 ? (
          loans.map((loan) => (
            <div key={loan.LoanID} className="data-card">
              <p><strong>Loan ID:</strong> {loan.LoanID}</p>
              <p><strong>Loan Amount:</strong> ₹{loan.LoanAmount}</p>
              <p><strong>Interest:</strong> {loan.Interest}%</p>
            </div>
          ))
        ) : (
          <p>No loans available.</p>
        )}
      </section>
    </div>
  );
}

export default CustomerDashboard;
