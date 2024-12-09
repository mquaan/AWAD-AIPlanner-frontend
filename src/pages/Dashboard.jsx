import { useEffect } from "react";
import { usePage } from "../context/PageContext";

const Dashboard = () => {
  const { setHeading } = usePage();
  useEffect(() => {
    setHeading("Dashboard");
  }, []);

  return <div></div>;
};

export default Dashboard;
