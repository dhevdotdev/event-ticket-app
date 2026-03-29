import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router";
import AuthTransitionScreen from "@/components/auth-transition-screen";
import { useRoles } from "@/hooks/use-roles";

interface ProtectedRouteProperties {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProperties> = ({
  children,
  allowedRoles,
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { isLoading: areRolesLoading, roles } = useRoles();
  const location = useLocation();

  if (isLoading || areRolesLoading) {
    return (
      <AuthTransitionScreen
        eyebrow="Checking access"
        title="Verifying your session"
        description="We are confirming your authentication state before showing protected event and ticket data."
      />
    );
  }

  if (!isAuthenticated) {
    localStorage.setItem(
      "redirectPath",
      globalThis.location.pathname + globalThis.location.search,
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length) {
    const isAllowed = allowedRoles.some((role) => roles.includes(role));

    if (!isAllowed) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
