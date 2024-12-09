import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Home() {
  const { user, login, logout, isLoggedIn, status, setStatus } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse URL for token and user data
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const userParam = queryParams.get('user');

    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        login(token, parsedUser);
        setStatus({ message: 'You are now logged in.', type: 'success' }); // Optional: Success message
        navigate('/', { replace: true }); // Remove token and user from URL
      } catch (error) {
        console.error('Invalid user data in URL', error);
        setStatus({ message: 'Invalid login data.', type: 'error' });
      }
    }
  }, [location, setStatus, navigate]);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ message: '', type: '' }), 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout(); // Call logout from your AuthContext
      setStatus({ message: 'You have logged out successfully.', type: 'success' });
    }
  };

  return (
    <>
      <StatusMessage message={status.message} type={status.type} />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="flex flex-col items-center justify-center py-[100px] px-[150px] bg-[#26493f5f] rounded-2xl">
          <h1 className="text-[30px] font-bold text-black mb-7">Welcome to AI Planner System</h1>
          {isLoggedIn ? (
            <>
              <p className="text-lg text-black my-4">
                You are logged in as
                <span className="ml-2 font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-lg">
                  {user.name}
                </span>
              </p>
              <div className="flex space-x-4 mt-4">
                <Button type="button" className="w-[120px] text-black bg-[#3ca2be] hover:bg-[#3795ae]" onClick={() => navigate('/profile')}>
                  View Profile
                </Button>
                <Button type="button" className="w-[120px] text-black bg-[#c8873c] hover:bg-[#bd7f39]" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-black mb-2">Already have an account? Log in below.</p>
              <Button type="button" className="w-[100px]" onClick={() => navigate('/login')}>
                Log In
              </Button>

              <p className="text-lg text-black mt-8 mb-2">Don&apos;t have an account? Register now.</p>
              <Button type="button" className="w-[100px]" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
