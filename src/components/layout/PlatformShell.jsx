import { Outlet } from "react-router-dom";
import TopBar from "../navigation/TopBar";

export default function PlatformShell() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.11),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(20,184,166,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_18%),linear-gradient(180deg,#06101b_0%,#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.05]" />
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/9 blur-3xl" />
        <div className="absolute right-[-10rem] top-[6rem] h-[26rem] w-[26rem] rounded-full bg-sky-500/8 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[88rem] flex-col px-4 pb-8 sm:px-6 lg:px-8">
        <TopBar />
        <main className="flex-1 py-6 sm:py-10">
          <Outlet />
        </main>
        <footer className="border-t border-white/10 py-5 text-sm text-slate-400">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>BuildByAlistar.Toolsphere</span>
            <span>Multi-module tools platform for tools.livitap.com</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
