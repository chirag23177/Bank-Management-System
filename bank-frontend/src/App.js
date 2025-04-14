import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CustomerDashboard from './components/CustomerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import CustomQuery from './components/CustomQuery';
import TransferFunds from './components/TransferFunds';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user-dashboard/:userId" element={<CustomerDashboard />} />
        <Route path="/employee-dashboard/:employeeId" element={<EmployeeDashboard />} />
        <Route path="/custom-query" element={<CustomQuery />} />
        <Route path="/transfer-funds" element={<TransferFunds />} />
      </Routes>
    </Router>
  );
}

export default App;
