import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { format } from "date-fns";
import { AlertCircle, Calendar, DollarSign, MapPin, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router";
import NavBar from "@/components/nav-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const parseApiDate = (value?: Date | string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();
  const eventStart = parseApiDate(ticket?.eventStart);
  const eventEnd = parseApiDate(ticket?.eventEnd);

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        setTicket(await getTicket(accessToken, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "text-green-400";
      case TicketStatus.CANCELLED:
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (!ticket) {
    return <div className="page-shell page-grid py-10 text-white/70">Loading ticket...</div>;
  }

  return (
    <div className="page-shell min-h-screen pb-16 text-white">
      <NavBar />
      <div className="page-grid mt-8 flex items-center justify-center p-4">
        <div className="glass-panel relative w-full max-w-2xl rounded-[2.2rem] p-6 shadow-2xl sm:p-8">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center">
            <span
                className={`text-sm font-medium uppercase tracking-[0.2em] ${getStatusColor(ticket.status)}`}
            >
              {ticket?.status}
            </span>
          </div>
          </div>

          <div className="mb-2">
            <h1 className="mb-3 text-center text-5xl leading-none">{ticket.eventName}</h1>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <MapPin className="w-4" />
              <span>{ticket.eventVenue}</span>
            </div>
          </div>

          <div className="mb-8 flex items-center justify-center gap-2 text-white/70">
            <Calendar className="w-4 text-primary" />
            <div>
              {eventStart && eventEnd
                ? `${format(eventStart, "Pp")} - ${format(eventEnd, "Pp")}`
                : "Event time unavailable"}
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="rounded-[1.8rem] bg-white p-4 shadow-lg">
              <div className="w-32 h-32 flex items-center justify-center">
                {isQrLoading && (
                  <div className="text-xs text-center p2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2 mx-auto"></div>
                    <div className="text-gray-800">Loading QR...</div>
                  </div>
                )}
                {error && (
                  <div className="px-2 text-center text-red-500">
                    <AlertCircle className="mx-auto mb-1 h-6 w-6" />
                    <div className="text-sm">QR unavailable</div>
                  </div>
                )}
                {qrCodeUrl && !isQrLoading && !error && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for event"
                    className="w-full h-full object-contain rounded-large"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <p className="text-sm text-white/62">
              Present this QR code at the venue for entry
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-500/35 bg-red-950/30 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 text-primary" />
                <span className="font-semibold text-white/72">Ticket type</span>
              </div>
              <p className="mt-3 text-lg leading-6">{ticket.description}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 text-accent" />
                <span className="font-semibold text-white/72">Price paid</span>
              </div>
              <p className="mt-3 text-3xl text-primary">${ticket.price}</p>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-semibold font-mono text-white/65">Ticket ID</h4>
            <p className="mt-2 text-sm font-mono text-white/55">{ticket.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
