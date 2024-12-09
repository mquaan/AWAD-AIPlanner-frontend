import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Menu from "./Menu";
import { Link } from "react-router-dom";

const items = [
  { label: "Go to dashboard", path: "/dashboard" },
  { label: "Logout" },
];

const Header = () => {
  const { user, logout, isLoggedIn, setStatus } = useAuth();

  const [showMenuAccount, setShowMenuAccount] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout(); // Call logout from your AuthContext
      setStatus({ message: 'You have logged out successfully.', type: 'success' });
    }
  };

  const handleMenuClick = (index) => {
    if (index === 1) {
      handleLogout();
    }
  }

  return (
    <div className="h-16 w-full bg-background flex items-center justify-between px-5 border-b-[1.5px] border-background-neutral fixed top-0 left-0 z-50">
      <img src="/logo-with-text.svg" alt="logo" className="fill-black" />
      {isLoggedIn ? 
        <div className="flex items-center space-x-4">
          <p className="text-text-primary">Welcome, {user.name}</p>
          <div
            className="relative hover:cursor-pointer"
            onMouseEnter={() => setShowMenuAccount(true)}
            onMouseLeave={() => setShowMenuAccount(false)}
          >
            <img 
              src="https://avatar.iran.liara.run/public/93"
              alt="avatar"
              className="w-9 h-9 rounded-full bg-background-neutral"
            />
            {
              showMenuAccount &&
              <Menu
                className={"absolute top-10 right-0"} 
                items={items} 
                onItemClick={handleMenuClick} />
            }
          </div>
        </div>
        :
        <Link to="/login">
          <button>Login</button>
        </Link>
      }
      
    </div>
  )
}

export default Header;