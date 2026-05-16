import { useState } from "react";
import { copyText } from "./helpers";

export default function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`btn-tool btn-copy ${copied ? "copied" : ""}`}
      onClick={() => copyText(text, setCopied)}
    >
      {copied ? "✓ Copied" : "⎘ Copy"}
    </button>
  );
}
