import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';

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
                <Link
                  to="/profile"
                  className="px-6 py-2 bg-[#3ca2be] text-black font-bold rounded-lg hover:opacity-80"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-[#c8873c] text-black font-bold rounded-lg hover:opacity-80"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-black mb-4">Already have an account? Log in below.</p>
              <Link
                to="/login"
                className="block px-8 py-2 bg-[#568175] text-white font-bold rounded-lg hover:opacity-80"
              >
                Log In
              </Link>
              <p className="text-lg text-black mt-8">Don&apos;t have an account? Register now.</p>
              <Link
                to="/register"
                className="block mt-2 px-8 py-2 bg-[#3a5c67] text-white font-bold rounded-lg hover:opacity-80"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
