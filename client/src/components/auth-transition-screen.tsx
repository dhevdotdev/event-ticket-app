import { ShieldCheck, Ticket } from "lucide-react";

interface AuthTransitionScreenProps {
  eyebrow: string;
  title: string;
  description: string;
}

const AuthTransitionScreen: React.FC<AuthTransitionScreenProps> = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <div className="page-shell min-h-screen text-white">
      <div className="page-grid flex min-h-screen items-center justify-center py-10">
        <div className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-[2.2rem] p-8 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary/85">
              <ShieldCheck className="h-4 w-4" />
              {eyebrow}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/12 text-primary">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/12" />
                <Ticket className="relative h-9 w-9" />
              </div>
            </div>

            <h1 className="mt-8 text-5xl leading-none sm:text-6xl">{title}</h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              {description}
            </p>

            <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              Please wait a moment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTransitionScreen;
