import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import {
  AuthButton,
  AuthInput,
} from "../components/auth/AuthFormFields";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiErrors";
import { validateEmail, validatePassword } from "../utils/validation";

export function LoginPage() {
  const { user, loading: authLoading, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(
    /** @type {{ email?: string, password?: string, form?: string }} */ ({}),
  );
  const [submitting, setSubmitting] = useState(false);

  const from = useMemo(
    () => location.state?.from?.pathname || "/",
    [location.state],
  );

  if (authLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black text-zinc-500">
        Loading…
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validateEmail(email);
    const vp = validatePassword(password);
    if (ve || vp) {
      setErrors({ email: ve || undefined, password: vp || undefined });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setErrors({
        form: getApiErrorMessage(
          err,
          "Could not sign in. Check your details and try again.",
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your private Mental AI workspace."
      footer={
        <>
          New here?{" "}
          <Link
            className="font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline"
            to="/signup"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {errors.form ? (
          <p
            className="mb-4 rounded-xl border border-red-500/30 bg-red-950/25 px-3 py-2 text-sm text-red-300"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          disabled={submitting}
        />
        <div className="mt-4">
          <AuthInput
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={submitting}
          />
        </div>
        <AuthButton loading={submitting} disabled={submitting}>
          Continue
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
