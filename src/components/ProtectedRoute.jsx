import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="premium-panel-strong w-full max-w-md p-8 text-center">
          <p className="premium-kicker">Checking session</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Loading your workspace</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">Please wait while we verify your sign-in state.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
