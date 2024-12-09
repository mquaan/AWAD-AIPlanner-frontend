import { usePage } from '../context/PageContext';
import { Outlet } from 'react-router-dom';

const MainPage = () => {
  const { showSidebar, heading } = usePage();

  return (
    <div className={`flex flex-col w-full px-10 py-5 min-h-screen ${showSidebar ? "ml-[220px]" : "ml-[92px]"} transition-width duration-300`}>
      <div className="mt-6">
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </div>
      <Outlet />
    </div>
  );
};

export default MainPage;