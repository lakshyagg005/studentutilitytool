import { useState } from "react";
import CopyBtn from "./CopyBtn";

export default function BoardPredictor() {
  const [mock1, setMock1] = useState("");
  const [mock2, setMock2] = useState("");
  const [internal, setInternal] = useState("");
  const [maxInternal, setMaxInternal] = useState("20");

  const m1 = parseFloat(mock1) || 0, m2 = parseFloat(mock2) || 0;
  const intM = parseFloat(internal) || 0, maxInt = parseFloat(maxInternal) || 20;
  const hasInput = mock1 || mock2 || internal;
  const avgMock = (m1 + m2) / 2;
  const scaledInternal = maxInt > 0 ? (intM / maxInt) * 100 : 0;
  const predicted = hasInput ? avgMock * 0.7 + scaledInternal * 0.3 : null;
  const grade =
    predicted === null ? "—"
    : predicted >= 90 ? "O"
    : predicted >= 80 ? "A+"
    : predicted >= 70 ? "A"
    : predicted >= 60 ? "B+"
    : predicted >= 50 ? "B"
    : predicted >= 40 ? "C"
    : "F";

  return (
    <section className="tool-section" id="board">
      <div className="tool-header">
        <div className="tool-tag">🎯 Academic</div>
        <h2 className="tool-title">Board Result Predictor</h2>
        <p className="tool-desc">Estimate your final board percentage based on mock tests and internals.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Mock Test 1 (out of 100)</label>
          <input className="form-input" type="number" min="0" max="100" placeholder="e.g. 78" value={mock1} onChange={e => setMock1(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Mock Test 2 (out of 100)</label>
          <input className="form-input" type="number" min="0" max="100" placeholder="e.g. 82" value={mock2} onChange={e => setMock2(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Internal Marks</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 16" value={internal} onChange={e => setInternal(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Internal Max Marks</label>
          <input className="form-input" type="number" min="1" placeholder="20" value={maxInternal} onChange={e => setMaxInternal(e.target.value)} />
        </div>
      </div>

      {hasInput && predicted !== null && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{predicted.toFixed(1)}%</div>
              <div className="result-main-label">Predicted Final Percentage</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "var(--accent)" }}>{grade}</div>
              <div className="result-main-label">Expected Grade</div>
            </div>
          </div>
          <p className="info-text" style={{ marginTop: "0.75rem" }}>Prediction based on mock exam weightage (70%) and internal marks (30%).</p>
          <div className="tool-actions">
            <CopyBtn text={`Predicted: ${predicted.toFixed(1)}% | Grade: ${grade}`} />
            <button className="btn-tool btn-reset" onClick={() => { setMock1(""); setMock2(""); setInternal(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
