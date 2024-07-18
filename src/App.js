import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Staff from './staff/Staff.js';
import Manager from './manager/Manager.js';
import Admin from './admin/Admin.js';
import Login from './staff/Login.js';
import ProtectedRoute from './staff/ProtectedRoute.js';
import BarcodeScanner from './staff/BarcodeScanner.js';
import ResetPassword from '../src/staff/ResetPassword.js';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/staff/*" element={
          <ProtectedRoute roles={['Staff']} element={Staff} />
        } />
        <Route path="/manager/*" element={
          <ProtectedRoute roles={['Manager']} element={Manager} />
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute roles={['Admin']} element={Admin} />
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );

}

export default App;
