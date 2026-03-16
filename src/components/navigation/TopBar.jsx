import { LogOut, MenuSquare } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { mainNavigation } from "../../data/toolCatalog";

const getLinkClassName = ({ isActive }) =>
  [
    "rounded-full px-4 py-2.5 text-sm font-medium transition duration-200",
    isActive
      ? "border border-white/15 bg-white text-slate-950 shadow-lg shadow-cyan-500/15"
      : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6 hover:text-white",
  ].join(" ");

export default function TopBar() {
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();
  const action = user
    ? { label: "Dashboard", to: "/dashboard" }
    : pathname === "/login"
      ? { label: "Back Home", to: "/" }
      : { label: "Login", to: "/login" };

  return (
    <header className="sticky top-0 z-30 pt-3 sm:pt-5">
      <div className="rounded-[30px] border border-white/12 bg-slate-950/72 px-4 py-3 shadow-[0_20px_70px_rgba(2,6,23,0.36)] backdrop-blur-xl xl:px-6">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
          <div className="flex items-center justify-between gap-4 xl:justify-start">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-400 text-slate-950 shadow-[0_14px_35px_rgba(45,212,191,0.25)]">
                <MenuSquare size={20} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">BuildByAlistar</p>
                <p className="text-sm font-semibold tracking-[-0.02em] text-white">Toolsphere</p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-1.5">
            {mainNavigation.map((link) => (
              <NavLink key={link.path} to={link.path} className={getLinkClassName}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-start gap-2.5 xl:justify-end">
            {user ? (
              <div className="hidden rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs text-slate-300 sm:block">
                {user.displayName || user.email}
              </div>
            ) : (
              <div className="hidden rounded-full border border-white/12 bg-white/5 px-3 py-2 text-xs text-slate-400 sm:block">
                {loading ? "Checking session" : "Guest mode"}
              </div>
            )}
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/10 active:translate-y-0"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : null}
            <Link
              to={action.to}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-cyan-100 active:translate-y-0"
            >
              {action.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
