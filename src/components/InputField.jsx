import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const InputField = forwardRef(({ type = "text", placeholder = "", className, error, icon: Icon, ...props }, ref) => {
  const defaultClassName = `
    w-[calc(100%-30px)] h-full outline-none border-2 border-black/20 rounded-full
    bg-transparent text-[15px] text-black pl-6 placeholder-black
    focus:outline-none focus:border-[#395750] focus:shadow-sm
  `;
  
  return (
    <div className="relative w-full h-[50px] my-6">
      <input
        type={type}
        placeholder={placeholder}
        className={twMerge(defaultClassName, className)}
        ref={ref} // Forward the ref
        {...props} // Spread only valid input props
      />
      {Icon && (
        <Icon className="absolute top-1/2 right-[35px] transform -translate-y-1/2 text-[15px]" />
      )}
      {error && <p className="text-red-500 text-[12.5px] mt-0">{error}</p>}
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
  icon: PropTypes.elementType, // Updated to represent a component type
};

InputField.displayName = 'InputField';

export default InputField;
