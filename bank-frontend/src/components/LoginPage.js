import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('customer');
  const [id, setId] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginType === 'customer') {
      // In a real scenario, validate the customer via API call.
      navigate(`/customer-dashboard/${id}`);
    } else {
      // In a real scenario, validate the employee via API call.
      navigate(`/employee-dashboard/${id}`);
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
