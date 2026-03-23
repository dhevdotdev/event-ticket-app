import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { AlertCircle, CheckCircle, CreditCard, ShieldCheck, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import PublicHeader from "@/components/public-header";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
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

  if (isPurchaseSuccess) {
    return (
      <div className="page-shell min-h-screen text-white">
        <PublicHeader />
        <div className="page-grid flex items-center justify-center py-16 text-center">
          <div className="glass-panel max-w-md rounded-[2rem] p-8">
            <div className="space-y-2">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-4xl text-green-300">Thank you!</h2>
              <p className="text-white/70">
                Your ticket purchase was successful.
              </p>
              <p className="text-sm text-white/55">
                Redirecting to home page in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen text-white">
      <PublicHeader />
      <div className="page-grid py-10 sm:py-14">
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <p className="section-kicker">Checkout preview</p>
            <h1 className="mt-3 text-5xl leading-none">Finish your reservation.</h1>
            <p className="mt-4 text-sm leading-6 text-white/65 sm:text-base">
              This is still a mock payment screen, but it should at least look trustworthy and explain what happens next.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Ticket className="h-5 w-5 text-primary" />
                  <span>Ticket will be linked to your authenticated account</span>
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3 text-white/80">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <span>QR code becomes available immediately after purchase</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          {error && (
            <div className="rounded-[1.2rem] border border-red-400/30 bg-red-950/30 p-4">
              <div className="flex items-start gap-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <div>
                <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white/72">Credit Card Number</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="h-12 border-white/10 bg-white/5 pl-10 text-white"
              />
              <CreditCard className="absolute left-3 top-4 h-4 w-4 text-white/35" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/72">Cardholder Name </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="John Smith"
                className="h-12 border-white/10 bg-white/5 pl-10 text-white"
              />
              <CreditCard className="absolute left-3 top-4 h-4 w-4 text-white/35" />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              className="h-12 w-full rounded-full text-base text-primary-foreground cursor-pointer"
              onClick={handlePurchase}
            >
              Purchase Ticket
            </Button>
          </div>

          <div className="flex items-center justify-center text-center text-xs text-white/45">
            This is a mock page, no payment details should be entered.
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
