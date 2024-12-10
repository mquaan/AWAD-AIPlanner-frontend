import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

const InputField = forwardRef(({ type = "text", placeholder = "", className, error, helperText, disabled=false, icon: Icon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const defaultClassName = `
    relative w-full h-[45px] bg-transparent outline-none border-[1.5px] border-black/20 rounded-full
    focus-within:outline-none focus-within:border-[#395750] focus-within:shadow-sm
    ${disabled && 'bg-disabled opacity-70'}
    ${error && 'border-error'}
  `;

  const inputClassName = twMerge(
    'w-full h-full px-6 rounded-full outline-none bg-transparent placeholder-text-neutral disabled:cursor-not-allowed',
    type === 'password' && 'pr-[50px]',
    Icon && 'pl-[50px]',
  );
  
  return (
    <div className="">
      <div className={twMerge(defaultClassName, className)} >
        {Icon && (
          <Icon className="absolute top-1/2 left-6 transform -translate-y-1/2 text-text-neutral" />
        )}
        <input
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className={inputClassName}
          ref={ref} // Forward the ref
          disabled={disabled}
          {...props} // Spread only valid input props
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute top-1/2 right-6 transform -translate-y-1/2 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className='text-text-neutral' /> : <FaEye className='text-text-neutral' />}
          </button>
        )}
      </div>
      {helperText && !error && <p className="text-gray-500 text-[12.5px] mt-1 ml-2">{helperText}</p>}
      {error && <p className="text-error text-[12.5px] mt-1 ml-2">{error}</p>}
    </div>
  );
});

InputField.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType, // Updated to represent a component type
};

InputField.displayName = 'InputField';

export default InputField;
