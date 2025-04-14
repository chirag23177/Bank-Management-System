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

  /**
   * Renders the query result as a table.
   * Automatically generates columns from the keys in the first row.
   */
  const renderTable = () => {
    // If result isn't an array or is empty, display a message
    if (!Array.isArray(result) || result.length === 0) {
      return <p>No data to display.</p>;
    }

    // Extract column headers from the keys of the first row
    const columns = Object.keys(result[0]);

    return (
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  backgroundColor: '#f2f2f2',
                  textTransform: 'capitalize',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ border: '1px solid #ddd' }}>
              {columns.map((col) => (
                <td key={col} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header>
        <h1>SQL Query Tool</h1>
      </header>

      {/* Query Editor */}
      <form onSubmit={handleRunQuery} style={{ marginBottom: '20px' }}>
        <label htmlFor="query">
          <strong>Enter SQL Query:</strong>
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows="6"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            marginBottom: '10px',
            fontFamily: 'monospace',
          }}
          placeholder="SELECT * FROM users;"
          required
        ></textarea>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Run Query
        </button>
      </form>

      {/* Status / Message */}
      {message && (
        <p style={{ marginBottom: '20px', fontWeight: 'bold', color: message.includes('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}

      {/* Query Results */}
      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
        {result && renderTable()}
      </div>
    </div>
  );
}

export default CustomQuery;
