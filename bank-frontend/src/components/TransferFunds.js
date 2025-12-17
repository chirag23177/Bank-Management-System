import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TransferFunds() {
  const [sourceAccount, setSourceAccount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleTransfer = async (e) => {
    e.preventDefault();

    const payload = {
      source_account: sourceAccount,
      target_account: targetAccount,
      transfer_amount: parseFloat(transferAmount),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/transfer-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Transfer failed');
      }
    } catch (error) {
      console.error('Error during transfer:', error);
      setMessage('Error: Could not connect to the server.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Back and Logout Buttons */}
      <div className="top-buttons">
        <button onClick={handleBack} className="back-button">Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <header style={{ marginBottom: '20px' }}>
        <h1>Transfer Funds</h1>
      </header>
      <form onSubmit={handleTransfer} style={{ background: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="sourceAccount" style={{ display: 'block', marginBottom: '5px' }}>
            Source Account:
          </label>
          <input
            type="text"
            id="sourceAccount"
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
            placeholder="Enter your source account number"
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="targetAccount" style={{ display: 'block', marginBottom: '5px' }}>
            Target Account:
          </label>
          <input
            type="text"
            id="targetAccount"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
            placeholder="Enter the target account number"
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="transferAmount" style={{ display: 'block', marginBottom: '5px' }}>
            Transfer Amount:
          </label>
          <input
            type="number"
            id="transferAmount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter the amount to transfer"
            required
            step="0.01"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
        >
          Execute Transfer
        </button>
      </form>
      {message && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default TransferFunds;
