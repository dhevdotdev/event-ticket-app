import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  EventSummary,
  EventStatus,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
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

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.DRAFT:
        return "bg-gray-700 text-gray-200";
      case EventStatus.PUBLISHED:
        return "bg-green-700 text-green-100";
      case EventStatus.CANCELLED:
        return "bg-red-700 text-red-100";
      case EventStatus.COMPLETED:
        return "bg-blue-700 text-blue-100";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(undefined);
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
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

  return (
    <div className="page-shell pb-16 text-white">
      <NavBar />

      <div className="page-grid mt-8 space-y-8">
        <div className="glass-panel flex flex-col gap-5 rounded-[2rem] px-6 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="section-kicker">Organizer dashboard</p>
            <h1 className="mt-2 text-5xl leading-none">Your events</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              Everything you have drafted, published, and scheduled lives here.
            </p>
          </div>
          <div className="shrink-0">
            <Link to="/dashboard/events/create">
              <Button className="h-11 rounded-full px-5 text-primary-foreground cursor-pointer">
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {events?.content.map((eventItem) => (
            <Card
              key={eventItem.id}
              className="glass-panel rounded-[1.8rem] border-white/10 text-white"
            >
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-primary/80">
                      Event title
                    </p>
                    <h3 className="mt-2 text-4xl leading-none">{eventItem.name}</h3>
                  </div>
                  <span
                    className={`flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${formatStatusBadge(eventItem.status)}`}
                  >
                    {eventItem.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="flex space-x-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <Calendar className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-white">Event window</p>
                    <p className="mt-2 text-white/72">
                      {formatDate(eventItem.start)} to{" "}
                      {formatDate(eventItem.end)}
                    </p>
                    <p className="text-sm text-white/50">
                      {formatTime(eventItem.start)} -{" "}
                      {formatTime(eventItem.end)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <Clock className="mt-1 h-5 w-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-white">Sales period</h4>
                    <p className="mt-2 text-white/72">
                      {formatDate(eventItem.salesStart)} to{" "}
                      {formatDate(eventItem.salesEnd)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-white">Venue</p>
                    <p className="mt-2 text-white/72">{eventItem.venue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <Tag className="mt-1 h-5 w-5 text-accent" />
                  <div>
                    <h4 className="font-medium text-white">Ticket types</h4>
                    <ul className="mt-2 space-y-2">
                      {eventItem.ticketTypes.map((ticketType) => (
                        <li
                          key={ticketType.id}
                          className="flex flex-wrap gap-2 text-sm text-white/68"
                        >
                          <span>{ticketType.name}</span>
                          <span className="text-primary">${ticketType.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link to={`/dashboard/events/update/${eventItem.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Edit />
                  </Button>
                </Link>
                <Button
                  type="button"
                  className="cursor-pointer rounded-full bg-red-600/90 hover:bg-red-500"
                  onClick={() => handleOpenDeleteEventDialog(eventItem)}
                >
                  <Trash />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center py-8">
        {events && (
          <SimplePagination pagination={events} onPageChange={setPage} />
        )}
      </div>
      <AlertDialog open={dialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your event '{eventToDelete?.name}' and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteEventDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEvent()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
