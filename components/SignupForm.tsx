"use client";
import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type AuthFormState } from "@/app/auth-actions";
import PasswordField from "./PasswordField";

const initial: AuthFormState = { error: "" };

export default function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initial);
  return (
    <form action={action} className="auth-form">
      <label htmlFor="name">Your name</label>
      <input id="name" name="name" type="text" autoComplete="name" maxLength={80} required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />

      <PasswordField name="password" label="Password" autoComplete="new-password" />

      <button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
      <p role="status" aria-live="polite" className="status">{state.error && <span className="error">{state.error}</span>}</p>
      <p className="switch">Already have an account? <Link href="/login">Log in</Link></p>
    </form>
  );
}
