import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router";

const PublicHeader: React.FC = () => {
  const { isAuthenticated, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="page-grid pt-5 sm:pt-8">
      <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-white/90 uppercase"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            ET
          </span>
          <span className="hidden sm:inline">Event Ticket Platform</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link className="transition hover:text-white" to="/">
            Discover
          </Link>
          <Link className="transition hover:text-white" to="/organizers">
            For organizers
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                className="rounded-full px-4 text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                onClick={() => signoutRedirect()}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              onClick={() => signinRedirect()}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
