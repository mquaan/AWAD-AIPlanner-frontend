import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/Form.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import StatusMessage from './StatusMessage';
import { registerUser } from '../service/api';
import { useAuth } from '../context/AuthContext';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { status, setStatus } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      const successMessage = response.data.message || 'Registered successfully!';
      setStatus({ message: successMessage, type: 'success' });
      navigate('/login');
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
      <div className='h-screen flex justify-center items-center'>
        <div className="form-flex flex-col p-[50px] w-[420px] bg-[#26493f5f] rounded-3xl shadow-md text-center">
          <div className='text-[30px] font-bold text-black mb-3'>AI Planner - Register</div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className='relative w-full h-[50px] my-6'>
              <input 
                type="email"
                placeholder='Email' {...register('email', { required: 'Email is required' })} 
                className='w-[calc(100%-30px)] h-full outline-none border-2 border-black/20 rounded-full
                          bg-transparent text-[15px] text-black pl-6 placeholder-black
                          focus:outline-none focus:border-[#395750] focus:shadow-sm'
              />
              {errors.email && <p className="text-red-500 text-[12.5px] mt-0">{errors.email.message}</p>}
              <FaUser className='absolute top-1/2 right-[25px] transform -translate-y-1/2 text-[15px]' />
            </div>
            <div className="relative w-full h-[50px] my-6">
              <input 
                type="text"
                placeholder='Name' {...register('name', { required: 'Name is required' })}
                className='w-[calc(100%-30px)] h-full outline-none border-2 border-black/20 rounded-full
                          bg-transparent text-[15px] text-black pl-6 placeholder-black
                          focus:outline-none focus:border-[#395750] focus:shadow-sm'
              />
              <FaLock className='absolute top-1/2 right-[25px] transform -translate-y-1/2 text-[15px]' />
              {errors.name && <p className="text-red-500 text-[12.5px] mt-0">{errors.name.message}</p>}
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
              className="w-[60%] h-[45px] mt-2 bg-[#3a5c67] border-none rounded-full cursor-pointer shadow-md transition-colors duration-300 text-[15px]
                        font-semibold text-white hover:bg-[#324f59]"
            >
                Register
            </button>
          </form>
          <div className='flex justify-center items-center text-center mt-5 mb-2 gap-2'>
            <div className='text-[15px] text-[#262121] font-semibold'>Already have an account?</div>
            <Link to="/login" className='text-[15px] font-semibold text-[#3a5c67]'>Log In</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegistrationForm;
