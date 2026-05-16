import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import CGPACalc from "./CGPACalc";

const tool = TOOLS.find(t => t.id === "cgpa");

// ─── Related tools ────────────────────────────────────────────────────────────
const RELATED_IDS = ["attendance", "percentage", "internal", "board"];

// ─── How-to steps ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    n: "1",
    title: "Add your subjects",
    body: "Each row represents one subject. The calculator starts with two rows. Click '+ Add Subject' to add more — there is no limit.",
  },
  {
    n: "2",
    title: "Enter the subject name",
    body: "Type a recognisable name for each subject (e.g. 'Mathematics', 'Data Structures'). This is only for your reference — it does not affect the calculation.",
  },
  {
    n: "3",
    title: "Select your grade",
    body: "Choose the grade you received from the dropdown: O (Outstanding, 10), A+ (9), A (8), B+ (7), B (6), C (5), or F (0). These follow the standard 10-point UGC grading scale used by most Indian universities.",
  },
  {
    n: "4",
    title: "Enter credit hours",
    body: "Enter the number of credit hours assigned to that subject. This is usually shown on your mark sheet or course plan — common values are 2, 3, 4, or 5.",
  },
  {
    n: "5",
    title: "Read your CGPA and percentage",
    body: "Your weighted CGPA and its equivalent percentage update instantly as you type. Use the Copy button to save the result, or Reset to start over.",
  },
];

// ─── Grade reference table ─────────────────────────────────────────────────────
const GRADE_TABLE = [
  { grade: "O", points: 10, range: "90 – 100" },
  { grade: "A+", points: 9, range: "80 – 89" },
  { grade: "A", points: 8, range: "70 – 79" },
  { grade: "B+", points: 7, range: "60 – 69" },
  { grade: "B", points: 6, range: "50 – 59" },
  { grade: "C", points: 5, range: "40 – 49" },
  { grade: "F", points: 0, range: "Below 40" },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How is CGPA calculated?",
    a: "CGPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours). Multiply each subject's grade point by its credit hours, sum all those values, then divide by the total credit hours across all subjects. This is the weighted CGPA formula used by most Indian universities.",
  },
  {
    q: "How do I convert CGPA to percentage?",
    a: "The most widely used formula, recommended by the UGC (University Grants Commission) and adopted by universities including Anna University and VTU, is: Percentage = CGPA × 9.5. So a CGPA of 8.0 equals 76%, and a CGPA of 9.0 equals 85.5%.",
  },
  {
    q: "What is considered a good CGPA in India?",
    a: "A CGPA above 8.0 (equivalent to roughly 76%) is generally considered good for placements and higher education applications. A CGPA of 9.0 or above is considered excellent. Many top recruiters and postgraduate programs set a minimum cutoff of 6.0 or 7.0 CGPA.",
  },
  {
    q: "Is a 9 CGPA good?",
    a: "Yes, a 9 CGPA is excellent. It converts to approximately 85.5% under the standard formula and typically corresponds to an 'A+' grade range. It puts you in the top tier of students and is well above the cutoffs for most placement drives and postgraduate admissions.",
  },
  {
    q: "What is the difference between GPA and CGPA?",
    a: "GPA (Grade Point Average) is calculated for a single semester — it reflects your performance in that semester's subjects only. CGPA (Cumulative Grade Point Average) is the weighted average across all semesters completed so far. Your CGPA grows and changes each semester as new results are added.",
  },
  {
    q: "How does semester CGPA work?",
    a: "Semester CGPA uses the same weighted formula but applies only to the subjects in that semester. Most universities calculate your semester GPA first, then combine all semesters (weighted by total credits each semester) to produce your overall CGPA, which appears on your degree certificate.",
  },
  {
    q: "Does this calculator handle weighted CGPA?",
    a: "Yes. The calculator uses the full weighted CGPA formula: each subject's grade point is multiplied by its credit hours before being averaged. Subjects with more credits have a proportionally larger impact on your final CGPA — exactly how universities compute it.",
  },
  {
    q: "Which universities use the 10-point CGPA scale?",
    a: "The 10-point CGPA scale is used by the majority of Indian universities and autonomous colleges, including IITs, NITs, VTU, Anna University, Mumbai University, Pune University, and most UGC-affiliated institutions. Some universities may use a 4-point GPA scale — check your mark sheet to confirm.",
  },
];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const sectionStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "2rem 2.5rem",
  marginTop: "1.25rem",
};

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  marginBottom: "1rem",
  letterSpacing: "-0.01em",
};

