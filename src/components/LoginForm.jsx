import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import StatusMessage from './StatusMessage';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../service/api';
import '../styles/Form.css';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const location = useLocation();
  const { message, type } = location.state || {};
  const [status, setStatus] = useState({ message: message || '', type: type || '' });

  const handleGoogleSuccess = (credentialResponse) => {
    login(credentialResponse.credential, 'google_user');
    navigate('/', { state: { message: 'Login successful!', type: 'success' } });
  };

  const handleGoogleFailure = (error) => {
    console.log('Google login failed:', error);
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      login(response.data.token, response.data.user);
      navigate('/', { state: { message: response.data.message || 'Login successful!', type: 'success' } });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Login failed', type: 'error' });
    }
  };

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ message: '', type: '' }), 3000); // Clear after 3 seconds
      navigate(location.pathname, { replace: true });
      return () => clearTimeout(timer);
    }
  }, [status, navigate, location.pathname]);

  return (
    <>
      <StatusMessage message={status.message} type={status.type} />
      <div className="body">
        <div className="form-container">
          <h2>AI Planner - Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className='input-box'>
              <input type="email" placeholder='Email' {...register('email', { required: 'Email is required' })} />
              <FaUser className='icon' />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="input-box">
              <input type="password" placeholder='Password' {...register('password', { required: 'Password is required' })} />
              <FaLock className='icon' />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            
            <button type="submit" className="submit-button-login">Log In</button>

            <div className='or'> or </div>
            <GoogleOAuthProvider clientId="138521205229-9sffq4ng14m4kpcgceacelngthptkj1m.apps.googleusercontent.com">
              <div className="social-login">
                <GoogleLogin
                  className="google-login"
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                />
              </div>
            </GoogleOAuthProvider>

            <div className='register-link'>
              <p> Don&apos;t have an account?</p>
              <Link to="/register" className='link-login'>Register</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
