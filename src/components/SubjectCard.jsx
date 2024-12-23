import PropTypes from 'prop-types';
import { GoTrash } from "react-icons/go";
import { CiEdit } from "react-icons/ci";

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  return (
    <div className="w-full h-fit border border-border px-5 py-3 rounded-lg bg-white flex items-center justify-between">
      <h2>{subject.name}</h2>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="text-blue-500 hover:text-blue-600" onClick={() => onEdit(subject)}>
          <CiEdit size={20} />
        </button>
        <button className="text-red-500 hover:text-red-600" onClick={() => onDelete(subject)}>
          <GoTrash size={18} />
        </button>
      </div>
    </div>
  );
}

SubjectCard.propTypes = {
  subject: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default SubjectCard;