const bodyStyle = {
  color: "var(--text-secondary)",
  fontSize: "0.875rem",
  lineHeight: 1.75,
  margin: 0,
};

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--accent)",
  margin: "0 0 0.5rem",
};

const codeBlockStyle = {
  display: "block",
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  color: "var(--text-primary)",
  fontFamily: "monospace",
  marginBottom: "0.5rem",
  wordBreak: "break-word",
};

const inlineCode = {
  background: "var(--bg-input)",
  padding: "1px 6px",
  borderRadius: 4,
  fontSize: "0.82rem",
  fontFamily: "monospace",
};

export default function CGPAPage() {
  useSEO(tool.seo);

  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={tool}>

      {/* ── Calculator — completely untouched ── */}
      <CGPACalc />

      {/* ════════════════════════════════════════════════════════════════
          SEO CONTENT — added below calculator, no UI changes above
      ════════════════════════════════════════════════════════════════ */}

      {/* ── 1. Introduction ── */}
      <section
        aria-label="About the CGPA Calculator"
        style={{ ...sectionStyle, marginTop: "2rem" }}
      >
        <h2 style={h2Style}>Free Online CGPA Calculator for College Students</h2>
        <p style={bodyStyle}>
          CGPA — Cumulative Grade Point Average — is the standard measure of academic performance used by
          Indian universities, IITs, NITs, and autonomous colleges. Unlike a simple average, CGPA is a
          weighted calculation: subjects with more credit hours contribute proportionally more to your final
          score. This free online CGPA calculator handles all that weighting automatically, so you get an
          accurate result the moment you enter your grades.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          The calculator supports all subjects in a semester or across multiple semesters. It uses the
          standard 10-point UGC grading scale (O, A+, A, B+, B, C, F) and instantly shows both your
          weighted CGPA and the equivalent percentage using the widely accepted formula{" "}
          <strong style={{ color: "var(--text-primary)" }}>Percentage = CGPA × 9.5</strong>.
          Whether you want to calculate your semester CGPA, check your overall CGPA, or convert your
          CGPA to percentage for job applications, this tool handles it all in one place.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Used by students across Anna University, VTU, Mumbai University, Pune University, and hundreds
          of other affiliated colleges — no sign-up, no ads, and no page reloads required.
        </p>
      </section>

      {/* ── 2. How to Use ── */}
      <section aria-label="How to use the CGPA Calculator" style={sectionStyle}>
        <h2 style={h2Style}>How to Calculate CGPA Online — Step by Step</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {HOW_STEPS.map(step => (
            <li key={step.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent-muted)",
                  border: "1px solid rgba(79,107,255,0.25)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                {step.n}
              </span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", margin: "0 0 0.25rem" }}>
                  {step.title}
                </p>
                <p style={{ ...bodyStyle, lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 3. Formula ── */}
      <section aria-label="CGPA formula and calculation method" style={sectionStyle}>
        <h2 style={h2Style}>CGPA Formula and Calculation Method</h2>

        {/* Weighted CGPA */}
        <p style={labelStyle}>Weighted CGPA Formula</p>
        <code style={codeBlockStyle}>
          CGPA = Σ(Grade Points × Credit Hours) ÷ Σ(Credit Hours)
        </code>
        <p style={{ ...bodyStyle, marginBottom: "1.5rem" }}>
          This is the standard weighted CGPA formula. Each subject's grade point is multiplied by its
          credit hours. The sum of those products is divided by the total credit hours across all subjects.
          A 4-credit subject has twice the impact of a 2-credit subject on your final CGPA.
        </p>

        {/* Worked example */}
        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
          Example Calculation
        </p>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "0.75rem",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "0",
              background: "var(--bg-input)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Subject", "Grade", "Points", "Credits"].map(h => (
              <span
                key={h}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {/* Table rows */}
          {[
            ["Mathematics", "O", "10", "4"],
            ["Physics", "A+", "9", "3"],
            ["Chemistry", "A", "8", "3"],
            ["English", "B+", "7", "2"],
          ].map(([sub, grade, pts, cred], i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                borderBottom: i < 3 ? "1px solid var(--border)" : "none",
              }}
            >
              {[sub, grade, pts, cred].map((val, j) => (
                <span
                  key={j}
                  style={{
                    padding: "0.55rem 1rem",
                    fontSize: "0.85rem",
                    color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: j === 0 ? 500 : 400,
                  }}
                >
                  {val}
                </span>
              ))}
            </div>
          ))}
        </div>
        <code style={codeBlockStyle}>
          Weighted Sum = (10×4) + (9×3) + (8×3) + (7×2) = 40 + 27 + 24 + 14 = 105
        </code>
        <code style={{ ...codeBlockStyle, marginTop: "0.5rem" }}>
          Total Credits = 4 + 3 + 3 + 2 = 12
        </code>
        <code style={{ ...codeBlockStyle, marginTop: "0.5rem", color: "var(--accent)" }}>
          CGPA = 105 ÷ 12 = 8.75
        </code>

        {/* CGPA to percentage */}
        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "1.5rem" }}>
          CGPA to Percentage Formula
        </p>
        <code style={codeBlockStyle}>Percentage = CGPA × 9.5</code>
        <code style={{ ...codeBlockStyle, marginTop: "0.5rem", color: "var(--accent)" }}>
          Example: 8.75 × 9.5 = 83.13%
        </code>
        <p style={{ ...bodyStyle, marginTop: "0.75rem", fontSize: "0.85rem" }}>
          This multiplier (9.5) is the UGC-recommended conversion factor and is used by most Indian
          universities. Some institutions may use their own formula — check your university's academic
          regulations if you need an official conversion for transcripts or applications.
        </p>

        {/* Grade reference table */}
        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "1.5rem" }}>
          Grade Points Reference (10-Point Scale)
        </p>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 2fr",
              background: "var(--bg-input)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {["Grade", "Points", "Typical % Range"].map(h => (
              <span
                key={h}
                style={{
                  padding: "0.6rem 1rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {GRADE_TABLE.map((row, i) => (
            <div
              key={row.grade}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2fr",
                borderBottom: i < GRADE_TABLE.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.875rem", color: "var(--accent)", fontWeight: 700 }}>
                {row.grade}
              </span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600 }}>
                {row.points}
              </span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                {row.range}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. FAQ ── */}
      <section
        aria-label="CGPA calculator frequently asked questions"
        style={sectionStyle}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 style={h2Style}>Frequently Asked Questions about CGPA</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {FAQS.map((faq, i) => (
            <article
              key={i}
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1.1rem 1.25rem",
              }}
            >
              <h3
                itemProp="name"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  lineHeight: 1.4,
                }}
              >
                {faq.q}
              </h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text" style={{ ...bodyStyle, fontSize: "0.865rem" }}>
                  {faq.a}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Related Tools ── */}
      <section
        aria-label="Related student tools"
        style={{ ...sectionStyle, marginBottom: "1rem" }}
      >
        <h2 style={h2Style}>Related Tools</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem", fontSize: "0.865rem" }}>
          Other academic calculators students use alongside the CGPA calculator.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {relatedTools.map(t => (
            <Link
              key={t.id}
              to={t.path}
              aria-label={`Open ${t.name}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "0.875rem 1rem",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
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
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }} aria-hidden="true">{t.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.3 }}>
                  {t.shortName}
                </div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>
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