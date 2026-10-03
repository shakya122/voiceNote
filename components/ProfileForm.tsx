"use client";
import { useActionState, useRef, useState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/app/profile-actions";

const initial: ProfileFormState = { error: "", saved: false };
const AVATAR_SIZE = 160;

interface ProfileFields { name: string; avatarDataUrl: string | null }

export default function ProfileForm({ profile }: { profile: ProfileFields }) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);
  const [avatar, setAvatar] = useState<string | null>(profile.avatarDataUrl);
  const [name, setName] = useState(profile.name);
  const [photoStatus, setPhotoStatus] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setPhotoStatus("Please choose an image file."); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE; canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const scale = Math.max(AVATAR_SIZE / img.width, AVATAR_SIZE / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (AVATAR_SIZE - w) / 2, (AVATAR_SIZE - h) / 2, w, h);
        setAvatar(canvas.toDataURL("image/jpeg", 0.85));
        setPhotoStatus("New photo selected. Press Save changes to keep it.");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <form action={action} className="profile-form">
      <input type="hidden" name="avatar" value={avatar ?? ""} readOnly />

      <div className="avatar-picker">
        <span className="avatar avatar-lg" aria-hidden="true">
          {avatar ? <img src={avatar} alt="" /> : (name.trim().charAt(0).toUpperCase() || "?")}
        </span>
        <div>
          <button type="button" onClick={() => fileInput.current?.click()}>Choose photo</button>
          {avatar && (
            <button type="button" className="secondary" onClick={() => { setAvatar(null); setPhotoStatus("Photo removed. Press Save changes to keep this."); }}>
              Remove photo
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="visually-hidden"
            aria-label="Choose a profile photo"
          />
          <p role="status" aria-live="polite" className="status">{photoStatus}</p>
        </div>
      </div>

      <label htmlFor="name">Your name</label>
      <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />

      <div className="row">
        <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
      </div>
      <p role="status" aria-live="polite" className="status">
        {state.error && <span className="error">{state.error}</span>}
        {state.saved && !state.error && "Saved."}
      </p>
    </form>
  );
}
