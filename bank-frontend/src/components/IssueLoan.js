import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './IssueLoan.css';

function IssueLoan() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [interest, setInterest] = useState('');
  const [loanType, setLoanType] = useState('');
  const [bankMoney, setBankMoney] = useState(0);
  const [bankId, setBankId] = useState(null);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/bank-info/${employeeId}`);
        if (response.ok) {
          const data = await response.json();
          setBankId(data.bankid);
          setBankMoney(data.bankmoney);
          fetchUsers(data.bankid);
        } else {
          console.error('Error fetching bank info');
        }
      } catch (error) {
        console.error('Error fetching bank info:', error);
      }
    };

    fetchBankInfo();
  }, [employeeId]);

  const fetchUsers = async (bankId) => {
    try {
      const response = await fetch(`http://localhost:5000/users-by-bank/${bankId}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccounts = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/accounts/${bankId}/${userId}`);
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

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setSelectedAccount('');
    if (userId) {
      fetchAccounts(userId);
    } else {
      setAccounts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/issue-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          accountNo: selectedAccount,
          loanAmount: parseFloat(loanAmount),
          duration: parseInt(duration),
          interest: parseFloat(interest),
          loanType,
          employeeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Loan issued successfully! Loan ID: ${data.loanId}`);
        navigate(`/employee-dashboard/${employeeId}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to issue loan. Please try again.');
      }
    } catch (error) {
      console.error('Error issuing loan:', error);
      alert('Failed to issue loan. Please try again.');
    }
  };

  return (
    <div className="issue-loan-container">
      {/* Back and Logout Buttons */}
      <div className="top-buttons">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="back-button"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/')} // Navigate to the login page
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <h2>Issue Loan</h2>
      <form onSubmit={handleSubmit} className="issue-loan-form">
        <div className="form-group">
          <label htmlFor="user">Select User:</label>
          <select id="user" value={selectedUser} onChange={handleUserChange} required>
            <option value="">-- Select a User --</option>
            {users.map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.userid} - {user.name}
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <div className="form-group">
            <label htmlFor="account">Select Account:</label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">-- Select an Account --</option>
              {accounts.map((account) => (
                <option key={account.accountno} value={account.accountno}>
                  {account.accountno} - Balance: ₹{account.balance}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount (Max ₹{bankMoney}):</label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            required
            min="1"
            max={bankMoney}
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (Months):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in months"
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="interest">Interest (%):</label>
          <input
            type="number"
            id="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Enter interest rate"
            required
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="loanType">Loan Type:</label>
          <select
            id="loanType"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            required
          >
            <option value="">-- Select Loan Type --</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Car Loan">Car Loan</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Education Loan">Education Loan</option>
          </select>
        </div>
        <button type="submit" className="issue-loan-button">
          Submit Loan
        </button>
      </form>
    </div>
  );
}

export default IssueLoan;