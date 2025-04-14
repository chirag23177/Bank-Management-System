import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './EmployeeDashboard.css'; // Add a CSS file for custom styles

function EmployeeDashboard() {
  const { employeeId } = useParams(); // Extract employeeId from the URL
  const [employeeInfo, setEmployeeInfo] = useState(null); // Initialize as null
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bankInfo, setBankInfo] = useState({});

  useEffect(() => {
    // Fetch employee information from the backend
    const fetchEmployeeInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/employee/login', {
          method: 'POST', // Use POST method as defined in the backend
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify({ employeeId }), // Send employeeId in the request body
        });

        if (response.ok) {
          const data = await response.json();
          setEmployeeInfo(data); // Update the employeeInfo state with the fetched data
        } else {
          console.error('Error fetching employee information');
        }
      } catch (error) {
        console.error('Error fetching employee information:', error);
      }
    };

    fetchEmployeeInfo();
  }, [employeeId]);

  return (
    <div className="dashboard-container">
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

      <nav className="dashboard-nav">
        <ul className="nav-tabs">
          <li><Link to="#">Customers</Link></li>
          <li><Link to="#">Accounts</Link></li>
          <li><Link to="#">Loans</Link></li>
          <li><Link to="#">Bank Info</Link></li>
          <li><Link to="/custom-query">Custom Query</Link></li>
        </ul>
      </nav>

      <section className="data-overview">
        <h3>Data Overview</h3>
        <div className="data-section">
          <h4>Customers in your Branch</h4>
          {customers.length === 0 ? (
            <p>No customers to display.</p>
          ) : (
            customers.map(c => (
              <div key={c.UserID} className="data-card">
                <p>{c.Name} ({c.UserID})</p>
              </div>
            ))
          )}
        </div>

        <div className="data-section">
          <h4>Accounts</h4>
          {accounts.length === 0 ? (
            <p>No accounts to display.</p>
          ) : (
            accounts.map(a => (
              <div key={a.AccountNo} className="data-card">
                <p>Account {a.AccountNo} - Balance: ₹{a.Balance}</p>
              </div>
            ))
          )}
        </div>

        <div className="data-section">
          <h4>Loans</h4>
          {loans.length === 0 ? (
            <p>No loans to display.</p>
          ) : (
            loans.map(l => (
              <div key={l.LoanID} className="data-card">
                <p>Loan {l.LoanID}: ₹{l.LoanAmount}</p>
              </div>
            ))
          )}
        </div>

        <div className="data-section">
          <h4>Bank Information</h4>
          {Object.keys(bankInfo).length === 0 ? (
            <p>No bank info to display.</p>
          ) : (
            <div className="data-card">
              <p>{bankInfo.BankName} with {bankInfo.NoOfBranches} branches.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default EmployeeDashboard;
