import { useDroppable } from '@dnd-kit/core';

import PropTypes from 'prop-types';

const DroppableColumn = ({ status, children, className }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className= {`droppable-column ${className}`}>
      {children}
    </div>
  );
};

DroppableColumn.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default DroppableColumn;