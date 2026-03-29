import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, CalendarDays, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router";
import PublicHeader from "@/components/public-header";
import { format } from "date-fns";

const parseApiDate = (value?: Date | string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const PublishedEventsPage: React.FC = () => {
  const { isLoading } = useAuth();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

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
    return <div className="page-shell page-grid py-10 text-white/70">Loading event...</div>;
  }

  const eventDateLabel =
    parseApiDate(publishedEvent?.start) && parseApiDate(publishedEvent?.end)
      ? `${format(parseApiDate(publishedEvent?.start)!, "EEEE, MMM d")} - ${format(parseApiDate(publishedEvent?.end)!, "MMM d")}`
      : "Dates to be announced";

  return (
    <div className="page-shell pb-16 text-white">
      <PublicHeader />

      <main className="page-grid mt-8 space-y-8 sm:mt-12">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="glass-panel rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
            <p className="section-kicker">Event overview</p>
            <h1 className="mt-4 max-w-3xl text-5xl leading-none text-balance sm:text-6xl">
              {publishedEvent?.name}
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
                  Venue
                </p>
                <div className="mt-3 flex items-start gap-3 text-white/80">
                  <MapPin className="mt-1 h-4 w-4 text-accent" />
                  <span className="leading-6">{publishedEvent?.venue}</span>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
                  Timing
                </p>
                <div className="mt-3 flex items-start gap-3 text-white/80">
                  <CalendarDays className="mt-1 h-4 w-4 text-primary" />
                  <span className="leading-6">{eventDateLabel}</span>
                </div>
              </div>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/65">
              Pick a ticket tier, compare access levels, and move into checkout without losing context.
            </p>
          </div>

          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-3">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-accent/18" />
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[1.5rem]">
              <RandomEventImage
                seed={publishedEvent?.id}
                alt={publishedEvent?.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/15 to-transparent" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div>
              <p className="section-kicker">Choose a tier</p>
              <h2 className="mt-2 text-4xl">Available tickets</h2>
            </div>

            {publishedEvent?.ticketTypes?.map((ticketType) => {
              const isActive = ticketType.id === selectedTicketType?.id;

              return (
                <Card
                  className={`cursor-pointer gap-0 rounded-[1.4rem] border py-0 text-white transition ${
                    isActive
                      ? "border-primary/45 bg-primary/8 shadow-[0_16px_36px_rgba(237,186,86,0.1)]"
                      : "glass-panel border-white/10 hover:border-white/20 hover:bg-white/8"
                  }`}
                  key={ticketType.id}
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader className="px-5 pb-3 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-sans text-xl font-semibold leading-tight text-white">
                          {ticketType.name}
                        </h3>
                        <p className="mt-2 text-sm text-white/52">
                          {ticketType.description || "Access pass for this event."}
                        </p>
                      </div>
                      <span
                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                          isActive ? "bg-primary shadow-[0_0_0_6px_rgba(237,184,82,0.12)]" : "bg-white/18"
                        }`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-end justify-between border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/45">
                          Price
                        </p>
                        <span className="mt-2 block text-3xl font-bold text-primary">
                          ${ticketType.price}
                        </span>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/58">
                        Select
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="glass-panel rounded-[2rem] p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-primary/80">
              <Ticket className="h-4 w-4" />
              Selected pass
            </div>

            <div className="mt-6 border-b border-white/10 pb-6">
              <h2 className="text-5xl leading-none">{selectedTicketType?.name}</h2>
              <div className="mt-4 text-4xl font-bold text-primary">
                ${selectedTicketType?.price}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <p className="text-base leading-7 text-white/68">
                {selectedTicketType?.description}
              </p>

              <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/60">
                Tickets are tied directly to your authenticated account and validated later with QR-based check-in.
              </div>

              <Link
                to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
              >
                <Button className="h-12 w-full rounded-[1rem] text-base text-primary-foreground">
                  Purchase Ticket
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
