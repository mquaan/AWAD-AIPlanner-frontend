import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';
import HomePage from './pages/HomePage';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Task from './pages/Task';

import PrivateRoute from './PrivateRoute';
import StatusMessage from './components/StatusMessage';
import { useToast } from './context/ToastContext';
import AuthLayout from './layouts/AuthLayout';
import TaskProvider from './context/TaskContext';

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route
                path="/task"
                element={
                  <TaskProvider>
                    <Task />
                  </TaskProvider>
                }
              />
              <Route
                path="/task/:id"
                element={
                  <TaskProvider>
                    <Task />
                  </TaskProvider>
                }
              />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
