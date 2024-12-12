import SwitchComponent from "react-switch";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Switch = ({
  label = null,
  checked = false,
  onChange = () => {},
  styles = { container: "", label: "" },
  ...props
}) => {

  return (
    <label className={twMerge("flex items-center gap-2", styles?.container)}>
      <span className={styles?.label}>{label}</span>
      <SwitchComponent
        uncheckedIcon={false}
        checkedIcon={false}
        onColor="#ff6542"
        activeBoxShadow="0 0 2px 3px #ff6542"
        onChange={onChange}
        checked={checked}
        {...props}
      />
    </label>
  );
};

Switch.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  styles: PropTypes.shape({
    container: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default Switch;
