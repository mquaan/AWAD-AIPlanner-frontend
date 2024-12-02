import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import StatusMessage from './StatusMessage';
import { useAuth } from '../context/AuthContext';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin } from '../service/api';
import '../styles/Form.css';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login, status, setStatus } = useAuth();
  
  // const location = useLocation();
  // const { message, type } = location.state || {};
  // const [status, setStatus] = useState({ message: message || '', type: type || '' });

  const handleGoogleLogin = async () => {
    try {
      // const response = await googleLogin();
      window.location.href = 'http://localhost:8080/api/auth/google_login';
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Login failed', type: 'error' });
    };
  };

  // const handleGoogleSuccess = (credentialResponse) => {
  //   login(credentialResponse.credential, 'google_user');
  //   setStatus({ message: 'Google login successful!', type: 'success' });
  //   navigate('/');
  // };

  // const handleGoogleFailure = (error) => {
  //   console.log('Google login failed:', error);
  //   setStatus({ message: 'Google login failed!', type: 'error' });
  // };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      login(response.data.token, response.data.user);
      setStatus({ message: 'Login successful!', type: 'success' });
      navigate('/');
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Login failed', type: 'error' });
    }
  };

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ message: '', type: '' }), 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      <StatusMessage message={status.message} type={status.type} />
      <div className="body">
        <div className="form-container">
          <div className='title'>AI Planner - Login</div>
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
            {/* <GoogleOAuthProvider clientId="138521205229-9sffq4ng14m4kpcgceacelngthptkj1m.apps.googleusercontent.com">
              <div className="social-login">
                <GoogleLogin
                  className="google-login"
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                />
              </div>
            </GoogleOAuthProvider> */}

          </form>
          <div className='google-login'>
            <button onClick={handleGoogleLogin}>
              Google
            </button>
          </div>
          <div className='register-link'>
            <p> Don&apos;t have an account?</p>
            <Link to="/register" className='link-login'>Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
