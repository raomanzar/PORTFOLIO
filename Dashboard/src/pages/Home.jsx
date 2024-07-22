import { Button } from "@/components/ui/button";
import { Logout } from "../store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(Logout());
  };
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated]);
  return (
    <>
      <Button type="submit" className="w-full" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Home;
