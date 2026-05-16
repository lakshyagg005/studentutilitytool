import { useState } from "react";
import CopyBtn from "./CopyBtn";

const gradePoints = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, F: 0 };

export default function CGPACalc() {
  const [subjects, setSubjects] = useState([
    { name: "Subject 1", grade: "O", credits: "4" },
    { name: "Subject 2", grade: "A+", credits: "3" },
  ]);

  const addSubject = () =>
    setSubjects(s => [...s, { name: `Subject ${s.length + 1}`, grade: "A", credits: "3" }]);
  const removeSubject = i => setSubjects(s => s.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    setSubjects(s => s.map((sub, idx) => (idx === i ? { ...sub, [key]: val } : sub)));

  const totalCredits = subjects.reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0);
  const weightedSum = subjects.reduce(
    (sum, s) => sum + (gradePoints[s.grade] || 0) * (parseFloat(s.credits) || 0),
    0
  );
  const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
  const percentage = cgpa * 9.5;

  return (
    <section className="tool-section" id="cgpa">
      <div className="tool-header">
        <div className="tool-tag">🎓 Academic</div>
        <h2 className="tool-title">CGPA Calculator</h2>
        <p className="tool-desc">Add your subjects, pick your grade, and get your weighted CGPA instantly.</p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span className="form-label">Subject</span>
          <span className="form-label">Grade</span>
          <span className="form-label">Credits</span>
          <span />
        </div>
        {subjects.map((sub, i) => (
          <div className="subject-row" key={i}>
            <input className="form-input" value={sub.name} onChange={e => update(i, "name", e.target.value)} placeholder="Subject name" />
            <select className="form-select" value={sub.grade} onChange={e => update(i, "grade", e.target.value)}>
              {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input className="form-input" type="number" min="1" max="6" value={sub.credits} onChange={e => update(i, "credits", e.target.value)} placeholder="Credits" />
            <button className="btn-remove" onClick={() => removeSubject(i)} title="Remove">✕</button>
          </div>
        ))}
        <button className="btn-add-subject" onClick={addSubject}>+ Add Subject</button>
      </div>

      {totalCredits > 0 && (
        <>
          <div className="result-main">
            <div>
              <div className="result-main-value">{cgpa.toFixed(2)}</div>
              <div className="result-main-label">Your CGPA</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>{percentage.toFixed(2)}%</div>
              <div className="result-main-label">Equivalent Percentage</div>
            </div>
          </div>
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card">
              <span className="result-value">{totalCredits}</span>
              <span className="result-label">Total Credits</span>
            </div>
            <div className="result-card">
              <span className="result-value">{subjects.length}</span>
              <span className="result-label">Subjects</span>
            </div>
          </div>
          <div className="tool-actions">
            <CopyBtn text={`CGPA: ${cgpa.toFixed(2)} | Percentage: ${percentage.toFixed(2)}%`} />
            <button className="btn-tool btn-reset" onClick={() => setSubjects([{ name: "Subject 1", grade: "O", credits: "4" }])}>↺ Reset</button>
          </div>
        </>
      )}
    </section>
  );
}
