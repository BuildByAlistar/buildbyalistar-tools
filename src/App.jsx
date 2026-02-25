import { useAuth } from  "./context/AuthContext.jsx";

export default function App() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white bg-[#07090E]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">ToolSphere</h1>
            <p className="text-white/70 text-sm">AI Tools Hub</p>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{user.displayName}</div>
                <div className="text-xs text-white/60">{user.email}</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
            >
              Sign in with Google
            </button>
          )}
        </header>

        {!user ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Welcome</h2>
            <p className="text-white/70">
              Sign in to access your AI tools dashboard.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ToolCard title="AI Data Entry" desc="Fast form → structured output" />
            <ToolCard title="Lead Cleaner" desc="Clean CSV leads instantly" />
            <ToolCard title="Content Assistant" desc="Generate posts & captions" />
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCard({ title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-white/70 mt-1">{desc}</div>
      <button className="mt-4 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">
        Open
      </button>
    </div>
  );
}