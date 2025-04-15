import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './OpenAccount.css';

function OpenAccount() {
  const { userId } = useParams(); // Extract userId from the URL
  const navigate = useNavigate();

  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [startingBalance, setStartingBalance] = useState('');

  useEffect(() => {
    // Fetch available banks
    const fetchBanks = async () => {
      try {
        const response = await fetch('http://localhost:5000/banks');
        if (response.ok) {
          const data = await response.json();
          setBanks(data);
        } else {
          console.error('Error fetching banks');
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    fetchBanks();
  }, []);

  // Fetch branches dynamically based on the selected bank
  const fetchBranches = async (bankId) => {
    try {
      const response = await fetch(`http://localhost:5000/branches/${bankId}`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data);
      } else {
        console.error('Error fetching branches');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleBankChange = (e) => {
    const bankId = e.target.value;
    setSelectedBank(bankId);
    setSelectedBranch(''); // Reset branch selection
    if (bankId) {
      fetchBranches(bankId); // Fetch branches for the selected bank
    } else {
      setBranches([]); // Clear branches if no bank is selected
    }
  };

  const handleOpenAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/open-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchId: selectedBranch, // Only send branchId and startingBalance
          startingBalance: parseFloat(startingBalance),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Account opened successfully! Your Account Number is: ${data.accountNo}`);
        navigate(`/user-dashboard/${userId}`); // Redirect back to the dashboard
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to open account. Please try again.');
      }
    } catch (error) {
      console.error('Error opening account:', error);
      alert('Failed to open account. Please try again.');
    }
  };

  return (
    <div className="open-account-container">
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
      <h2>Open a New Account</h2>
      <form onSubmit={handleOpenAccount} className="open-account-form">
        <div className="form-group">
          <label htmlFor="bank">Select Bank:</label>
          <select
            id="bank"
            value={selectedBank}
            onChange={handleBankChange}
            required
          >
            <option value="">-- Select a Bank --</option>
            {banks.map((bank) => (
              <option key={bank.bankid} value={bank.bankid}>
                {bank.bankname}
              </option>
            ))}
          </select>
        </div>
        {selectedBank && (
          <div className="form-group">
            <label htmlFor="branch">Select Branch:</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              required
            >
              <option value="">-- Select a Branch --</option>
              {branches.map((branch) => (
                <option key={branch.branchid} value={branch.branchid}>
                  {branch.branchid} - {branch.branchadd}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="startingBalance">Starting Balance (Minimum ₹1000):</label>
          <input
            type="number"
            id="startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            placeholder="Enter starting balance"
            required
            min="1000"
          />
        </div>
        <button type="submit" className="open-account-button" disabled={!selectedBranch}>
          Open Account
        </button>
      </form>
    </div>
  );
}

export default OpenAccount;