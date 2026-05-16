import { useState } from "react";
import CopyBtn from "./CopyBtn";
import { fmt } from "./helpers";

export default function EMICalc() {
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");

  const P = parseFloat(loan), r = parseFloat(rate) / 12 / 100, n = parseFloat(tenure);
  const valid = P > 0 && r > 0 && n > 0;
  const emi = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : null;
  const totalPayment = emi ? emi * n : null;
  const totalInterest = totalPayment ? totalPayment - P : null;

  return (
    <section className="tool-section" id="emi">
      <div className="tool-header">
        <div className="tool-tag">💳 Finance</div>
        <h2 className="tool-title">EMI Calculator</h2>
        <p className="tool-desc">Know your monthly instalment, total interest, and total repayment instantly.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Loan Amount (₹)</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 500000" value={loan} onChange={e => setLoan(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Annual Interest Rate (%)</label>
          <input className="form-input" type="number" min="0.1" step="0.1" placeholder="e.g. 8.5" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Tenure (Months)</label>
          <input className="form-input" type="number" min="1" placeholder="e.g. 36" value={tenure} onChange={e => setTenure(e.target.value)} />
        </div>
      </div>
      {valid && emi && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">₹{fmt(emi)}</div>
              <div className="result-main-label">Monthly EMI</div>
            </div>
          </div>
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.3rem" }}>₹{fmt(P)}</span>
              <span className="result-label">Principal</span>
            </div>
            <div className="result-card">
              <span className="result-value text-warning" style={{ fontSize: "1.3rem" }}>₹{fmt(totalInterest)}</span>
              <span className="result-label">Total Interest</span>
            </div>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.3rem" }}>₹{fmt(totalPayment)}</span>
              <span className="result-label">Total Payment</span>
            </div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={`EMI: ₹${fmt(emi)} | Interest: ₹${fmt(totalInterest)} | Total: ₹${fmt(totalPayment)}`} />
            <button className="btn-tool btn-reset" onClick={() => { setLoan(""); setRate(""); setTenure(""); }}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
