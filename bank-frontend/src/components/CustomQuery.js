import React, { useState } from 'react';

function CustomQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleRunQuery = async (e) => {
    e.preventDefault();
    // Send the custom SQL query to your backend endpoint; this endpoint
    // should be secured and validate the query to avoid SQL injection.
    try {
      const response = await fetch('http://localhost:5000/custom-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if(response.ok) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
        setMessage('Query executed successfully.');
      } else {
        setMessage('Error executing query.');
      }
    } catch (error) {
      setMessage('Error: Could not connect to the server.');
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
            style={{ width: '100%' }}
            required
          ></textarea>
        </div>
        <button type="submit">Run Query</button>
      </form>
      {message && <p>{message}</p>}
      {result && <pre>{result}</pre>}
    </div>
  );
}

export default CustomQuery;
