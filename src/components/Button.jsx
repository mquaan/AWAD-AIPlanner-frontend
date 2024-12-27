import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, onClick=null, type='button', variant='primary', className='', icon: Icon, iconLeft=true, ...props }) => {
  let variantStyle;
  if (variant === 'primary') {
    variantStyle = 'bg-primary hover:bg-button-hover text-white';
  } else if (variant === 'secondary') {
    variantStyle = 'bg-background-neutral hover:bg-button-hover-secondary text-text-neutral';
  } else if (variant === 'outline') {
    variantStyle = 'bg-transparent border-[1.5px] border-primary text-text-primary hover:bg-primary-light';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        'w-[200px] h-[45px] px-4 py-2 flex items-center justify-center gap-[10px] rounded-lg cursor-pointer shadow-sm',
        'transition-colors duration-300 text-center text-[15px] font-semibold text-white',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary',
        variantStyle,
        className,
      )}
      {...props}
    >
      {iconLeft && Icon && <Icon className='text-xl' />}
      {children}
      {!iconLeft && Icon && <Icon className='text-xl' />}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  className: PropTypes.string,
  icon: PropTypes.elementType,
  iconLeft: PropTypes.bool,
};

export default Button;
