import PropTypes from 'prop-types';
import Button from './Button';

const DialogConfirm = ({ open, onClose, onConfirm, title, content, negativeText, positiveText }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{content}</p>
        <div className="flex justify-end space-x-4">
          <Button
            className="w-fit"
            variant="secondary"
            onClick={onClose}
          >
            {negativeText || 'Cancel'}
          </Button>
          <Button
            className="w-fit"
            variant="primary"
            onClick={onConfirm}
          >
            {positiveText || 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
};

DialogConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  negativeText: PropTypes.string,
  positiveText: PropTypes.string,
};

export default DialogConfirm;