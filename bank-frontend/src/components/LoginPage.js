import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Add a CSS file for custom styles

function LoginPage() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('customer');
  const [id, setId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [registerDetails, setRegisterDetails] = useState({
    name: '',
    address: '',
    mobilenumber: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        loginType === 'customer'
          ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/customer/login`
          : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/employee/login`,
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/customer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerDetails),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`User registered successfully! Your User ID is: ${data.userid}`);
        setIsRegistering(false); // Switch back to login
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Bank Management System</h1>
      </header>
      <div className="login-form-container">
        {isRegistering ? (
          <form onSubmit={handleRegister} className="register-form">
            <h2>Register as a New User</h2>
            <div className="register-input">
              <label>Name:</label>
              <input
                type="text"
                value={registerDetails.name}
                onChange={(e) =>
                  setRegisterDetails({ ...registerDetails, name: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="register-input">
              <label>Address:</label>
              <input
                type="text"
                value={registerDetails.address}
                onChange={(e) =>
                  setRegisterDetails({ ...registerDetails, address: e.target.value })
                }
                placeholder="Enter your address"
                required
              />
            </div>
            <div className="register-input">
              <label>Mobile Number:</label>
              <input
                type="text"
                value={registerDetails.mobilenumber}
                onChange={(e) =>
                  setRegisterDetails({
                    ...registerDetails,
                    mobilenumber: e.target.value,
                  })
                }
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
            <p
              className="switch-to-login"
              onClick={() => setIsRegistering(false)}
            >
              Back to Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
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
            {loginType === 'customer' && (
              <p
                className="register-link"
                onClick={() => setIsRegistering(true)}
              >
                Register as a new user
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
