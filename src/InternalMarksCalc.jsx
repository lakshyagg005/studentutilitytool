import { useState } from "react";
import CopyBtn from "./CopyBtn";

export default function InternalMarksCalc() {
  const [assign, setAssign] = useState("");
  const [attend, setAttend] = useState("");
  const [practical, setPractical] = useState("");
  const [maxAssign, setMaxAssign] = useState("20");
  const [maxAttend, setMaxAttend] = useState("10");
  const [maxPractical, setMaxPractical] = useState("20");
  const [internalMax, setInternalMax] = useState("30");

  const a = parseFloat(assign) || 0, b = parseFloat(attend) || 0, c = parseFloat(practical) || 0;
  const ma = parseFloat(maxAssign) || 20, mb = parseFloat(maxAttend) || 10, mc = parseFloat(maxPractical) || 20;
  const mi = parseFloat(internalMax) || 30;
  const total = a + b + c;
  const maxTotal = ma + mb + mc;
  const scaled = maxTotal > 0 ? (total / maxTotal) * mi : 0;
  const result = `Internal: ${scaled.toFixed(2)} / ${mi}`;

  return (
    <section className="tool-section" id="internal">
      <div className="tool-header">
        <div className="tool-tag">📝 Academic</div>
        <h2 className="tool-title">Internal Marks Calculator</h2>
        <p className="tool-desc">Predict your internal score from assignments, attendance, and practicals.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Assignment Marks (out of {maxAssign})</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 17" value={assign} onChange={e => setAssign(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Attendance Marks (out of {maxAttend})</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 8" value={attend} onChange={e => setAttend(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Practical Marks (out of {maxPractical})</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 16" value={practical} onChange={e => setPractical(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Internal Max Marks</label>
          <input className="form-input" type="number" min="1" placeholder="30" value={internalMax} onChange={e => setInternalMax(e.target.value)} />
        </div>
      </div>

      {(assign || attend || practical) && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{scaled.toFixed(2)}</div>
              <div className="result-main-label">Predicted Internal Score out of {mi}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-secondary)" }}>{((scaled / mi) * 100).toFixed(1)}%</div>
              <div className="result-main-label">of Internal Marks</div>
            </div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={result} />
            <button className="btn-tool btn-reset" onClick={() => { setAssign(""); setAttend(""); setPractical(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
