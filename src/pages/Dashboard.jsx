import { useEffect } from "react";
import { usePage } from "../context/PageContext";

const Dashboard = () => {
  const { setHeading, setActions } = usePage();
  useEffect(() => {
    setHeading("Dashboard");
    setActions([]);
  }, []);

  return <div></div>;
};

export default Dashboard;
