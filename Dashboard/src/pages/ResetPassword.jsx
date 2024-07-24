import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  resetPassword,
  clearAllForgotPasswordStates,
  clearAllForgotPasswordErrors,
} from "../store/forgotPasswordSlice.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleResetPassword = () => {
    console.log(password, confirmPassword);
    dispatch(resetPassword(token, password, confirmPassword));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotPasswordErrors());
    }
    if (message.length > 0) {
      setPassword("");
      setConfirmPassword("");
      dispatch(clearAllForgotPasswordStates());
      navigate("/login");
    }
  }, [dispatch, loading, isAuthenticated, error, message]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Reset Admin Password</h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Confirm Password</Label>
            </div>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <Link
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              color: isHovered ? "blue" : "#000",
              transition: "color 0.2s ease",
            }}
            to={"/login"}
            className="ml-auto inline-block text-sm underline"
          >
            Remember your password?
          </Link>
          <Button
            type="submit"
            className="w-full"
            onClick={handleResetPassword}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
