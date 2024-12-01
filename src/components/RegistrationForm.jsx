import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/Form.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import StatusMessage from './StatusMessage';
import { registerUser } from '../api/auth';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      const successMessage = response.data.message || 'Registered successfully!';
      navigate('/login', { state: { message: successMessage, type: 'success' } });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Registration failed!', type: 'error' });
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
      <div className='body'>
        <div className="form-container">
          <h2>AI Planner - Register</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className='input-box'>
              <input type="email" placeholder='Email' {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input type="text" placeholder='Username' {...register('username', { required: 'Username is required' })} />
              {errors.username && <p className="error-message">{errors.username.message}</p>}
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input type="password" placeholder='Password' {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
              <FaLock className='icon' />
            </div>

            <button type="submit" className="submit-button-register">Register</button>

            <div className='register-link'>
              <p>Already have an account?</p>
              <Link to="/login" className='link-register'>Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrationForm;
