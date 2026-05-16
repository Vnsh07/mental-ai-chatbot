import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import {
  AuthButton,
  AuthInput,
} from "../components/auth/AuthFormFields";
import { useAuth } from "../context/AuthContext";

function validateEmail(email) {
  const t = email.trim();
  if (!t) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return "Enter a valid email";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Use at least 8 characters";
  if (password.length > 128) return "Password is too long";
  return "";
}

export function SignupPage() {
  const { user, loading: authLoading, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState(
    /** @type {{ email?: string, password?: string, confirm?: string, form?: string }} */ (
      {}
    ),
  );
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-black text-zinc-500">
        Loading…
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validateEmail(email);
    const vp = validatePassword(password);
    let vc = "";
    if (password !== confirm) vc = "Passwords do not match";
    if (ve || vp || vc) {
      setErrors({
        email: ve || undefined,
        password: vp || undefined,
        confirm: vc || undefined,
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await signup({
        email: email.trim(),
        password,
        full_name: fullName.trim() || null,
      });
    } catch (err) {
      const d = err?.response?.data?.detail;
      const msg =
        typeof d === "string"
          ? d
          : Array.isArray(d)
            ? d.map((x) => x.msg || x).join(" ")
            : "Could not create account.";
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your Mental AI workspace with secure authentication."
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline"
            to="/login"
          >
            Sign in
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
          id="signup-name"
          label="Full name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
          disabled={submitting}
        />
        <div className="mt-4">
          <AuthInput
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={submitting}
          />
        </div>
        <div className="mt-4">
          <AuthInput
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={submitting}
          />
        </div>
        <div className="mt-4">
          <AuthInput
            id="signup-confirm"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            error={errors.confirm}
            disabled={submitting}
          />
        </div>
        <AuthButton loading={submitting} disabled={submitting}>
          Create account
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
