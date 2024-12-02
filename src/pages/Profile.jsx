import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import { getUserProfile } from '../service/api';

function Profile() {
  const { isLoggedIn, user } = useAuth();
  const [profile, setProfile] = useState();  // Use context user data if available
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (!profile) {
      // Fetch user data if not already available in context
      fetchUserData();
    }
  }, [isLoggedIn, navigate, profile]);

  const fetchUserData = async () => {
    try {
      // Fetch user data from the API
      const response = await getUserProfile(user.id);
      setProfile(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data');
    }
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <>
      <Link to="/" className="home-button">
        <FaHome className='icon'/>
        <p>Home</p>
      </Link>
      <div className="profile-container">
          <div className='wrapper'>
            <div className='title'>Profile</div>
            <div className='info'>
              <p><strong>Username:</strong> <span className="username-highlight">{profile.name}</span></p>
              <p><strong>Email:</strong> <span className="username-highlight">{profile.email}</span></p>
            </div>
          </div>
      </div>
    </>
  );
}

export default Profile;
