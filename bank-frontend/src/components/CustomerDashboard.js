import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Keep your CSS styling

function CustomerDashboard() {
  const { userId } = useParams(); // Extract userId from the URL
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchAccounts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/accounts`);
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

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/transactions`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error('Error fetching transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchLoans = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/loans`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Loans:', data); // Debugging
          setLoans(data);
        } else {
          console.error('Error fetching loans');
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };

    fetchUserInfo();
    fetchAccounts();
    fetchTransactions();
    fetchLoans();
  }, [userId]);

  const redirectToTransferPage = () => {
    navigate('/transfer-funds');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const formatTransactionType = (transaction, userAccounts) => {
    if (userAccounts.includes(transaction.accountno1)) {
      return {
        type: 'Sent',
        account: `To: Account #${transaction.accountno2}`,
        amount: `- ₹${transaction.transactionamount}`,
      };
    } else {
      return {
        type: 'Received',
        account: `From: Account #${transaction.accountno1}`,
        amount: `+ ₹${transaction.transactionamount}`,
      };
    }
  };

  return (
    <div className="customer-dashboard-container">
      <div className="top-buttons">
        <button onClick={handleBack} className="back-button">Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
      </header>

      {userInfo ? (
        <section className="customer-info">
          <h2>Welcome, {userInfo.name}</h2>
          <div className="info-card">
            <p><strong>User ID:</strong> {userInfo.userid}</p>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Mobile Number:</strong> {userInfo.mobilenumber}</p>
            <p><strong>Address:</strong> {userInfo.address}</p>
          </div>
        </section>
      ) : (
        <p className="loading-message">Loading user information...</p>
      )}

      <section className="accounts-section">
        <h3>Your Accounts</h3>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.accountno} className="data-card">
              <p><strong>Account No:</strong> {account.accountno}</p>
              <p><strong>Balance:</strong> ₹{account.balance}</p>
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
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Account</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const { type, account, amount } = formatTransactionType(transaction, accounts.map((acc) => acc.accountno));
                return (
                  <tr key={transaction.transactionid}>
                    <td>{transaction.transactionid}</td>
                    <td>{new Date(transaction.transactiontime).toLocaleString()}</td>
                    <td>{type}</td>
                    <td>{account}</td>
                    <td>{amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No transactions available.</p>
        )}
      </section>

      <section className="loans-section">
        <h3>Your Loans</h3>
        {loans.length > 0 ? (
          <table className="loans-table">
            <thead>
              <tr>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Interest</th>
                <th>Duration</th>
                <th>Issued By</th>
                <th>Issued On</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loanid}>
                  <td>{loan.loantype}</td>
                  <td>₹{loan.loanamount}</td>
                  <td>{loan.interest}%</td>
                  <td>{loan.duration} months</td>
                  <td>{loan.issuedby}</td>
                  <td>{new Date(loan.issuedate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No loans available.</p>
        )}
      </section>
    </div>
  );
}

export default CustomerDashboard;
