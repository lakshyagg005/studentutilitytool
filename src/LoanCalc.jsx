import { useState } from "react";
import CopyBtn from "./CopyBtn";
import { fmt } from "./helpers";

export default function LoanCalc() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const P = parseFloat(principal), r = parseFloat(rate) / 100, n = parseFloat(years);
  const valid = P > 0 && r > 0 && n > 0;
  const simpleInterest = valid ? P * r * n : null;
  const totalRepayment = valid ? P + simpleInterest : null;
  const compoundTotal = valid ? P * Math.pow(1 + r, n) : null;
  const compoundInterest = compoundTotal ? compoundTotal - P : null;

  return (
    <section className="tool-section" id="loan">
      <div className="tool-header">
        <div className="tool-tag">🏦 Finance</div>
        <h2 className="tool-title">Loan Calculator</h2>
        <p className="tool-desc">Calculate simple and compound interest repayments on any loan.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Principal Amount (₹)</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 200000" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Annual Interest Rate (%)</label>
          <input className="form-input" type="number" min="0.1" step="0.1" placeholder="e.g. 10" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Duration (Years)</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 5" value={years} onChange={e => setYears(e.target.value)} />
        </div>
      </div>
      {valid && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
              <div className="form-label" style={{ marginBottom: "0.75rem" }}>Simple Interest</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>₹{fmt(totalRepayment)}</div>
              <div className="result-label">Total Repayment</div>
              <div className="divider" />
              <div style={{ color: "var(--warning)", fontWeight: 600 }}>₹{fmt(simpleInterest)}</div>
              <div className="result-label">Interest Only</div>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem" }}>
              <div className="form-label" style={{ marginBottom: "0.75rem" }}>Compound Interest</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>₹{fmt(compoundTotal)}</div>
              <div className="result-label">Total Repayment</div>
              <div className="divider" />
              <div style={{ color: "var(--danger)", fontWeight: 600 }}>₹{fmt(compoundInterest)}</div>
              <div className="result-label">Interest Only</div>
            </div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={`SI Repayment: ₹${fmt(totalRepayment)} | CI Repayment: ₹${fmt(compoundTotal)}`} />
            <button className="btn-tool btn-reset" onClick={() => { setPrincipal(""); setRate(""); setYears(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
