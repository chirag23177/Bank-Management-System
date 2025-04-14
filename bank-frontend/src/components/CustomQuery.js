import React, { useState } from 'react';

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

  return (
    <div className="container">
      <header>
        <h1>Custom Query</h1>
      </header>
      <form onSubmit={handleRunQuery}>
        <div>
          <label>Enter SQL Query:</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="6"
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            placeholder="Enter your SQL query here..."
            required
          ></textarea>
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>
          Run Query
        </button>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      {result && (
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', marginTop: '10px' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default CustomQuery;
