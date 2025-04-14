import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('customer');
  const [id, setId] = useState('');

  const handleCustomerLogin = async (customerId) => {
    try {
      const response = await fetch('http://localhost:5000/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      if(response.ok) {
        const customerData = await response.json();
        // Save the customer data to state or context and redirect to the dashboard
        console.log('Customer logged in:', customerData);
      } else {
        // Handle error, e.g., customer not found
        console.error('Customer not found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Bank Management System</h1>
      </header>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <input
              type="radio"
              name="loginType"
              value="customer"
              checked={loginType === 'customer'}
              onChange={() => setLoginType('customer')}
            />{' '}
            Customer Login
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              name="loginType"
              value="employee"
              checked={loginType === 'employee'}
              onChange={() => setLoginType('employee')}
            />{' '}
            Employee Login
          </label>
        </div>
        <div>
          <label>{loginType === 'customer' ? 'Customer ID:' : 'Employee ID:'}</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
