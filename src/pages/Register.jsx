import RegistrationForm from '../components/RegistrationForm';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Register() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  return (
    <div>
      <img 
        src="/logo-with-text.svg" 
        alt="logo" 
        className="fill-black cursor-pointer fixed top-4 left-5" 
        onClick={() => navigate('/')}
      />
      <RegistrationForm />
    </div>
  );
}

export default Register;
