import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CustomerDashboard from './components/CustomerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import CustomQuery from './components/CustomQuery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/customer-dashboard/:customerId" element={<CustomerDashboard />} />
        <Route path="/employee-dashboard/:employeeId" element={<EmployeeDashboard />} />
        <Route path="/custom-query" element={<CustomQuery />} />
      </Routes>
    </Router>
  );
}

export default App;
