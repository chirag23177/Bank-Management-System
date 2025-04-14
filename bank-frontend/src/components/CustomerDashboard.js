// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// function CustomerDashboard() {
//   const { customerId } = useParams();
//   const [customerInfo, setCustomerInfo] = useState({
//     UserID: customerId,
//     Name: "Amit Sharma",
//     MobileNumber: "9876543210",
//     Address: "123 MG Road, Bengaluru, Karnataka - 560001"
//   });
//   const [accounts, setAccounts] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [loans, setLoans] = useState([]);

//   // Use useEffect to fetch data from your API endpoints when the component mounts
//   useEffect(() => {
//     // Example:
//     // fetch(`http://localhost:5000/customers/${customerId}/accounts`)
//     //   .then(res => res.json())
//     //   .then(data => setAccounts(data));

//     // Similarly, fetch transactions and loans.
//   }, [customerId]);

//   return (
//     <div className="container">
//       <header>
//         <h1>Customer Dashboard</h1>
//       </header>
//       <h2>Welcome, {customerInfo.Name}</h2>
//       <section>
//         <h3>Personal Information</h3>
//         <p><strong>Customer ID:</strong> {customerInfo.UserID}</p>
//         <p><strong>Name:</strong> {customerInfo.Name}</p>
//         <p><strong>Mobile Number:</strong> {customerInfo.MobileNumber}</p>
//         <p><strong>Address:</strong> {customerInfo.Address}</p>
//       </section>
//       <section>
//         <h3>Your Accounts</h3>
//         {/* Map through accounts array and display account info */}
//         {accounts.length === 0 ? (
//           <p>No accounts to display.</p>
//         ) : (
//           accounts.map((acc) => (
//             <div key={acc.AccountNo}>
//               <p>Account No: {acc.AccountNo} | Balance: {acc.Balance}</p>
//             </div>
//           ))
//         )}
//       </section>
//       <section>
//         <h3>Your Transactions</h3>
//         {transactions.length === 0 ? (
//           <p>No transactions to display.</p>
//         ) : (
//           transactions.map((tx) => (
//             <div key={tx.TransactionID}>
//               <p>Tx ID: {tx.TransactionID} | Amount: {tx.TransactionAmount}</p>
//             </div>
//           ))
//         )}
//       </section>
//       <section>
//         <h3>Your Loans</h3>
//         {loans.length === 0 ? (
//           <p>No loans to display.</p>
//         ) : (
//           loans.map((loan) => (
//             <div key={loan.LoanID}>
//               <p>Loan ID: {loan.LoanID} | Amount: {loan.LoanAmount} | Interest: {loan.Interest}%</p>
//             </div>
//           ))
//         )}
//       </section>
//     </div>
//   );
// }

// export default CustomerDashboard;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CustomerDashboard() {
    const { customerId } = useParams();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loans, setLoans] = useState([]);

    // Fetch customer information
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

        // Fetch accounts associated with the customer
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

        // For now, leaving transactions and loans empty.
        // If endpoints exist, you can add similar fetch calls for transactions/loans.

        fetchCustomerInfo();
        fetchAccounts();
    }, [customerId]);

    return (
        <div className="container">
            <header>
                <h1>Customer Dashboard</h1>
            </header>
            {customerInfo ? (
                <div>
                    <h2>Welcome, {customerInfo.Name}</h2>
                    <section>
                        <h3>Personal Information</h3>
                        <p><strong>Customer ID:</strong> {customerInfo.UserID}</p>
                        <p><strong>Name:</strong> {customerInfo.Name}</p>
                        <p><strong>Mobile Number:</strong> {customerInfo.MobileNumber}</p>
                        <p><strong>Address:</strong> {customerInfo.Address}</p>
                    </section>
                </div>
            ) : (
                <p>Loading customer information...</p>
            )}
            <section>
                <h3>Your Accounts</h3>
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account.AccountNo} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>Account No:</strong> {account.AccountNo}</p>
                            <p><strong>Balance:</strong> {account.Balance}</p>
                        </div>
                    ))
                ) : (
                    <p>No accounts available.</p>
                )}
            </section>
            <section>
                <h3>Your Transactions</h3>
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.TransactionID} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>Transaction ID:</strong> {tx.TransactionID}</p>
                            <p><strong>Amount:</strong> {tx.TransactionAmount}</p>
                        </div>
                    ))
                ) : (
                    <p>No transactions available.</p>
                )}
            </section>
            <section>
                <h3>Your Loans</h3>
                {loans.length > 0 ? (
                    loans.map((loan) => (
                        <div key={loan.LoanID} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>Loan ID:</strong> {loan.LoanID}</p>
                            <p><strong>Loan Amount:</strong> {loan.LoanAmount}</p>
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