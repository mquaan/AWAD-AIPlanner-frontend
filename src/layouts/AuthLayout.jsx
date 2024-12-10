import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-[#ffede1]">
      <div className='flex flex-col items-center w-[420px] bg-neutral-100 bg-opacity-50 border-2 border-background-neutral border-opacity-75 p-10 rounded-lg backdrop-blur-lg overflow-y-auto max-h-[calc(100%-3rem)]'>
        <Link to='/'>
          <div className="flex gap-3 mb-8">
              <img src="/logo-icon.svg" alt="logo" className="h-9" />
              <h1 className="text-4xl font-lalezar text-primary">AI Study Planner</h1>
          </div>
        </Link>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;