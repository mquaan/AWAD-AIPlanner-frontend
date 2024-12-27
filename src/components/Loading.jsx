import PropTypes from 'prop-types';

const Loading = ({ content }) => {
  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex flex-col justify-center items-center z-[10000]">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 text-lg font-medium">{content}</p>
    </div>
  )
};

Loading.propTypes = {
  content: PropTypes.string,
};

export default Loading;
