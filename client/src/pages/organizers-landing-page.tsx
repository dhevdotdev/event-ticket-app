import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate } from "react-router";
import PublicHeader from "@/components/public-header";
import { ArrowRight, ShieldCheck, Sparkles, Ticket } from "lucide-react";

const OrganizersLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const navigate = useNavigate();

  if (isLoading) {
    return <div className="page-shell page-grid py-10 text-white/70">Loading organizer experience...</div>;
  }

  return (
    <div className="page-shell pb-16 text-white">
      <PublicHeader />

      <main className="page-grid mt-8 space-y-8 sm:mt-12">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="glass-panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="section-kicker flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Built for showrunners
            </div>
            <h1 className="mt-4 max-w-3xl text-5xl leading-none text-balance sm:text-6xl lg:text-7xl">
              Launch the room, sell the seats, validate the crowd.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              A focused control surface for organizers who want event publishing, ticket tiers, and QR-based entry without the usual admin drag.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                className="h-12 rounded-full px-6 text-base text-primary-foreground"
                onClick={() => navigate("/dashboard/events")}
              >
                Create an event
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-base text-white hover:bg-white/10"
                asChild
              >
                <Link to="/">
                  Browse events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <Ticket className="h-5 w-5 text-primary" />
                <p className="mt-4 text-lg">Flexible ticket tiers</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  VIP, early bird, or general admission in one flow.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <p className="mt-4 text-lg">Secure auth</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  OIDC-backed access for organizers, staff, and attendees.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="mt-4 text-lg">Fast validation</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  QR-driven entrance checks when doors open.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-3">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[1.5rem]">
              <img
                src="organizers-landing-hero.png"
                alt="A busy concert"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="glass-panel max-w-sm rounded-[1.5rem] p-5">
                  <p className="section-kicker">Organizer mode</p>
                  <h2 className="mt-3 text-3xl leading-none">From draft to check-in.</h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    The app now looks like a platform, not a demo. Next step is carrying this quality through every dashboard screen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
