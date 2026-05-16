import { useState } from "react";
import CopyBtn from "./CopyBtn";

export default function PercentageCalc() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const o = parseFloat(obtained), t = parseFloat(total);
  const valid = !isNaN(o) && !isNaN(t) && t > 0 && o >= 0;
  const pct = valid ? (o / t) * 100 : null;
  const passed = pct !== null && pct >= 35;

  return (
    <section className="tool-section" id="percentage">
      <div className="tool-header">
        <div className="tool-tag">📊 Academic</div>
        <h2 className="tool-title">Percentage Calculator</h2>
        <p className="tool-desc">Convert your raw marks into a clean percentage in seconds.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Obtained Marks</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 456" value={obtained} onChange={e => setObtained(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Total Marks</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 600" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
      </div>
      {valid && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{pct.toFixed(2)}%</div>
              <div className="result-main-label">Your Percentage</div>
            </div>
            <span className={`result-status ${passed ? "status-success" : "status-danger"}`}>
              {passed ? "✓ Pass" : "✗ Fail"}
            </span>
          </div>
          <div className="tool-actions">
            <CopyBtn text={`${pct.toFixed(2)}%`} />
            <button className="btn-tool btn-reset" onClick={() => { setObtained(""); setTotal(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
