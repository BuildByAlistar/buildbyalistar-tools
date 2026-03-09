import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-zinc-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-950 text-white p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-zinc-400 mb-6">Sign in to access your AI tools dashboard.</p>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}