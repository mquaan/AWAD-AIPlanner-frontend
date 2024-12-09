import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import StatusMessage from './StatusMessage';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../service/api';
import { FcGoogle } from "react-icons/fc";
import InputField from './InputField';
import Button from './Button';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login, status, setStatus } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // const response = await googleLogin();
      const url = import.meta.env.VITE_BACKEND_URL + '/api/auth/google_login';
      window.location.href = url; 
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Login failed', type: 'error' });
    };
  };

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
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col p-[50px] w-[420px] bg-[#26493f5f] rounded-3xl shadow-md text-center">
          <div className='text-[30px] font-bold text-black mb-3'>AI Planner - Login</div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <InputField
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              icon={FaUser}
            />
            <InputField
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              icon={FaLock}
            />
            <Button type="submit">Log In</Button>
            <div className='text-black text-[15px] mt-4'> or </div>
          </form>
          <div className='flex justify-center items-center mt-4'>
            <div 
              className='flex h-[45px] justify-center items-center bg-slate-300 rounded-3xl shadow-md p-3 hover:cursor-pointer gap-4'
              onClick={handleGoogleLogin}
            >
                <FcGoogle className='text-[20px]' />
                Sign in with Google
            </div>
          </div>
          <div className='flex justify-center items-center text-center mt-5 mb-2 gap-2'>
            <div className='text-[15px] text-[#262121] font-semibold'> Don&apos;t have an account?</div>
            <Link to="/register" className='text-[15px] font-semibold text-[#344e47]'>Register</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
