import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
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
      console.log(user.id);
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
      <Link 
        to="/"
        className="flex fixed top-[25px] left-[20px] px-[20px] py-[10px] bg-[#4b675e]
                  text-white rounded-2xl gap-2 items-center justify-center hover:opacity-90"
      >
        <FaHome className='mb-[2px] text-[16px]'/>
        <div className='text-[14px]'>Home</div>
      </Link>
      <div className="h-screen flex flex-col items-center justify-center">
          <div className='flex flex-col items-center justify-center py-[60px] px-[100px] bg-[#26493f5f] rounded-2xl'>
            <div className='text-[30px] font-bold text-black mb-7'>Profile</div>
            <div className='text-[18px] text-black text-left'>
              <p><strong>Name:</strong> <span className='font-bold text-sky-800 bg-blue-100 px-2 py-0.5 rounded-lg'>{profile.name}</span></p>
              <p><strong>Email:</strong> <span className='font-bold text-sky-800 bg-blue-100 px-2 py-0.5 rounded-lg'>{profile.email}</span></p>
            </div>
          </div>
      </div>
    </>
  );
}

export default Profile;
