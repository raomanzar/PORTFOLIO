import { Button } from "@/components/ui/button";
import { Logout } from "../store/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.user);

  const handleLogout = () => {
    if (error) {
      toast.error(error);
    }
    dispatch(Logout());
  };
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, isAuthenticated, error]);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <>
      <Button type="submit" className="w-full" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Home;
