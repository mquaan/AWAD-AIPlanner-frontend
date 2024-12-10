import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../service/api';
import { FcGoogle } from "react-icons/fc";
import InputField from './InputField';
import Button from './Button';
import { useToast } from '../context/ToastContext';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL + '/api/auth/google_login';
      window.location.href = url;
    } catch (error) {
      showToast('error', error.message || 'Login failed');
    };
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);
      login(response.data.token, response.data.user);
      showToast('success', 'Login successful!');
      navigate('/');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div className='text-3xl font-bold'>Login</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full mt-4">
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
        <Button type="submit" className='w-full'>Log In</Button>
        <p className='w-fit mx-auto'>or</p>
      </form>
      <Button
        variant='outline'
        onClick={handleGoogleLogin}
        className='w-full mt-4'
        icon={FcGoogle}
      >
        Sign in with Google
      </Button>
      <p className=' text-[15px] font-semibold mt-4'>
        Don&apos;t have an account?
        <span>
          <Link to="/register" className='text-primary hover:text-button-hover'> Register</Link>
        </span>
      </p>
    </>
  );
}

export default LoginForm;
