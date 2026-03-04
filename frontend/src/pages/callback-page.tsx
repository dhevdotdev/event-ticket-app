import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath") ?? "/dashboard";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
    }
  }, [isLoading, isAuthenticated, navigate]);

  return <p>Completing login...</p>;
};

export default CallbackPage;
