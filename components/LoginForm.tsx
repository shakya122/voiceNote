"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthFormState } from "@/app/auth-actions";
import PasswordField from "./PasswordField";

const initial: AuthFormState = { error: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="auth-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />

      <PasswordField name="password" label="Password" autoComplete="current-password" />

      <button type="submit" disabled={pending}>{pending ? "Logging in…" : "Log in"}</button>
      <p role="status" aria-live="polite" className="status">{state.error && <span className="error">{state.error}</span>}</p>
      <p className="switch">No account yet? <Link href="/signup">Create one</Link></p>
    </form>
  );
}
