import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="page-shell min-h-screen text-white">
        <NavBar />
        <div className="page-grid py-8">
          <Alert variant="destructive" className="glass-panel border-red-500/40 bg-red-950/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen pb-16 text-white">
      <NavBar />

      <div className="page-grid mt-8 space-y-8">
        <div className="glass-panel rounded-[2rem] px-6 py-7 sm:px-8">
          <p className="section-kicker">Attendee vault</p>
          <h1 className="mt-2 text-5xl leading-none">Your tickets</h1>
          <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
            Every purchased pass lives here, ready to open and present at the venue.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {tickets?.content.map((ticketItem) => (
            <Link to={`/dashboard/tickets/${ticketItem.id}`} key={ticketItem.id}>
              <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white transition hover:-translate-y-1 hover:border-primary/35">
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      <h3 className="text-3xl leading-none">
                        {ticketItem.ticketType.name}
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      {ticketItem.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-accent" />
                      <p className="font-medium text-white/72">Price</p>
                    </div>
                    <p className="mt-2 text-2xl text-primary">${ticketItem.ticketType.price}</p>
                  </div>

                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium text-white/72">Ticket ID</h4>
                        <p className="mt-2 font-mono text-sm text-white/55">
                          {ticketItem.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center py-2">
          {tickets && <SimplePagination pagination={tickets} onPageChange={setPage} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardListTickets;
