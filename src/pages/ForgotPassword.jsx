import {FaEnvelope} from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

import InputField from "../components/InputField.jsx";
import {useForm} from "react-hook-form";
import {useToast} from "../context/ToastContext.jsx";
import Button from "../components/Button.jsx";
import {Link} from "react-router-dom";
import {forgotPassword} from "../service/authApi.js";

const ForgotPassword = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm();

  const { showToast } = useToast();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      reset();
      showToast('success', 'Please check your email to reset your password.');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div className='text-center text-3xl font-bold'>Forgot Password?</div>

      <p className="text-center text-sm text-text-secondary">Enter the email address you used when<br />you joined to reset your password.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="space-y-1">
          <label htmlFor="rs-pw-email" className="text-text-secondary text-sm font-semibold">Email</label>
          <InputField
            id="rs-pw-email"
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
            icon={FaEnvelope}
          />
        </div>
        <Button type="submit" className='w-full'>Submit</Button>
      </form>

      <Link className="flex gap-3 items-center w-full justify-center" to="/login">
        <FaArrowLeftLong />
        <span className="">Back to login</span>
      </Link>
    </div>
  );
}

export default ForgotPassword;