import { usePage } from '../context/PageContext';
import { Outlet } from 'react-router-dom';

const MainPage = () => {
  const { heading, actions } = usePage();

  return (
    // <div className={`flex flex-col w-full px-10 py-5 min-h-screen ${showSidebar ? "ml-[220px]" : "ml-[92px]"} transition-width duration-300`}>
    <div className={`flex flex-col w-full px-10 py-5 min-h-screen ml-[92px] transition-width duration-300`}>
      <div className={`mt-6 ${actions.length > 0 ? "flex justify-between items-center" : ""}`}>
        <h1 className="text-2xl font-semibold">{heading}</h1>
        <div className='flex gap-2'>
          {actions}
        </div>
      </div>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;