import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';

import PrivateRoute from './PrivateRoute';
import StatusMessage from './components/StatusMessage';
import { useToast } from './context/ToastContext';

function App() {
  const { toast } = useToast();

  return (
    <>
    <StatusMessage type={toast.type} message={toast.message} />
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
    </>
  );
}

export default App;
