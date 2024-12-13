import { Routes, Route, Navigate } from "react-router-dom";
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { SignIn } from "@/components/auth/SignIn";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

export function AppRoutes({ isAuthenticated }: AppRoutesProps) {
  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<AuthenticatedRoutes />} />
      ) : (
        <>
          <Route element={<AuthLayout />}>
            <Route path="/auth/signin" element={<SignIn />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to="/auth/signin" replace />}
          />
        </>
      )}
    </Routes>
  );
}