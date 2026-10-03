"use client";
import { useActionState } from "react";
import { changePasswordAction, type PasswordFormState } from "@/app/account-actions";
import PasswordField from "./PasswordField";

const initial: PasswordFormState = { error: "", saved: false };

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initial);
  return (
    <form action={action} className="profile-form" key={state.saved ? "reset" : "form"}>
      <PasswordField name="currentPassword" label="Current password" autoComplete="current-password" />
      <PasswordField name="newPassword" label="New password" autoComplete="new-password" />
      <div className="row">
        <button type="submit" disabled={pending}>{pending ? "Updating…" : "Update password"}</button>
      </div>
      <p role="status" aria-live="polite" className="status">
        {state.error && <span className="error">{state.error}</span>}
        {state.saved && !state.error && "Password updated."}
      </p>
    </form>
  );
}
