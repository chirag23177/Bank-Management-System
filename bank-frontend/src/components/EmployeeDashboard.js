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

      if (!employeeInfo || !employeeInfo.BranchID) {
        console.error('Employee branch ID is not available.');
        return;
      }

      const response = await fetch(`http://localhost:5000/users/${employeeInfo.BranchID}`);
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

      if (!employeeInfo || !employeeInfo.BranchID) {
        console.error('Employee branch ID is not available.');
        return;
      }

      const response = await fetch(`http://localhost:5000/accounts/${employeeInfo.BranchID}`);
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
      setShowUsers(false);
      setShowAccounts(false);
      setShowLoans(false);
      setShowBanks(false);

      if (!employeeInfo || !employeeInfo.BranchID) {
        console.error('Employee branch ID is not available.');
        return;
      }

      const response = await fetch(`http://localhost:5000/loans/${employeeInfo.BranchID}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Loans:', data); // Debugging
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

      if (!employeeInfo || !employeeInfo.BranchID) {
        console.error('Employee branch ID is not available.');
        return;
      }

      const response = await fetch(`http://localhost:5000/bank-info/${employeeInfo.BranchID}`);
      if (response.ok) {
        const data = await response.json();
        setBanks([data]); // Store the bank info in an array for consistency
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
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userid}>
                    <td>{user.userid}</td>
                    <td>{user.name}</td>
                    <td>{user.address}</td>
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
            <table>
              <thead>
                <tr>
                  <th>Account No</th>
                  <th>User Name</th>
                  <th>Branch (ID with Address)</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.accountno}>
                    <td>{account.accountno}</td>
                    <td>{account.username}</td>
                    <td>{account.branchid} - {account.branchaddress}</td>
                    <td>{account.balance}</td>
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
            <table>
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>User Name</th>
                  <th>Loan Amount</th>
                  <th>Duration</th>
                  <th>Interest</th>
                  <th>Loan Type</th>
                  <th>Issued by Bank</th>
                  <th>Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.loanid}>
                    <td>{loan.loanid}</td>
                    <td>{loan.username}</td>
                    <td>{loan.loanamount}</td>
                    <td>{loan.duration}</td>
                    <td>{loan.interest}</td>
                    <td>{loan.loantype}</td>
                    <td>{loan.bankname}</td>
                    <td>{loan.issuedate}</td>
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
      {showBanks && banks.length > 0 && (
        <section className="data-section">
          <h4>Bank Information</h4>
          <div className="bank-info">
            <p><strong>Branch ID:</strong> {banks[0].branchid}</p>
            <p><strong>Branch Address:</strong> {banks[0].branchadd}</p>
            <p><strong>Bank ID:</strong> {banks[0].bankid}</p>
            <p><strong>Bank Name:</strong> {banks[0].bankname}</p>
            <p><strong>Bank Money:</strong> ₹{banks[0].bankmoney}</p>
          </div>
        </section>
      )}
    </div>
  );
}

export default EmployeeDashboard;