import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import StatusMessage from './StatusMessage';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../service/api';
import { FcGoogle } from "react-icons/fc";

// import '../styles/Form.css';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login, status, setStatus } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      // const response = await googleLogin();
      window.location.href = 'http://localhost:8080/api/auth/google_login'; 
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
            <div className='relative w-full h-[50px] my-6'>
              <input 
                type="email"
                placeholder='Email' {...register('email', { required: 'Email is required' })}
                className='w-[calc(100%-30px)] h-full outline-none border-2 border-black/20 rounded-full
                          bg-transparent text-[15px] text-black pl-6 placeholder-black
                          focus:outline-none focus:border-[#395750] focus:shadow-sm'
              />
              <FaUser className='absolute top-1/2 right-[25px] transform -translate-y-1/2 text-[15px]' />
              {errors.email && <p className="text-red-500 text-[12.5px] mt-0">{errors.email.message}</p>}
            </div>

            <div className="relative w-full h-[50px] my-6">
              <input 
                type="password"
                placeholder='Password' {...register('password', { required: 'Password is required' })}
                className='w-[calc(100%-30px)] h-full outline-none border-2 border-black/20 rounded-full
                          bg-transparent text-[15px] text-black pl-6 placeholder-black
                          focus:outline-none focus:border-[#395750] focus:shadow-sm'
              />
              <FaLock className='absolute top-1/2 right-[25px] transform -translate-y-1/2 text-[15px]' />
              {errors.password && <p className="text-red-500 text-[12.5px] mt-0">{errors.password.message}</p>}
            </div>
            <button 
              type="submit" 
              className="w-[60%] h-[45px] mt-2 bg-[#43655c] border-none rounded-full cursor-pointer shadow-md transition-colors duration-300 text-[15px]
                        font-semibold text-white hover:bg-[#395750]"
            >
                Log In
            </button>
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
