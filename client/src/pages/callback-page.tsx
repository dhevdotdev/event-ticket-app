import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import AuthTransitionScreen from "@/components/auth-transition-screen";

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

  return (
    <AuthTransitionScreen
      eyebrow="Signing you in"
      title="Completing your session"
      description="Your access token and redirect path are being finalized so we can drop you back into the right screen."
    />
  );
};

export default CallbackPage;
