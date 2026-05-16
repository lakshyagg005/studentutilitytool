import { useState } from "react";
import CopyBtn from "./CopyBtn";
import { fmt } from "./helpers";

export default function SalaryCalc() {
  const [ctc, setCTC] = useState("");
  const annual = parseFloat(ctc) || 0;
  const monthly = annual / 12;

  let tax = 0;
  if (annual > 1500000) tax = 150000 + (annual - 1500000) * 0.3;
  else if (annual > 1200000) tax = 90000 + (annual - 1200000) * 0.2;
  else if (annual > 900000) tax = 45000 + (annual - 900000) * 0.15;
  else if (annual > 600000) tax = 15000 + (annual - 600000) * 0.1;
  else if (annual > 300000) tax = (annual - 300000) * 0.05;

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  const pf = Math.min(annual * 0.12, 21600);
  const inHand = annual - totalTax - pf;
  const inHandMonthly = inHand / 12;

  return (
    <section className="tool-section" id="salary">
      <div className="tool-header">
        <div className="tool-tag">💰 Finance</div>
        <h2 className="tool-title">Salary Calculator</h2>
        <p className="tool-desc">Estimate your take-home salary after taxes (New Tax Regime, FY 2024-25).</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Annual CTC (₹)</label>
          <input className="form-input" type="number" min="0" placeholder="e.g. 800000" value={ctc} onChange={e => setCTC(e.target.value)} />
        </div>
      </div>
      {annual > 0 && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">₹{fmt(inHandMonthly)}</div>
              <div className="result-main-label">Monthly In-Hand Salary</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>₹{fmt(inHand)}</div>
              <div className="result-main-label">Annual In-Hand</div>
            </div>
          </div>
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(monthly)}</span>
              <span className="result-label">Gross Monthly</span>
            </div>
            <div className="result-card">
              <span className="result-value text-danger" style={{ fontSize: "1.2rem" }}>₹{fmt(totalTax)}</span>
              <span className="result-label">Total Tax (incl. cess)</span>
            </div>
            <div className="result-card">
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(pf)}</span>
              <span className="result-label">PF Deduction</span>
            </div>
          </div>
          <p className="info-text">Based on New Tax Regime. Includes 4% health & education cess. PF capped at ₹21,600/yr.</p>
          <div className="tool-actions">
            <CopyBtn text={`Monthly in-hand: ₹${fmt(inHandMonthly)} | Annual in-hand: ₹${fmt(inHand)} | Tax: ₹${fmt(totalTax)}`} />
            <button className="btn-tool btn-reset" onClick={() => setCTC("")}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
