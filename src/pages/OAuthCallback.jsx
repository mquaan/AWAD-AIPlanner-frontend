import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleCallback } from '../service/api';

function OAuthCallback() {
  const navigate = useNavigate();
  const { login, setStatus } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (!code) {
        setStatus({ message: 'Google login failed!', type: 'error' });
        navigate('/login');
        return;
      }

      try {
        const response = await googleCallback(code); // Gọi API backend với mã 'code'
        login(response.data.token, response.data.user);
        setStatus({ message: 'Google login successful!', type: 'success' });
        navigate('/'); // Chuyển hướng về trang chủ
      } catch (error) {
        setStatus({ message: error.message || 'Google login failed!', type: 'error' });
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [login, navigate, setStatus]);

  return <div>Loading...</div>;
}

export default OAuthCallback;
