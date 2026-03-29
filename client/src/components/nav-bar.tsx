import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Sparkles, Ticket } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link } from "react-router";

const NavBar: React.FC = () => {
  const { user, signoutRedirect } = useAuth();
  const { isAttendee, isOrganizer, isStaff } = useRoles();
  const username = user?.profile?.preferred_username ?? "Guest";

  return (
    <div className="page-grid pt-5 sm:pt-8">
      <div className="glass-panel rounded-[1.75rem] border-white/10 px-5 py-4 text-white sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary/80">
                  Control room
                </p>
                <h1 className="font-sans text-lg font-semibold tracking-[0.04em] text-white">
                  Event Ticket Platform
                </h1>
              </div>
            </Link>

            <div className="flex flex-wrap gap-2 text-sm text-white/72">
              {isOrganizer && (
                <Link
                  to="/dashboard/events"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-primary/40 hover:text-white"
                >
                  Events
                </Link>
              )}
              {isAttendee && (
                <Link
                  to="/dashboard/tickets"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-primary/40 hover:text-white"
                >
                  Tickets
                </Link>
              )}
              {isStaff && (
                <Link
                  to="/dashboard/validate-qr"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-primary/40 hover:text-white"
                >
                  Validate
                </Link>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-white/8">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/90 font-semibold text-primary-foreground">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{username}</p>
                  <p className="text-xs text-white/55">{user?.profile?.email}</p>
                </div>
                <Ticket className="h-4 w-4 text-primary" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="glass-panel w-64 rounded-2xl border-white/10 text-white"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-white">{username}</p>
                <p className="text-sm text-white/55">{user?.profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => signoutRedirect()}
              >
                <LogOut />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
