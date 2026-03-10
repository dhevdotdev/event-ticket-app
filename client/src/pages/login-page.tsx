import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import AuthTransitionScreen from "@/components/auth-transition-screen";

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      signinRedirect();
    }
  }, [isLoading, isAuthenticated, signinRedirect]);

  return (
    <AuthTransitionScreen
      eyebrow="Secure sign in"
      title="Sending you to login"
      description="We are redirecting you to the identity provider so you can continue with the right account and role."
    />
  );
};

export default LoginPage;
