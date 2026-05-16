// ─── NUMBER FORMATTING ────────────────────────────────────────────────────────
export const fmt = (n, d = 2) => {
  if (isNaN(n) || !isFinite(n)) return "—";
  return Number(n).toLocaleString("en-IN", {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
};

export const fmtInt = (n) => {
  if (isNaN(n) || !isFinite(n)) return "—";
  return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

// ─── TIMER ────────────────────────────────────────────────────────────────────
export const pad = (n) => String(Math.floor(n)).padStart(2, "0");

// ─── CLIPBOARD ────────────────────────────────────────────────────────────────
export const copyText = (text, setCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
};
