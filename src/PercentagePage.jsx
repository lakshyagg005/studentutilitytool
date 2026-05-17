import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import PercentageCalc from "./PercentageCalc";

const tool = TOOLS.find(t => t.id === "percentage");

const RELATED_IDS = ["cgpa", "attendance", "internal", "board", "emi", "salary"];

const HOW_STEPS = [
  { n: "1", title: "Enter obtained marks",  body: "Type the marks you scored — for one subject or the combined total across all subjects." },
  { n: "2", title: "Enter total marks",     body: "Type the maximum marks possible. For a 600-mark board exam, enter 600." },
  { n: "3", title: "Read your result",      body: "Percentage, grade, and pass/fail status all appear instantly — no button needed." },
  { n: "4", title: "Copy or reset",         body: "Copy the result as text or reset to start a new calculation." },
];

const GRADE_TABLE = [
  { range: "90 – 100%", grade: "A+", label: "Outstanding", color: "var(--success)" },
  { range: "80 – 89%",  grade: "A",  label: "Excellent",   color: "var(--success)" },
  { range: "70 – 79%",  grade: "B+", label: "Very Good",   color: "#34d399"        },
  { range: "60 – 69%",  grade: "B",  label: "Good",        color: "var(--accent)"  },
  { range: "50 – 59%",  grade: "C",  label: "Average",     color: "var(--accent)"  },
  { range: "35 – 49%",  grade: "D",  label: "Pass",        color: "var(--warning)" },
  { range: "Below 35%", grade: "F",  label: "Fail",        color: "var(--danger)"  },
];

const FAQS = [
  {
    q: "How do I calculate percentage from marks?",
    a: "Percentage = (Obtained Marks / Total Marks) x 100. For example, 450 out of 600 gives (450 / 600) x 100 = 75.00%.",
  },
  {
    q: "What is the percentage formula for exams?",
    a: "The standard formula is Percentage = (Marks Obtained / Maximum Marks) x 100. It works identically for a single subject, multiple subjects, or an entire board exam aggregate.",
  },
  {
    q: "How do I find the percentage of marks in Class 10 and Class 12?",
    a: "Add up your marks across all subjects, divide by the total possible marks, then multiply by 100. If you scored 430 out of 500 across five subjects, your percentage is (430 / 500) x 100 = 86%.",
  },
  {
    q: "What is the difference between percentage and percentile?",
    a: "Percentage measures your score out of the maximum marks. Percentile measures your rank among all test-takers. Scoring 80% means you got 80 of 100 marks; being in the 90th percentile means you outscored 90% of candidates.",
  },
  {
    q: "What percentage is required to pass in most Indian boards?",
    a: "CBSE, ICSE, and most state boards require at least 33% per subject and 33% in aggregate to pass. Some universities set their cutoff at 35% or 40%. Failing a subject typically requires a compartment or supplementary exam.",
  },
];

const S = {
  section: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    padding: "clamp(1.25rem, 4vw, 2rem) clamp(1.25rem, 4vw, 2.25rem)",
    marginTop: "1rem",
  },
  h2: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "0.85rem",
    letterSpacing: "-0.01em",
  },
  body: {
    color: "var(--text-secondary)",
    fontSize: "0.85rem",
    lineHeight: 1.65,
    margin: 0,
  },
  label: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "var(--accent)",
    margin: "0 0 0.4rem",
    display: "block",
  },
  code: {
    display: "block",
    background: "var(--bg-input)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "0.65rem 0.9rem",
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    fontFamily: "monospace",
    wordBreak: "break-word",
  },
};

