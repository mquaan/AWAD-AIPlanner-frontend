import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, onClick=null, type='button', variant='primary', className='' }) => {
  let variantStyle;
  if (variant === 'primary') {
    variantStyle = 'bg-primary hover:bg-button-hover text-white';
  } else if (variant === 'secondary') {
    variantStyle = 'bg-background-neutral hover:bg-button-hover-secondary text-text-neutral';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        'w-[200px] h-[45px] p-4 flex items-center justify-center border-none rounded-3xl cursor-pointer shadow-md',
        'transition-colors duration-300 text-center text-[15px] font-semibold text-white',
        variantStyle,
        className,
      )}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  className: PropTypes.string,
};

export default Button;
