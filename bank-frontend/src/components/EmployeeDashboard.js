import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function EmployeeDashboard() {
  const { employeeId } = useParams();
  const [employeeInfo, setEmployeeInfo] = useState({
    EmployeeID: employeeId,
    Name: "Rajesh Sharma",
    Branch: "Branch 1: Shahid Bhagat Singh Road, Mumbai, Maharashtra - 400001",
    Bank: "RBI"
  });
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bankInfo, setBankInfo] = useState({});

  useEffect(() => {
    // Fetch employee-related data using your API endpoints.
    // Example:
    // fetch(`http://localhost:5000/employees/${employeeId}/customers`)
    //   .then(res => res.json())
    //   .then(data => setCustomers(data));
  }, [employeeId]);

  return (
    <div className="container">
      <header>
        <h1>Employee Dashboard</h1>
      </header>
      <h2>Welcome, {employeeInfo.Name}</h2>
      <section>
        <h3>Employee Information</h3>
        <p><strong>Employee ID:</strong> {employeeInfo.EmployeeID}</p>
        <p><strong>Name:</strong> {employeeInfo.Name}</p>
        <p><strong>Branch:</strong> {employeeInfo.Branch}</p>
        <p><strong>Bank:</strong> {employeeInfo.Bank}</p>
      </section>
      <nav>
        <ul className="nav-tabs">
          <li><Link to="#">Customers</Link></li>
          <li><Link to="#">Accounts</Link></li>
          <li><Link to="#">Loans</Link></li>
          <li><Link to="#">Bank Info</Link></li>
          <li><Link to="/custom-query">Custom Query</Link></li>
        </ul>
      </nav>
      <section>
        <h3>Data Overview</h3>
        {/* Display fetched data for the tab selected. For now, we simply show placeholders. */}
        <div>
          <h4>Customers in your Branch</h4>
          {customers.length === 0 ? <p>No customers to display.</p> : customers.map(c => (
            <p key={c.UserID}>{c.Name} ({c.UserID})</p>
          ))}
        </div>
        <div>
          <h4>Accounts</h4>
          {accounts.length === 0 ? <p>No accounts to display.</p> : accounts.map(a => (
            <p key={a.AccountNo}>Account {a.AccountNo} - {a.Balance}</p>
          ))}
        </div>
        <div>
          <h4>Loans</h4>
          {loans.length === 0 ? <p>No loans to display.</p> : loans.map(l => (
            <p key={l.LoanID}>Loan {l.LoanID} : {l.LoanAmount}</p>
          ))}
        </div>
        <div>
          <h4>Bank Information</h4>
          {Object.keys(bankInfo).length === 0 ? <p>No bank info to display.</p> : (
            <p>{bankInfo.BankName} with {bankInfo.NoOfBranches} branches.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default EmployeeDashboard;
