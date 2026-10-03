import Link from "next/link";
import { auth } from "@/lib/auth";
import Logo from "@/components/Logo";

export default async function LandingPage() {
  const session = await auth();
  const loggedIn = !!session?.user;

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="brand">
          <Logo />
          <span>VoiceNotes</span>
        </div>
        <nav className="landing-nav" aria-label="Account">
          {loggedIn ? <Link href="/notes">Go to your notes</Link> : <Link href="/login">Log in</Link>}
        </nav>
      </header>

      <main className="hero">
        <h1 className="fade-in-1">Notes you can speak, search, and ask questions of.</h1>
        <p className="lede fade-in-2">
          Type or talk, and VoiceNotes writes it down. Ask it a plain-language question later —
          &ldquo;where is my key?&rdquo; — and it reads the answer back to you. Built to work well
          with a screen reader, not just look fine with one.
        </p>
        <div className="cta-row fade-in-3">
          <Link href={loggedIn ? "/notes" : "/signup"} className="btn-primary btn-large">
            {loggedIn ? "Go to your notes" : "Get started — it's free"}
          </Link>
        </div>
      </main>

      <div className="wave-banner" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave wave-back">
          <path d="M0,40 C200,90 400,0 600,40 C800,80 1000,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave wave-front">
          <path d="M0,60 C250,10 450,100 700,55 C900,20 1050,70 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <section className="features" aria-label="Features">
        <div className="feature-card">
          <h2>Speak or type</h2>
          <p>Press the microphone and talk. Your words are written into a note automatically.</p>
        </div>
        <div className="feature-card">
          <h2>Ask your notes</h2>
          <p>Ask a question in plain English and get an answer drawn only from what you've written, read aloud on request.</p>
        </div>
        <div className="feature-card">
          <h2>Built to be heard</h2>
          <p>Every note, button and status message works with a screen reader, keyboard-only use, and text-to-speech.</p>
        </div>
        <div className="feature-card">
          <h2>Private by account</h2>
          <p>Your notes are yours. Passwords are hashed, and each account only ever sees its own notes.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Don't store real passwords, card or bank numbers here — this is a portfolio project, not a vault.</p>
      </footer>
    </div>
  );
}
