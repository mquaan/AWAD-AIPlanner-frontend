import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, onClick, type, className }) => (
  <button
    type={type}
    onClick={onClick}
    className={twMerge(
      'w-[200px] h-[45px] bg-[#43655c] border-none rounded-3xl cursor-pointer shadow-md',
      'transition-colors duration-300 text-[15px] font-semibold text-white hover:bg-[#395750]',
      className,
    )}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: null,
  type: 'button',
  className: '',
};

export default Button;
