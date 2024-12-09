import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';

import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/account' element={<Account />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
