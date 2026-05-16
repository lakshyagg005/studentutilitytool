import { useState } from "react";
import CopyBtn from "./CopyBtn";
import { fmtInt } from "./helpers";

export default function AttendanceCalc() {
  const [total, setTotal] = useState("");
  const [attended, setAttended] = useState("");

  const t = parseFloat(total), a = parseFloat(attended);
  const valid = !isNaN(t) && !isNaN(a) && t > 0 && a >= 0 && a <= t;
  const pct = valid ? (a / t) * 100 : null;
  const status = pct === null ? null : pct >= 75 ? "success" : pct >= 60 ? "warning" : "danger";
  const statusLabel = status === "success" ? "✓ Safe" : status === "warning" ? "⚠ At Risk" : "✗ Danger";
  const canBunk = valid ? Math.max(0, Math.floor(a - 0.75 * t)) : null;
  const needed = valid && pct < 75 ? Math.ceil((0.75 * t - a) / 0.25) : null;
  const resultText = valid
    ? `Attendance: ${pct.toFixed(2)}% | Can bunk: ${canBunk} | Classes needed: ${needed ?? 0}`
    : "";

  return (
    <section className="tool-section" id="attendance">
      <div className="tool-header">
        <div className="tool-tag">📅 Academic</div>
        <h2 className="tool-title">Attendance Calculator</h2>
        <p className="tool-desc">Instantly check if you're safe — or how many classes you can still bunk.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Total Classes Held</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 120" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Classes Attended</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 96" value={attended} onChange={e => setAttended(e.target.value)} />
        </div>
      </div>

      {valid && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{pct.toFixed(2)}%</div>
              <div className="result-main-label">Attendance Percentage</div>
            </div>
            <span className={`result-status status-${status}`}>{statusLabel}</span>
          </div>
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card">
              <span className="result-value text-success">{canBunk}</span>
              <span className="result-label">Classes You Can Bunk</span>
            </div>
            <div className="result-card">
              <span className="result-value text-warning">{needed ?? 0}</span>
              <span className="result-label">Classes Needed for 75%</span>
            </div>
            <div className="result-card">
              <span className="result-value">{fmtInt(a)}</span>
              <span className="result-label">Attended</span>
            </div>
            <div className="result-card">
              <span className="result-value">{fmtInt(t - a)}</span>
              <span className="result-label">Missed</span>
            </div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={resultText} />
            <button className="btn-tool btn-reset" onClick={() => { setTotal(""); setAttended(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
