import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CustomQuery.css'; // Add a CSS file for custom styles

function CustomQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleRunQuery = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/custom-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setMessage('Query executed successfully.');
      } else {
        setMessage('Error executing query.');
        setResult(null);
      }
    } catch (error) {
      console.error('Error executing custom query:', error);
      setMessage('Error: Could not connect to the server.');
      setResult(null);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  const renderResult = () => {
    if (!result) return null;

    if (Array.isArray(result) && result.length > 0) {
      const headers = Object.keys(result[0]);
      return (
        <table className="query-result-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (typeof result === 'object') {
      return (
        <div className="query-result-object">
          {Object.entries(result).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      );
    } else {
      return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="custom-query-container">
      {/* Back and Logout Buttons */}
      <div className="top-buttons">
        <button onClick={handleBack} className="back-button">Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <header className="custom-query-header">
        <h1>Custom Query</h1>
        <p>Run your SQL queries directly and view the results below.</p>
      </header>
      <form className="custom-query-form" onSubmit={handleRunQuery}>
        <div className="form-group">
          <label htmlFor="query">Enter SQL Query:</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="6"
            placeholder="Enter your SQL query here..."
            required
          ></textarea>
        </div>
        <button type="submit" className="run-query-button">
          Run Query
        </button>
      </form>
      {message && <p className="query-message">{message}</p>}
      <div className="query-result">
        {renderResult()}
      </div>
    </div>
  );
}

export default CustomQuery;
