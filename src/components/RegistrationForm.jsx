import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Link } from 'react-router-dom';
import StatusMessage from './StatusMessage';
import { registerUser } from '../service/api';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import InputField from './InputField';

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
            <InputField
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              icon={FaUser}
            />
            <InputField
              type="text"
              placeholder="Name"
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
              icon={MdDriveFileRenameOutline}
            />
            <InputField
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              icon={FaLock}
            />
            <Button type="submit">Register</Button>
          </form>
          <div className='flex justify-center items-center text-center mt-5 mb-2 gap-2'>
            <div className='text-[15px] text-[#262121] font-semibold'>Already have an account?</div>
            <Link to="/login" className='text-[15px] font-semibold text-[#344e47]'>Log In</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegistrationForm;
