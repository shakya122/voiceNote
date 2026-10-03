"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export interface RichEditorHandle {
  focus: () => void;
  insertText: (text: string) => void;
}

interface Props {
  name: string;
  initialHtml: string;
  label: string;
  placeholder?: string;
  onChangeText?: (plainText: string) => void;
}

const COMMANDS: { command: string; label: string; icon: React.ReactNode }[] = [
  { command: "bold", label: "Bold", icon: <strong>B</strong> },
  { command: "italic", label: "Italic", icon: <em>I</em> },
  { command: "underline", label: "Underline", icon: <span style={{ textDecoration: "underline" }}>U</span> },
  { command: "insertUnorderedList", label: "Bulleted list", icon: <span aria-hidden="true">•≡</span> },
  { command: "insertOrderedList", label: "Numbered list", icon: <span aria-hidden="true">1≡</span> },
];

const COLORS = ["#0B2027", "#0E9594", "#A52A2A", "#E6A817", "#5C7A80"];
const MAX_IMAGE_WIDTH = 900;

/** A small contentEditable rich text box: bold/italic/underline, lists, text colour, and images. */
const RichEditor = forwardRef<RichEditorHandle, Props>(function RichEditor(
  { name, initialHtml, label, placeholder = "Write your note here...", onChangeText },
  ref
) {
  const editableRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [imageStatus, setImageStatus] = useState("");

  useImperativeHandle(ref, () => ({
    focus: () => editableRef.current?.focus(),
    insertText: (text: string) => {
      const el = editableRef.current;
      if (!el) return;
      el.focus();
      document.execCommand("insertText", false, (el.textContent ? " " : "") + text);
      sync();
    },
  }));

  useEffect(() => {
    if (editableRef.current && !editableRef.current.innerHTML) {
      editableRef.current.innerHTML = initialHtml;
      sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sync() {
    const html = editableRef.current?.innerHTML ?? "";
    if (hiddenRef.current) {
      hiddenRef.current.value = html;
    }
    onChangeText?.(editableRef.current?.textContent ?? "");
    refreshActiveState();
  }

  function refreshActiveState() {
    const next: Record<string, boolean> = {};
    for (const { command } of COMMANDS) {
      try {
        next[command] = document.queryCommandState(command);
      } catch {
        /* ignore */
      }
    }
    setActive(next);
  }

  function run(command: string) {
    editableRef.current?.focus();
    document.execCommand(command);
    sync();
  }

  function rememberSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editableRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function setColor(color: string) {
    editableRef.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, color);
    sync();
  }

  function pickImage() {
    rememberSelection();
    fileRef.current?.click();
  }

  function onImageChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageStatus("Please choose an image file.");
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        editableRef.current?.focus();
        restoreSelection();
        document.execCommand("insertImage", false, dataUrl);
        setImageStatus("Image added.");
        sync();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label={`Formatting for ${label}`}>
        {COMMANDS.map(({ command, label: cmdLabel, icon }) => (
          <button
            key={command}
            type="button"
            className="rich-btn"
            aria-pressed={!!active[command]}
            aria-label={cmdLabel}
            title={cmdLabel}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(command)}
          >
            {icon}
          </button>
        ))}
        <span className="rich-colors" role="group" aria-label="Text colour">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className="rich-color-btn"
              style={{ background: c }}
              aria-label={`Text colour ${c}`}
              onMouseDown={(e) => {
                e.preventDefault();
                rememberSelection();
              }}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            className="rich-color-input"
            aria-label="Custom text colour"
            onMouseDown={rememberSelection}
            onChange={(e) => setColor(e.target.value)}
          />
        </span>
        <button
          type="button"
          className="rich-btn"
          aria-label="Insert image"
          title="Insert image"
          onMouseDown={(e) => e.preventDefault()}
          onClick={pickImage}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="visually-hidden" onChange={onImageChosen} aria-label="Choose an image to insert" />
      </div>
      <div
        ref={editableRef}
        className="rich-editable"
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
        onKeyUp={refreshActiveState}
        onMouseUp={refreshActiveState}
        suppressContentEditableWarning
      />
      <p role="status" aria-live="polite" className="visually-hidden">
        {imageStatus}
      </p>
      <input ref={hiddenRef} type="hidden" name={name} />
    </div>
  );
});

export default RichEditor;