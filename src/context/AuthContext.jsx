import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { userLogout } from '../service/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); 
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [status, setStatus] = useState({ message: '', type: '' });

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
  };

  const logout = async () => {
    await userLogout()

    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentView');
    localStorage.removeItem('currentViewCalendar');
    localStorage.removeItem('filters');
    localStorage.removeItem('showSidebar');
    localStorage.removeItem('focusTaskId');
    localStorage.removeItem('pomoCount');
  };

  return (
    <AuthContext.Provider 
      value={
        { 
          user, 
          login, 
          logout, 
          isLoggedIn: !!authToken,
          status,
          setStatus
        }
      }
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);