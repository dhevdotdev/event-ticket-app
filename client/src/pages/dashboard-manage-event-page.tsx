import NavBar from "@/components/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateEventRequest,
  CreateTicketTypeRequest,
  EventDetails,
  EventStatus,
  UpdateEventRequest,
  UpdateTicketTypeRequest,
} from "@/domain/domain";
import { createEvent, getEvent, updateEvent } from "@/lib/api";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarClock,
  CalendarIcon,
  Edit,
  MapPinned,
  Plus,
  Save,
  Ticket,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";

interface DateTimeSelectProperties {
  date: Date | undefined;
  setDate: (date: Date) => void;
  time: string | undefined;
  setTime: (time: string) => void;
  enabled: boolean;
  setEnabled: (isEnabled: boolean) => void;
}

const parseApiDate = (value?: Date | string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const DateTimeSelect: React.FC<DateTimeSelectProperties> = ({
  date,
  setDate,
  time,
  setTime,
  enabled,
  setEnabled,
}) => {
  const normalizedTime = time ?? "";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span className="text-sm text-white/65">
          {enabled ? "Enabled" : "Not scheduled yet"}
        </span>
      </div>

      {enabled && !normalizedTime && (
        <p className="text-xs text-white/45">
          Time not selected. Midnight will be used unless you choose a time.
        </p>
      )}

      {enabled && (
        <div className="grid w-full gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full min-w-0 justify-start rounded-xl border-white/10 bg-white/5 text-left text-white hover:bg-white/10"
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }
                  const displayedYear = selectedDate.getFullYear();
                  const displayedMonth = selectedDate.getMonth();
                  const displayedDay = selectedDate.getDate();

                  const correctedDate = new Date(
                    Date.UTC(displayedYear, displayedMonth, displayedDay),
                  );

                  setDate(correctedDate);
                }}
                className="rounded-md border shadow"
              />
            </PopoverContent>
          </Popover>

          <div className="min-w-0">
            <Input
              type="time"
              className="h-11 w-full min-w-0 rounded-xl border-white/10 bg-white/5 text-white [&::-webkit-calendar-picker-indicator]:invert"
              value={normalizedTime}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const generateTempId = () => `temp_${crypto.randomUUID()}`;
const isTempId = (id: string | undefined) => id && id.startsWith("temp_");

interface TicketTypeData {
  id: string | undefined;
  name: string;
  price: number;
  totalAvailable?: number;
  description: string;
}

interface EventData {
  id: string | undefined;
  name: string;
  startDate: Date | undefined;
  startTime: string | undefined;
  endDate: Date | undefined;
  endTime: string | undefined;
  venueDetails: string;
  salesStartDate: Date | undefined;
  salesStartTime: string | undefined;
  salesEndDate: Date | undefined;
  salesEndTime: string | undefined;
  ticketTypes: TicketTypeData[];
  status: EventStatus;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

const getStatusTone = (status: EventStatus) => {
  switch (status) {
    case EventStatus.PUBLISHED:
      return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
    case EventStatus.CANCELLED:
      return "bg-red-500/15 text-red-200 border-red-400/30";
    case EventStatus.COMPLETED:
      return "bg-sky-500/15 text-sky-200 border-sky-400/30";
    default:
      return "bg-white/8 text-white/75 border-white/12";
  }
};

const DashboardManageEventPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [eventData, setEventData] = useState<EventData>({
    id: undefined,
    name: "",
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
    venueDetails: "",
    salesStartDate: undefined,
    salesStartTime: undefined,
    salesEndDate: undefined,
    salesEndTime: undefined,
    ticketTypes: [],
    status: EventStatus.DRAFT,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const [currentTicketType, setCurrentTicketType] = useState<
    TicketTypeData | undefined
  >();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [eventDateEnabled, setEventDateEnabled] = useState(false);
  const [eventSalesDateEnabled, setEventSalesDateEnabled] = useState(false);

  const [error, setError] = useState<string | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof EventData, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isEditMode && !isLoading && user?.access_token && id) {
      const fetchEvent = async () => {
        const event: EventDetails = await getEvent(user.access_token, id);
        const startDate = parseApiDate(event.start);
        const endDate = parseApiDate(event.end);
        const salesStartDate = parseApiDate(event.salesStart);
        const salesEndDate = parseApiDate(event.salesEnd);
        const createdAt = parseApiDate(event.createdAt);
        const updatedAt = parseApiDate(event.updatedAt);

        setEventData({
          id: event.id,
          name: event.name,
          startDate,
          startTime: startDate ? formatTimeFromDate(startDate) : undefined,
          endDate,
          endTime: endDate ? formatTimeFromDate(endDate) : undefined,
          venueDetails: event.venue,
          salesStartDate,
          salesStartTime: salesStartDate
            ? formatTimeFromDate(salesStartDate)
            : undefined,
          salesEndDate,
          salesEndTime: salesEndDate ? formatTimeFromDate(salesEndDate) : undefined,
          status: event.status,
          ticketTypes: event.ticketTypes.map((ticket) => ({
            id: ticket.id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price,
            totalAvailable: ticket.totalAvailable,
          })),
          createdAt,
          updatedAt,
        });
        setEventDateEnabled(!!(startDate || endDate));
        setEventSalesDateEnabled(!!(salesStartDate || salesEndDate));
      };
      fetchEvent();
    }
  }, [id, isEditMode, isLoading, user?.access_token]);

  const formatTimeFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time
      .split(":")
      .map((num) => Number.parseInt(num, 10));

    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours);
    combinedDateTime.setMinutes(minutes);
    combinedDateTime.setSeconds(0);

    return combinedDateTime;
  };

  const resolveDateTime = (
    enabled: boolean,
    date: Date | undefined,
    time: string | undefined,
  ): Date | undefined => {
    if (!enabled) {
      return undefined;
    }

    if (!date) {
      return undefined;
    }

    return combineDateTime(date, time && time.trim() ? time : "00:00");
  };

  const handleEventUpdateSubmit = async (accessToken: string, id: string) => {
    const ticketTypes: UpdateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          id: isTempId(ticketType.id) ? undefined : ticketType.id,
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: UpdateEventRequest = {
      id: id,
      name: eventData.name,
      start: resolveDateTime(
        eventDateEnabled,
        eventData.startDate,
        eventData.startTime,
      ),
      end: resolveDateTime(eventDateEnabled, eventData.endDate, eventData.endTime),
      venue: eventData.venueDetails,
      salesStart: resolveDateTime(
        eventSalesDateEnabled,
        eventData.salesStartDate,
        eventData.salesStartTime,
      ),
      salesEnd: resolveDateTime(
        eventSalesDateEnabled,
        eventData.salesEndDate,
        eventData.salesEndTime,
      ),
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await updateEvent(accessToken, id, request);
      navigate("/dashboard/events");
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

  const handleEventCreateSubmit = async (accessToken: string) => {
    const ticketTypes: CreateTicketTypeRequest[] = eventData.ticketTypes.map(
      (ticketType) => {
        return {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          totalAvailable: ticketType.totalAvailable,
        };
      },
    );

    const request: CreateEventRequest = {
      name: eventData.name,
      start: resolveDateTime(
        eventDateEnabled,
        eventData.startDate,
        eventData.startTime,
      ),
      end: resolveDateTime(eventDateEnabled, eventData.endDate, eventData.endTime),
      venue: eventData.venueDetails,
      salesStart: resolveDateTime(
        eventSalesDateEnabled,
        eventData.salesStartDate,
        eventData.salesStartTime,
      ),
      salesEnd: resolveDateTime(
        eventSalesDateEnabled,
        eventData.salesEndDate,
        eventData.salesEndTime,
      ),
      status: eventData.status,
      ticketTypes: ticketTypes,
    };

    try {
      await createEvent(accessToken, request);
      navigate("/dashboard/events");
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (isLoading || !user || !user.access_token) {
      console.error("User not found!");
      return;
    }

    if (isEditMode) {
      if (!eventData.id) {
        setError("Event does not have an ID");
        return;
      }
      await handleEventUpdateSubmit(user.access_token, eventData.id);
    } else {
      await handleEventCreateSubmit(user.access_token);
    }
  };

  const handleAddTicketType = () => {
    setCurrentTicketType({
      id: undefined,
      name: "",
      price: 0,
      totalAvailable: 0,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveTicketType = () => {
    if (!currentTicketType) {
      return;
    }

    const newTicketTypes = [...eventData.ticketTypes];

    if (currentTicketType.id) {
      const index = newTicketTypes.findIndex(
        (t) => t.id === currentTicketType.id,
      );
      if (index !== -1) {
        newTicketTypes[index] = currentTicketType;
      }
    } else {
      newTicketTypes.push({
        ...currentTicketType,
        id: generateTempId(),
      });
    }

    updateField("ticketTypes", newTicketTypes);
    setDialogOpen(false);
  };

  const handleEditTicketType = (ticketType: TicketTypeData) => {
    setCurrentTicketType(ticketType);
    setDialogOpen(true);
  };

  const handleDeleteTicketType = (id: string | undefined) => {
    if (!id) {
      return;
    }
    updateField(
      "ticketTypes",
      eventData.ticketTypes.filter((t) => t.id !== id),
    );
  };

  if (isLoading) {
    return <div className="page-shell page-grid py-10 text-white/70">Loading event builder...</div>;
  }

  return (
    <div className="page-shell pb-16 text-white">
      <NavBar />
      <div className="page-grid mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] px-6 py-7 sm:px-8">
            <p className="section-kicker">Organizer editor</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-5xl leading-none">
                  {isEditMode ? "Edit event" : "Create a new event"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                  Shape the public listing, set sales windows, and keep ticket tiers organized in one pass.
                </p>
              </div>
              <span
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusTone(eventData.status)}`}
              >
                {eventData.status}
              </span>
            </div>

            {isEditMode && (
              <div className="mt-6 grid gap-3 text-sm text-white/55 sm:grid-cols-2">
                {eventData.id && <p>ID: {eventData.id}</p>}
                {eventData.createdAt && <p>Created: {format(eventData.createdAt, "PPP")}</p>}
                {eventData.updatedAt && <p>Updated: {format(eventData.updatedAt, "PPP")}</p>}
              </div>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <MapPinned className="h-5 w-5 text-primary" />
                  Event details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="event-name" className="text-sm font-medium text-white/80">
                    Event Name
                  </label>
                  <Input
                    id="event-name"
                    className="mt-2 border-white/10 bg-white/5 text-white"
                    placeholder="Midnight Rooftop Sessions"
                    value={eventData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                  <p className="mt-2 text-xs text-white/45">
                    This becomes the public title attendees see first.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-white/80">Event Start</label>
                    <div className="mt-2 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <DateTimeSelect
                        date={eventData.startDate}
                        setDate={(date) => updateField("startDate", date)}
                        time={eventData.startTime}
                        setTime={(time) => updateField("startTime", time)}
                        enabled={eventDateEnabled}
                        setEnabled={setEventDateEnabled}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white/80">Event End</label>
                    <div className="mt-2 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <DateTimeSelect
                        date={eventData.endDate}
                        setDate={(date) => updateField("endDate", date)}
                        time={eventData.endTime}
                        setTime={(time) => updateField("endTime", time)}
                        enabled={eventDateEnabled}
                        setEnabled={setEventDateEnabled}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="venue-details" className="text-sm font-medium text-white/80">
                    Venue Details
                  </label>
                  <Textarea
                    id="venue-details"
                    className="mt-2 min-h-[120px] border-white/10 bg-white/5"
                    value={eventData.venueDetails}
                    onChange={(e) => updateField("venueDetails", e.target.value)}
                  />
                  <p className="mt-2 text-xs text-white/45">
                    Include enough context so attendees know exactly where to go.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <CalendarClock className="h-5 w-5 text-accent" />
                  Sales windows
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-white/80">Sales Start</label>
                  <div className="mt-2 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <DateTimeSelect
                      date={eventData.salesStartDate}
                      setDate={(date) => updateField("salesStartDate", date)}
                      time={eventData.salesStartTime}
                      setTime={(time) => updateField("salesStartTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80">Sales End</label>
                  <div className="mt-2 rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                    <DateTimeSelect
                      date={eventData.salesEndDate}
                      setDate={(date) => updateField("salesEndDate", date)}
                      time={eventData.salesEndTime}
                      setTime={(time) => updateField("salesEndTime", time)}
                      enabled={eventSalesDateEnabled}
                      setEnabled={setEventSalesDateEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-3 text-3xl">
                      <Ticket className="h-5 w-5 text-primary" />
                      Ticket tiers
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={handleAddTicketType}
                      className="rounded-full px-5 text-primary-foreground"
                    >
                      <Plus /> Add Ticket Type
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {eventData.ticketTypes.length === 0 && (
                    <div className="rounded-[1.3rem] border border-dashed border-white/15 bg-white/4 p-5 text-sm text-white/55">
                      No ticket tiers yet. Add at least one so the event can be sold.
                    </div>
                  )}

                  {eventData.ticketTypes.map((ticketType) => (
                    <div
                      key={ticketType.id}
                      className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-lg font-semibold text-white">{ticketType.name}</p>
                            <Badge
                              variant="outline"
                              className="border-primary/35 bg-primary/10 text-primary"
                            >
                              ${ticketType.price}
                            </Badge>
                          </div>
                          {ticketType.totalAvailable !== undefined && (
                            <p className="mt-2 text-sm text-white/50">
                              {ticketType.totalAvailable} tickets available
                            </p>
                          )}
                          <p className="mt-2 text-sm leading-6 text-white/58">
                            {ticketType.description}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-full text-white/75 hover:bg-white/10 hover:text-white"
                            onClick={() => handleEditTicketType(ticketType)}
                          >
                            <Edit />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-full text-red-300 hover:bg-red-500/10 hover:text-red-200"
                            onClick={() => handleDeleteTicketType(ticketType.id)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <DialogContent className="glass-panel rounded-[1.8rem] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-3xl">
                      {currentTicketType?.id ? "Edit ticket type" : "Add ticket type"}
                    </DialogTitle>
                    <DialogDescription className="text-white/55">
                      Define pricing, inventory, and what this tier includes.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-type-name">Name</Label>
                    <Input
                      id="ticket-type-name"
                      className="border-white/10 bg-white/5"
                      value={currentTicketType?.name}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? { ...currentTicketType, name: e.target.value }
                            : undefined,
                        )
                      }
                      placeholder="General Admission"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ticket-type-price">Price</Label>
                      <Input
                        id="ticket-type-price"
                        type="number"
                        value={currentTicketType?.price}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  price: Number.parseFloat(e.target.value),
                                }
                              : undefined,
                          )
                        }
                        className="border-white/10 bg-white/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticket-type-total-available">Total Available</Label>
                      <Input
                        id="ticket-type-total-available"
                        type="number"
                        value={currentTicketType?.totalAvailable}
                        onChange={(e) =>
                          setCurrentTicketType(
                            currentTicketType
                              ? {
                                  ...currentTicketType,
                                  totalAvailable: Number.parseFloat(e.target.value),
                                }
                              : undefined,
                          )
                        }
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket-type-description">Description</Label>
                    <Textarea
                      id="ticket-type-description"
                      className="min-h-[110px] border-white/10 bg-white/5"
                      value={currentTicketType?.description}
                      onChange={(e) =>
                        setCurrentTicketType(
                          currentTicketType
                            ? { ...currentTicketType, description: e.target.value }
                            : undefined,
                        )
                      }
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" className="rounded-full px-5 text-primary-foreground" onClick={handleSaveTicketType}>
                      Save tier
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-3xl">Publish settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={eventData.status}
                    onValueChange={(value) => updateField("status", value)}
                  >
                    <SelectTrigger className="w-full border-white/10 bg-white/5 text-white sm:w-[220px]">
                      <SelectValue placeholder="Select Event Status" />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10 text-white">
                      <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/45">
                    Keep as draft while refining, then publish when the listing is ready for buyers.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-500/35 bg-red-950/30 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="h-12 rounded-full px-6 text-base text-primary-foreground">
                  <Save className="h-4 w-4" />
                  {isEditMode ? "Update event" : "Create event"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6">
          <Card className="glass-panel rounded-[1.8rem] border-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-3xl">Live summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="section-kicker">Public title</p>
                <p className="mt-3 text-3xl leading-none">
                  {eventData.name || "Your next headline event"}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="section-kicker">Venue</p>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  {eventData.venueDetails || "Venue details have not been written yet."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <p className="section-kicker">Ticket tiers</p>
                  <p className="mt-3 text-4xl leading-none">{eventData.ticketTypes.length}</p>
                </div>
                <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                  <p className="section-kicker">Status</p>
                  <p className="mt-3 text-xl text-white/78">{eventData.status}</p>
                </div>
              </div>

              <div className="rounded-[1.3rem] border border-dashed border-white/15 bg-white/[0.03] p-4 text-sm leading-6 text-white/55">
                Keep the event name crisp, venue specific, and ticket tiers distinct. That is what makes the listing feel real instead of placeholder content.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardManageEventPage;
