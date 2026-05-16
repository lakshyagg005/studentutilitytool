import { useState } from "react";
import CopyBtn from "./CopyBtn";

// Grade derived from percentage — purely display, does not affect formula
function getGrade(pct) {
  if (pct >= 90) return { label: "A+", color: "var(--success)" };
  if (pct >= 80) return { label: "A",  color: "var(--success)" };
  if (pct >= 70) return { label: "B+", color: "var(--success)" };
  if (pct >= 60) return { label: "B",  color: "var(--accent)" };
  if (pct >= 50) return { label: "C",  color: "var(--accent)" };
  if (pct >= 35) return { label: "D",  color: "var(--warning)" };
  return            { label: "F",  color: "var(--danger)" };
}

export default function PercentageCalc() {
  const [obtained, setObtained] = useState("");
  const [total,    setTotal]    = useState("");

  // ── All original logic untouched ──────────────────────────────────────────
  const o = parseFloat(obtained), t = parseFloat(total);
  const valid  = !isNaN(o) && !isNaN(t) && t > 0 && o >= 0;
  const pct    = valid ? (o / t) * 100 : null;
  const passed = pct !== null && pct >= 35;
  // ─────────────────────────────────────────────────────────────────────────

  const grade   = pct !== null ? getGrade(pct) : null;
  const missed  = valid ? t - o : null;
  const copyTxt = valid ? `${pct.toFixed(2)}% (${obtained}/${total})` : "";

  return (
    <section className="tool-section" id="percentage">
      <div className="tool-header">
        <div className="tool-tag">📊 Academic</div>
        <h2 className="tool-title">Percentage Calculator</h2>
        <p className="tool-desc">Convert your raw marks into a clean percentage in seconds.</p>
      </div>

      {/* ── Inputs — layout and validation unchanged ── */}
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Obtained Marks</label>
          <input
            className="form-input"
            type="number"
            min="0"
            placeholder="e.g. 456"
            value={obtained}
            onChange={e => setObtained(e.target.value)}
            aria-label="Obtained marks"
          />
        </div>
        <div className="form-field">
          <label className="form-label">Total Marks</label>
          <input
            className="form-input"
            type="number"
            min="1"
            placeholder="e.g. 600"
            value={total}
            onChange={e => setTotal(e.target.value)}
            aria-label="Total marks"
          />
        </div>
      </div>

      {/* ── Results — same conditional, polished display ── */}
      {valid && (
        <>
          {/* Primary result row */}
          <div className="result-main">
            <div>
              <div className="result-main-value">{pct.toFixed(2)}%</div>
              <div className="result-main-label">Your Percentage</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
              {/* Pass/Fail — original logic */}
              <span className={`result-status ${passed ? "status-success" : "status-danger"}`}>
                {passed ? "✓ Pass" : "✗ Fail"}
              </span>
              {/* Grade badge — new display element, no logic change */}
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: grade.color,
                  background: "var(--bg-card)",
                  border: `1px solid ${grade.color}30`,
                  borderRadius: "var(--radius-sm)",
                  padding: "3px 12px",
                  letterSpacing: "0.04em",
                }}
                aria-label={`Grade ${grade.label}`}
              >
                Grade {grade.label}
              </span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.3rem" }}>{o}</span>
              <span className="result-label">Marks Obtained</span>
            </div>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.3rem" }}>{t}</span>
              <span className="result-label">Total Marks</span>
            </div>
            <div className="result-card">
              <span className="result-value text-danger" style={{ fontSize: "1.3rem" }}>{missed}</span>
              <span className="result-label">Marks Lost</span>
            </div>
            <div className="result-card">
              <span
                className="result-value"
                style={{ fontSize: "1.1rem", color: grade.color }}
              >
                {grade.label}
              </span>
              <span className="result-label">Grade</span>
            </div>
          </div>

          {/* Actions — copy and reset, same as before */}
          <div className="tool-actions">
            <CopyBtn text={copyTxt} />
            <button
              className="btn-tool btn-reset"
              onClick={() => { setObtained(""); setTotal(""); }}
            >
              ↺ Reset
            </button>
          </div>
        </>
      )}
    </section>
  );
}