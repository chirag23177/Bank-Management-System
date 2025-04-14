import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './EmployeeDashboard.css'; // Add a CSS file for custom styles

function EmployeeDashboard() {
  const { employeeId } = useParams(); // Extract employeeId from the URL
  const navigate = useNavigate(); // For navigation
  const [employeeInfo, setEmployeeInfo] = useState(null); // Initialize as null
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [totalBranches, setTotalBranches] = useState(0);
  const [users, setUsers] = useState([]); // State to store users
  const [showUsers, setShowUsers] = useState(false); // State to toggle user list visibility
  const [accounts, setAccounts] = useState([]); // State to store accounts
  const [showAccounts, setShowAccounts] = useState(false); // State to toggle account list visibility
  const [loans, setLoans] = useState([]); // State to store loans
  const [showLoans, setShowLoans] = useState(false); // State to toggle loan list visibility
  const [banks, setBanks] = useState([]); // State to store bank information
  const [showBanks, setShowBanks] = useState(false); // State to toggle bank info visibility

  useEffect(() => {
    // Fetch employee information from the backend
    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/employee/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ employeeId }),
        });

        if (response.ok) {
          const data = await response.json();
          setEmployeeInfo(data);
        } else {
          console.error('Error fetching employee information');
        }
      } catch (error) {
        console.error('Error fetching employee information:', error);
      }
    };

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5000/users');
        const accountsResponse = await fetch('http://localhost:5000/accounts');
        const loansResponse = await fetch('http://localhost:5000/loans');
        const branchesResponse = await fetch('http://localhost:5000/branches');

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setTotalUsers(usersData.length);
        }

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          setTotalAccounts(accountsData.length); // Update total accounts count
        }

        if (loansResponse.ok) {
          const loansData = await loansResponse.json();
          setActiveLoans(loansData.length); // Update active loans count
        }

        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          setTotalBranches(branchesData.length); // Update branches count
        }
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    fetchEmployeeInfo();
    fetchDashboardStats();
  }, [employeeId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  const fetchUsers = async () => {
    try {
      // Reset all visibility states
      setShowUsers(false);
      setShowAccounts(false);
      setShowLoans(false);
      setShowBanks(false);

      const response = await fetch('http://localhost:5000/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setShowUsers(true); // Show the user list
      } else {
        console.error('Error fetching users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      // Reset all visibility states
      setShowUsers(false);
      setShowAccounts(false);
      setShowLoans(false);
      setShowBanks(false);

      const response = await fetch('http://localhost:5000/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        setShowAccounts(true); // Show the account list
      } else {
        console.error('Error fetching accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      // Reset all visibility states
      setShowUsers(false);
      setShowAccounts(false);
      setShowLoans(false);
      setShowBanks(false);

      const response = await fetch('http://localhost:5000/loans');
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
        setShowLoans(true); // Show the loan list
      } else {
        console.error('Error fetching loans');
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const fetchBanks = async () => {
    try {
      // Reset all visibility states
      setShowUsers(false);
      setShowAccounts(false);
      setShowLoans(false);
      setShowBanks(false);

      const response = await fetch('http://localhost:5000/banks');
      if (response.ok) {
        const data = await response.json();
        setBanks(data);
        setShowBanks(true); // Show the bank info
      } else {
        console.error('Error fetching bank information');
      }
    } catch (error) {
      console.error('Error fetching bank information:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Back and Logout Buttons */}
      <div className="top-buttons">
        <button onClick={handleBack} className="back-button">Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        {employeeInfo ? (
          <h2>Welcome, {employeeInfo.Name}</h2>
        ) : (
          <h2>Loading employee information...</h2>
        )}
      </header>

      <section className="employee-info">
        <h3>Employee Information</h3>
        {employeeInfo ? (
          <div className="info-card">
            <p><strong>Employee ID:</strong> {employeeInfo.EmployeeID}</p>
            <p><strong>Name:</strong> {employeeInfo.Name}</p>
            <p><strong>Branch ID:</strong> {employeeInfo.BranchID}</p>
          </div>
        ) : (
          <p>Loading employee information...</p>
        )}
      </section>

      {/* UI Cards for Dashboard Statistics */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h4>Total Accounts</h4>
          <p>{totalAccounts}</p>
        </div>
        <div className="stat-card">
          <h4>Active Loans</h4>
          <p>{activeLoans}</p>
        </div>
        <div className="stat-card">
          <h4>Branches</h4>
          <p>{totalBranches}</p>
        </div>
      </section>

      {/* Navigation Buttons */}
      <nav className="dashboard-nav">
        <ul className="nav-tabs">
          <li>
            <button
              onClick={fetchUsers}
              className="nav-button"
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={fetchAccounts}
              className="nav-button"
            >
              Accounts
            </button>
          </li>
          <li>
            <button
              onClick={fetchLoans}
              className="nav-button"
            >
              Loans
            </button>
          </li>
          <li>
            <button
              onClick={fetchBanks}
              className="nav-button"
            >
              Bank Info
            </button>
          </li>
          <li><Link to="/custom-query" className="nav-button">Custom Query</Link></li>
        </ul>
      </nav>

      {/* Display Users */}
      {showUsers && (
        <section className="data-section">
          <h4>Users</h4>
          {users.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>User ID</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userid}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.userid}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users to display.</p>
          )}
        </section>
      )}

      {/* Display Accounts */}
      {showAccounts && (
        <section className="data-section">
          <h4>Accounts</h4>
          {accounts.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Account No</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>User Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Branch (ID with Address)</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.accountno}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{account.accountno}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{account.username}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      {account.branchid} - {account.branchaddress}
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{account.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No accounts to display.</p>
          )}
        </section>
      )}

      {/* Display Loans */}
      {showLoans && (
        <section className="data-section">
          <h4>Loans</h4>
          {loans.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Loan ID</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>User Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Loan Amount</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Duration</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Interest</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Loan Type</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Issued by Bank</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanid}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.loanid}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.username}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.loanamount}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.duration}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.interest}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.loantype}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.bankname}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{loan.issuedate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No loans to display.</p>
          )}
        </section>
      )}

      {/* Display Bank Information */}
      {showBanks && (
        <section className="data-section">
          <h4>Bank Information</h4>
          {banks.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Bank ID</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Bank Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>Bank Money</th>
                  <th style={{ border: '1px solid #ccc', padding: '10px' }}>No of Branches</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.bankid}>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{bank.bankid}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{bank.bankname}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{bank.bankmoney}</td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{bank.noofbranches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No bank information to display.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default EmployeeDashboard;