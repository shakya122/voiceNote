"use client";
import { useId, useState } from "react";

interface Props {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
}

export default function PasswordField({ name, label, autoComplete }: Props) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="password-field">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={6}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A9.6 9.6 0 0 1 12 5c5 0 9 4.5 10 7-.5 1.1-1.3 2.4-2.4 3.6M6.7 6.7C4.7 8 3.3 9.8 2 12c1.4 3 5 7 10 7 1.3 0 2.5-.3 3.6-.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12c1.4-3 5-7 10-7s8.6 4 10 7c-1.4 3-5 7-10 7s-8.6-4-10-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8"/></svg>
          )}
        </button>
      </div>
    </>
  );
}
