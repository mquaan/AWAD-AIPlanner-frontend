import { useEffect } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useToast } from '../context/ToastContext';

const HomePage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

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
        showToast('success', 'You are now logged in');
        navigate('/', { replace: true }); // Remove token and user from URL
      } catch (error) {
        console.error('Invalid user data in URL', error);
        showToast('error', 'Invalid login data');
      }
    }
  }, [login, navigate, showToast]);

  return (
    <div className="overflow-auto">
      <Header />
      <div className="relative flex flex-col min-h-screen pt-16 justify-center items-center overflow-hidden">
        <img src="/scrum_board.svg" alt="scrum board" className="w-48 absolute top-[32%] left-[5%]" />
        <img src="/time_management.svg" alt="time management" className="w-40 absolute top-[24%] right-[5%]" />
        <img src="/timeline.svg" alt="timeline" className="w-44 absolute top-[64%] right-[18%]" />
        
        <div className="w-fit z-10 space-y-10">
          <div className="space-y-3 w-fit block mx-auto">
            <p className="font-bold text-5xl text-center"><span className="text-primary italic">Effortless</span> Planning,</p>
            <p className="font-bold text-5xl text-center"><span className="text-primary italic">Focused</span> Learning</p>
          </div>
          <p className="font-medium text-lg text-center text-text-neutral w-[480px]">Streamline your study schedule, track progress effortlessly, and stay ahead with personalized AI-driven insights designed for your success</p>
          <Link to="/dashboard" className="block mx-auto w-fit">
            <Button>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage;