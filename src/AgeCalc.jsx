import { useState } from "react";
import CopyBtn from "./CopyBtn";

export default function AgeCalc() {
  const [dob, setDob] = useState("");
  const today = new Date();

  let years = null, months = null, days = null, nextBirthday = null, dayOfWeek = null;
  if (dob) {
    const birth = new Date(dob);
    if (!isNaN(birth)) {
      years = today.getFullYear() - birth.getFullYear();
      months = today.getMonth() - birth.getMonth();
      days = today.getDate() - birth.getDate();

      if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }

      const nextBD = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBD < today) nextBD.setFullYear(today.getFullYear() + 1);
      nextBirthday = Math.ceil((nextBD - today) / (1000 * 60 * 60 * 24));
      dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][birth.getDay()];
    }
  }

  return (
    <section className="tool-section" id="age">
      <div className="tool-header">
        <div className="tool-tag">🎂 Utility</div>
        <h2 className="tool-title">Age Calculator</h2>
        <p className="tool-desc">Find your exact age in years, months, and days — plus when your next birthday is.</p>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label">Date of Birth</label>
          <input
            className="form-input"
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            max={today.toISOString().split("T")[0]}
          />
        </div>
      </div>
      {years !== null && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{years} <span style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>yrs</span></div>
              <div className="result-main-label">Your Current Age</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {nextBirthday === 0 ? "🎉 Today!" : `In ${nextBirthday} days`}
              </div>
              <div className="result-main-label">Next Birthday</div>
            </div>
          </div>
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card"><span className="result-value">{years}</span><span className="result-label">Years</span></div>
            <div className="result-card"><span className="result-value">{months}</span><span className="result-label">Months</span></div>
            <div className="result-card"><span className="result-value">{days}</span><span className="result-label">Days</span></div>
            <div className="result-card"><span className="result-value" style={{ fontSize: "0.95rem" }}>{dayOfWeek}</span><span className="result-label">Born On</span></div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={`Age: ${years} years, ${months} months, ${days} days | Next birthday in ${nextBirthday} days`} />
            <button className="btn-tool btn-reset" onClick={() => setDob("")}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
