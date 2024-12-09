import { FcGoogle } from "react-icons/fc";
import PropTypes from "prop-types";

const GoogleLoginButton = ({ onClick }) => (
  <div
    className="flex h-[45px] justify-center items-center bg-slate-300 rounded-3xl shadow-md p-3 hover:cursor-pointer gap-4"
    onClick={onClick}
  >
    <FcGoogle className="text-[20px]" />
    Sign in with Google
  </div>
);

GoogleLoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default GoogleLoginButton;
