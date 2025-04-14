import React, { useState } from 'react';
import './CustomQuery.css'; // Add a CSS file for custom styles

function CustomQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleRunQuery = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/custom-query', {
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

  const renderResult = () => {
    if (!result) return null;

    if (Array.isArray(result) && result.length > 0) {
      // Render as a table if the result is an array of objects
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
      // Render as key-value pairs if the result is a single object
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
      // Render as plain text for other types of results
      return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="custom-query-container">
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
