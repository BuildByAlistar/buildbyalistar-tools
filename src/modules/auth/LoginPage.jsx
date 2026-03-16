import { useEffect } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { getModuleTheme } from "../../components/platform/theme";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.55-5.17 3.55-8.67Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3.01c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.12-6.73-4.96H1.26v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.27v-3.1H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.37l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.96 1.09 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4.01 3.1C6.22 6.89 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, loginWithGoogle } = useAuth();
  const theme = getModuleTheme("auth");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, navigate, user]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_0.65fr]">
      <section className="premium-panel p-7 sm:p-10">
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${theme.accentText}`}>Login</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">Sign in to access your saved tools and outputs.</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-300 sm:text-base sm:leading-8">
          Use the existing Firebase Google sign-in flow to unlock the dashboard, saved outputs, and personalized tool access.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="premium-soft-panel p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Access</p>
            <p className="mt-3 text-lg font-semibold text-white">Dashboard and saved outputs</p>
          </div>
          <div className="premium-soft-panel p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Provider</p>
            <p className="mt-3 text-lg font-semibold text-white">Google via Firebase Auth</p>
          </div>
        </div>
      </section>

      <aside className="premium-panel-strong p-7 sm:p-8">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.iconWrap}`}>
          <ShieldCheck size={20} />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-white">Continue with Google</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          One-click access for your workspace, tool history, and output library.
        </p>

        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <GoogleMark />
          {loading ? "Checking session..." : "Continue with Google"}
        </button>

        <Link
          to="/dashboard"
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-sm font-semibold transition duration-200 ${theme.ghostButton}`}
        >
          Preview dashboard
          <ArrowRight size={16} />
        </Link>
      </aside>
    </div>
  );
}
