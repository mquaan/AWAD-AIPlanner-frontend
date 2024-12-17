import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { LiaTimesSolid } from 'react-icons/lia';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FeedbackModal = ({ isOpen, onClose, feedback }) => {
  const modalRef = useRef(null);

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);

  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-[10000]">
      <div className="bg-white rounded-2xl shadow-xl w-[700px] max-h-screen my-4 overflow-auto"
      ref={modalRef}>
        {/* Header */}
        <div className='sticky top-0 left-0 bg-white w-full'>
          <div className="flex items-center justify-between pl-6 pr-5 py-4 text-gray-700 ">
            <h2 className="text-lg font-semibold">AI Feedback</h2>
            <button
                className="hover:text-black hover:bg-gray-200 p-1 rounded-lg"
                onClick={onClose}
              >
                <LiaTimesSolid />
              </button>
          </div>
          <hr className="border-t border-gray-200" />
        </div>

        {/* Body */}
        <div className='p-5'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                p: (props) => <p {...props} className="my-4" />,
                table: ({ ...props }) => (
                  <table className="border border-black w-full" {...props} />
                ),
                th: ({ ...props }) => (
                  <th className="border border-black p-2 bg-gray-200" {...props} />
                ),
                td: ({ ...props }) => (
                  <td className="border border-black p-2" {...props} />
                ),
                code: ({ ...props }) => (
                  <code className="bg-background-neutral p-1 rounded" {...props} />
                ),
                pre: ({ ...props }) => (
                  <pre className="bg-background-neutral p-2 rounded-lg overflow-auto" {...props} />
                ),
            }}
          >
            {feedback}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
};

FeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  feedback: PropTypes.string,
};

export default FeedbackModal;