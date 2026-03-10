import { useRoles } from "@/hooks/use-roles";
import AuthTransitionScreen from "@/components/auth-transition-screen";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isOrganizer) {
      navigate("/dashboard/events", { replace: true });
      return;
    }

    if (isStaff) {
      navigate("/dashboard/validate-qr", { replace: true });
      return;
    }

    navigate("/dashboard/tickets", { replace: true });
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return (
    <AuthTransitionScreen
      eyebrow="Preparing workspace"
      title="Opening your dashboard"
      description="We are routing you to the right control surface based on your current role and access level."
    />
  );
};

export default DashboardPage;
