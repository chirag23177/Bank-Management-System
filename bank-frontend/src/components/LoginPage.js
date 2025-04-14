import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Add a CSS file for custom styles

function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('customer');
  const [id, setId] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        loginType === 'customer'
          ? 'http://localhost:5000/customer/login'
          : 'http://localhost:5000/employee/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            loginType === 'customer' ? { customerId: id } : { employeeId: id }
          ),
        }
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (loginType === 'customer') {
        navigate(`/user-dashboard/${data.userid}`);
      } else {
        navigate(`/employee-dashboard/${data.EmployeeID}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Bank Management System</h1>
      </header>
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-type">
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
            <label>
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
          <div className="login-input">
            <label>
              {loginType === 'customer' ? 'Customer ID:' : 'Employee ID:'}
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter your ID"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
