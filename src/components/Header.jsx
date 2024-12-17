import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Menu, { MenuItem } from "./Menu";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useToast } from '../context/ToastContext';
import DialogConfirm from "./DialogConfirm";

const Header = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [showMenuAccount, setShowMenuAccount] = useState(false);
  const [showDialogConfirm, setShowDialogConfirm] = useState(false);

  const handleLogout = async() => {
    try{
      await logout();

      setShowDialogConfirm(false);
      showToast('success', 'Logged out successfully');
    } catch(err){
      showToast('error', err.response?.data?.message || 'Logout failed');
    }
  };

  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    if (index === 0) {
      navigate('/dashboard');
    } else if (index === 1) {
      setShowDialogConfirm(true);
    }
  }

  return (
    <>
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
                src={user?.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full bg-background-neutral"
              />
              {
                showMenuAccount &&
                <Menu
                  className={"absolute top-10 right-0"} 
                  // items={items}
                  onItemClick={handleMenuClick}>
                  <MenuItem label="Go to dashboard" />
                  <MenuItem label="Logout" />
                </Menu>
              }
            </div>
          </div>
          :
          <Button
            className="w-fit"
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        }
      </div>

      <DialogConfirm
        open={showDialogConfirm}
        onClose={() => setShowDialogConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm"
        content="Are you sure you want to log out?"
      />
    </>
  )
}

export default Header;