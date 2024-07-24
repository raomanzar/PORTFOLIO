import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearAllForgotPasswordErrors,
  clearAllForgotPasswordStates,
} from "../store/forgotPasswordSlice.js";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotPasswordErrors());
    }
    if (isAuthenticated) {
      navigate("/");
    }
    if (message.length > 0) {
      setEmail("");
      dispatch(clearAllForgotPasswordStates());
    }
  }, [dispatch, isAuthenticated, loading, error, message]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Forgot Admin Password</h1>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
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
          </div>

          <Button
            type="submit"
            className="w-full"
            onClick={handleForgotPassword}
          >
            {loading ? "Loading..." : " Request For Reset Password"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
