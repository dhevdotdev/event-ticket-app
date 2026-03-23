import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  const dateLabel =
    publishedEvent.start && publishedEvent.end
      ? `${format(publishedEvent.start, "MMM d")} - ${format(publishedEvent.end, "MMM d")}`
      : "Dates to be announced";

  return (
    <Link to={`/events/${publishedEvent.id}`} className="group block h-full">
      <Card className="glass-panel h-full overflow-hidden rounded-[1.75rem] border-white/10 py-0 text-white transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_30px_80px_rgba(6,10,26,0.55)]">
        <div className="relative h-56 overflow-hidden">
          <RandomEventImage
            seed={publishedEvent.id}
            alt={publishedEvent.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08101f] via-[#08101f]/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
            Live now
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/85">
                Featured event
              </p>
              <h3 className="mt-2 text-3xl leading-none text-balance">
                {publishedEvent.name}
              </h3>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex items-start justify-between gap-4 text-sm text-white/72">
            <div className="flex min-w-0 items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="truncate">{publishedEvent.venue}</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">
              Reserve
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/72">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{dateLabel}</span>
          </div>

          <div className="border-t border-white/10 pt-4 text-sm text-white/58">
            Step into a curated night of live energy, polished access, and quick mobile ticketing.
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
