import { Outlet } from "react-router-dom";
import MainPage from "../components/MainPage";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <MainPage>
        <Outlet />
      </MainPage>
    </div>
  );
};

export default MainLayout;