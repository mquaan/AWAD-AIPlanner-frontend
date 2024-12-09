import { useEffect } from "react";
import { usePage } from "../context/PageContext";

const Account = () => {
  const { setHeading } = usePage();
  useEffect(() => {
    setHeading("Account");
  }, []);

  return (
    <div>
    </div>
  );
};

export default Account;
