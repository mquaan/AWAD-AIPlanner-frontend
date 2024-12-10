import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { registerUser } from '../service/api';
import Button from './Button';
import InputField from './InputField';
import { useToast } from '../context/ToastContext';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      showToast('success', 'Registered successfully!');

      navigate('/login');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Registration failed');
    }
  };

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
