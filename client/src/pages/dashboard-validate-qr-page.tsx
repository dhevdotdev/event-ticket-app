import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, QrCode, ScanLine, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import NavBar from "@/components/nav-bar";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    return <div className="page-shell page-grid py-10 text-white/70">Loading validator...</div>;
  }

  return (
    <div className="page-shell min-h-screen pb-16 text-white">
      <NavBar />
      <div className="page-grid mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="section-kicker">Staff console</p>
          <h1 className="mt-3 text-5xl leading-none">Validate entry</h1>
          <p className="mt-4 text-sm leading-6 text-white/65 sm:text-base">
            Scan QR codes at the gate or switch to manual entry when the camera is not practical.
          </p>

          <div className="mt-8 space-y-4 text-sm text-white/65">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              Valid scan returns a green confirmation.
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              Reused or invalid scans surface a red rejection.
            </div>
          </div>
        </div>

        <div className="glass-panel w-full rounded-[2rem] p-4 sm:p-6">
        {error && (
            <Alert variant="destructive" className="mb-4 border-red-500/35 bg-red-950/30 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="relative mx-auto mb-8 overflow-hidden rounded-[1.6rem] border border-white/10">
          <Scanner
            key={`scanner-${data}-${validationStatus}`}
            onScan={(result) => {
              if (result) {
                const qrCodeId = result[0].rawValue;
                setData(qrCodeId);
                handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
              }
            }}
            onError={handleError}
          />

          {validationStatus && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-sm">
              {validationStatus === TicketValidationStatus.VALID ? (
                <div className="bg-green-500 rounded-full p-4">
                  <Check className="w-20 h-20" />
                </div>
              ) : (
                <div className="bg-red-500 rounded-full p-4">
                  <X className="w-20 h-20" />
                </div>
              )}
            </div>
          )}
        </div>

        {isManual ? (
          <div className="pb-4">
            <Input
              className="mb-6 h-12 w-full text-lg text-white"
              placeholder="Paste ticket ID"
              onChange={(e) => setData(e.target.value)}
            />
            <Button
              className="h-14 w-full rounded-[1rem] text-base text-primary-foreground"
              onClick={() =>
                handleValidate(data || "", TicketValidationMethod.MANUAL)
              }
            >
              Submit
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex h-14 items-center justify-center rounded-[1rem] border border-white/10 bg-white/5 font-mono text-sm text-white/70">
              <span>{data || "Scan for Result"}</span>
            </div>
            <Button
              variant="outline"
              className="my-6 h-14 w-full rounded-[1rem] border-white/10 bg-white/5 text-base text-white hover:bg-white/10"
              onClick={() => setIsManual(true)}
            >
              <QrCode className="h-4 w-4" />
              Manual
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          className="my-4 h-14 w-full rounded-[1rem] text-base text-white/75 hover:bg-white/10 hover:text-white"
          onClick={handleReset}
        >
          <ScanLine className="h-4 w-4" />
          Reset
        </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
