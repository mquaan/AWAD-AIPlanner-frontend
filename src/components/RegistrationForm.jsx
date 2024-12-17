import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

import { Link } from 'react-router-dom';
import { registerUser } from '../service/authApi';
import Button from './Button';
import InputField from './InputField';
import { useToast } from '../context/ToastContext';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [isRegistering, setIsRegistering] = useState(false);

  const { showToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setIsRegistering(true);
      showToast('success', 'Registered successfully!');
      // navigate('/login');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Registration failed');
    }
  };

  if (isRegistering) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <CiMail className="text-[80px]" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">Check Your Email</h1>
        <p className="text-gray-700 px-12 text-justify">
          We have sent a verification link to your email address. Please check your inbox and click the link to verify your email.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='text-3xl font-bold'>Register</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mt-4">
        <InputField
          type="email"
          placeholder="Email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
          icon={FaEnvelope}
        />
        <InputField
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
          icon={FaUser}
        />
        <InputField
          type="password"
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          helperText='Password must be at least 8 characters long'
          icon={FaLock}
        />
        <Button type="submit" className='w-full'>Register</Button>
      </form>
      <p className=' text-[15px] font-semibold mt-4'>
        Already have an account?
        <span>
          <Link to="/login" className='text-primary hover:text-button-hover'> Log In</Link>
        </span>
      </p>
    </>
  );
}

export default RegistrationForm;
