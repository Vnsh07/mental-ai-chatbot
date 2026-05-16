import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black text-zinc-400">
        <div className="text-center">
          <p className="font-display text-sm font-medium text-zinc-300">
            Authenticating…
          </p>
          <p className="mt-1 text-xs text-zinc-600">Securing your session</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
