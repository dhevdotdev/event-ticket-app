import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowRight, CalendarRange, Search, Sparkles, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import PublicHeader from "@/components/public-header";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="page-shell page-grid py-10 text-white">
        <Alert variant="destructive" className="glass-panel border-red-500/40 bg-red-950/30">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <div className="page-shell page-grid py-10 text-white/70">Loading events...</div>;
  }

  return (
    <div className="page-shell pb-14 text-white sm:pb-20">
      <PublicHeader />

      <main className="page-grid mt-8 space-y-10 sm:mt-12 sm:space-y-14">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="max-w-2xl space-y-6">
              <div className="section-kicker flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Curated nights, zero friction
              </div>
              <h1 className="max-w-3xl text-5xl leading-none text-balance sm:text-6xl lg:text-7xl">
                Find your next sold-out evening before everyone else does.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                Browse published events, compare ticket tiers, and move from discovery to checkout in a few taps.
              </p>

              <div className="glass-panel flex flex-col gap-3 rounded-[1.5rem] border-white/10 p-3 sm:flex-row sm:items-center">
                <Input
                  className="h-12 rounded-[1.1rem] border-white/10 bg-white/6 px-4 text-white placeholder:text-white/35"
                  value={query}
                  placeholder="Search by venue, artist, or city"
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                  onClick={queryPublishedEvents}
                  className="h-12 rounded-[1.1rem] px-5 text-primary-foreground"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-white/65">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Fast OIDC login
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  QR-based entry
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Live inventory awareness
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="glass-panel rounded-[1.75rem] p-6">
              <div className="section-kicker mb-4">At a glance</div>
              <div className="text-4xl">{publishedEvents?.totalElements ?? 0}</div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                published experiences currently open for browsing.
              </p>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-6">
              <CalendarRange className="h-5 w-5 text-accent" />
              <p className="mt-4 text-xl">Plan ahead with clear ticket windows.</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Event dates, venue context, and ticket options stay visible from listing to purchase.
              </p>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-6">
              <Ticket className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xl">Organizer-ready on the other side.</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Running the show instead of attending? Switch over to the organizer experience.
              </p>
              <Link
                to="/organizers"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
              >
                Explore organizer tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">Now browsing</p>
              <h2 className="text-4xl sm:text-5xl">Published events</h2>
            </div>
          </div>

          {publishedEvents?.empty ? (
            <div className="glass-panel rounded-[1.75rem] px-6 py-10 text-center text-white/65">
              No events matched this search yet. Try another artist, venue, or city.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {publishedEvents?.content?.map((publishedEvent) => (
                <PublishedEventCard
                  publishedEvent={publishedEvent}
                  key={publishedEvent.id}
                />
              ))}
            </div>
          )}
        </section>

        {publishedEvents && (
          <div className="flex justify-center py-2 sm:py-4">
            <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AttendeeLandingPage;