export default function PercentagePage() {
  useSEO(tool.seo);
  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={{ ...tool, faqs: [] }}>

      {/* Calculator */}
      <PercentageCalc />

      {/* 1 — Introduction */}
      <section aria-label="About the Percentage Calculator" style={{ ...S.section, marginTop: "1.75rem" }}>
        <h2 style={S.h2}>Free Online Marks to Percentage Calculator</h2>
        <p style={S.body}>
          Convert raw exam marks to a percentage instantly — for board exams, semester results, or any single
          subject. Enter your obtained and total marks and get your percentage, grade, and pass/fail status in
          real time. No sign-up, no ads, works on every device.
        </p>
        <p style={{ ...S.body, marginTop: "0.65rem" }}>
          This exam percentage calculator uses the standard formula accepted by CBSE, ICSE, and all Indian state
          boards. It also works for university semesters and scholarship percentage calculations — any scenario
          where you need to calculate percentage online from marks.
        </p>
      </section>

      {/* 2 — How to Use */}
      <section aria-label="How to use the percentage calculator" style={S.section}>
        <h2 style={S.h2}>How to Use This Calculator</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {HOW_STEPS.map(step => (
            <li key={step.n} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                  background: "var(--accent-muted)", border: "1px solid rgba(79,107,255,0.25)",
                  color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: "0.75rem", display: "flex", alignItems: "center",
                  justifyContent: "center", marginTop: 2,
                }}
              >
                {step.n}
              </span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.85rem", margin: "0 0 0.15rem" }}>
                  {step.title}
                </p>
                <p style={{ ...S.body, lineHeight: 1.55 }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — Formula */}
      <section aria-label="Percentage formula" style={S.section}>
        <h2 style={S.h2}>Percentage Formula</h2>
        <span style={S.label}>Formula</span>
        <code style={{ ...S.code, color: "var(--accent)", fontSize: "0.95rem", marginBottom: "0.85rem" }}>
          Percentage = (Obtained Marks / Total Marks) x 100
        </code>
        <p style={{ ...S.body, marginBottom: "1.1rem" }}>
          Divide your obtained marks by the maximum marks, then multiply by 100. Works identically for a single
          subject or an aggregate across all subjects.
        </p>
        <span style={S.label}>Board Exam Example (Class 12)</span>
        <div
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", padding: "0.85rem 1rem",
          }}
        >
          {[
            "Obtained: 468 out of 600 (6 subjects x 100)",
            "Percentage = (468 / 600) x 100",
            "= 78.00%  —  First Division",
          ].map((line, j) => (
            <code key={j} style={{
              display: "block", fontSize: "0.85rem", fontFamily: "monospace",
              color: j === 2 ? "var(--accent)" : "var(--text-primary)", lineHeight: 1.85,
            }}>
              {line}
            </code>
          ))}
        </div>
      </section>

      {/* 4 — Grade Table */}
      <section aria-label="Percentage to grade reference table" style={S.section}>
        <h2 style={S.h2}>Percentage to Grade Reference</h2>
        <div
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", overflow: "hidden",
          }}
          role="table"
          aria-label="Percentage to grade table"
        >
          <div
            role="row"
            style={{
              display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr",
              background: "var(--bg-input)", borderBottom: "1px solid var(--border)",
            }}
          >
            {["Range", "Grade", "Performance"].map(h => (
              <span key={h} role="columnheader" style={{
                padding: "0.55rem 0.85rem", fontSize: "0.7rem", fontWeight: 700,
                color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                {h}
              </span>
            ))}
          </div>
          {GRADE_TABLE.map((row, i) => (
            <div key={row.grade} role="row" style={{
              display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr",
              borderBottom: i < GRADE_TABLE.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
            }}>
              <span role="cell" style={{ padding: "0.5rem 0.85rem", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 500 }}>
                {row.range}
              </span>
              <span role="cell" style={{ padding: "0.5rem 0.85rem", fontSize: "0.9rem", fontWeight: 800, fontFamily: "var(--font-display)", color: row.color }}>
                {row.grade}
              </span>
              <span role="cell" style={{ padding: "0.5rem 0.85rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {row.label}
              </span>
            </div>
          ))}
        </div>
        <p style={{ ...S.body, marginTop: "0.65rem", fontSize: "0.78rem" }}>
          Reference only. CBSE and individual state boards may use different grading scales.
        </p>
      </section>

      {/* 5 — FAQ */}
      <section
        aria-label="Percentage calculator frequently asked questions"
        style={S.section}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 style={S.h2}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQS.map((faq, i) => (
            <article
              key={i}
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "0.95rem 1.1rem",
              }}
            >
              <h3
                itemProp="name"
                style={{
                  fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700,
                  color: "var(--text-primary)", marginBottom: "0.4rem", lineHeight: 1.35,
                }}
              >
                {faq.q}
              </h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text" style={{ ...S.body, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6 — Related Tools */}
      <section aria-label="Related student tools" style={{ ...S.section, marginBottom: "1rem" }}>
        <h2 style={S.h2}>Related Tools</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {relatedTools.map(t => (
            <Link
              key={t.id}
              to={t.path}
              aria-label={`Open ${t.name}`}
              style={{
                display: "flex", alignItems: "center", gap: "0.65rem",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "0.75rem 0.9rem",
                textDecoration: "none", transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--bg-card)";
              }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }} aria-hidden="true">{t.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.25 }}>
                  {t.shortName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {t.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </ToolPageLayout>
  );
}