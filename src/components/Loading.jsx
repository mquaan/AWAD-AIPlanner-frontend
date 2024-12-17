
const Loading = () => {
  return (
    <div className="flex flex-col h-[500px] items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
