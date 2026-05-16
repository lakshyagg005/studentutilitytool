import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import AttendanceCalc from "./AttendanceCalc";

const tool = TOOLS.find(t => t.id === "attendance");

// ─── Related tools ────────────────────────────────────────────────────────────
const RELATED_IDS = ["cgpa", "percentage", "internal", "board"];

// ─── How-to steps ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    n: "1",
    title: "Enter Total Classes Held",
    body: "Type the total number of classes that have taken place in your subject or semester so far.",
  },
  {
    n: "2",
    title: "Enter Classes Attended",
    body: "Type the number of classes you have personally attended. The value cannot exceed the total.",
  },
  {
    n: "3",
    title: "Read your result instantly",
    body: "Your attendance percentage, safe/at-risk status, bunk allowance, and classes needed for 75% all appear in real time — no button press needed.",
  },
  {
    n: "4",
    title: "Copy or share",
    body: "Use the Copy button to copy your result as text. Share it with classmates or paste it into your notes.",
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is the minimum attendance required in college?",
    a: "Most Indian universities and colleges require a minimum of 75% attendance to be eligible to appear for semester exams. Some institutions allow 65% with a valid medical certificate. Always check your institution's specific rules.",
  },
  {
    q: "How is attendance percentage calculated?",
    a: "Attendance % = (Classes Attended ÷ Total Classes Held) × 100. For example, if 90 out of 120 classes were attended, the percentage is (90 ÷ 120) × 100 = 75%.",
  },
  {
    q: "How many classes can I bunk and still maintain 75%?",
    a: "The formula is: Bunkable classes = floor(Attended − 0.75 × Total). If this value is zero or negative, you cannot bunk any more classes without falling below 75%. The calculator shows this number instantly.",
  },
  {
    q: "How many classes do I need to attend to reach 75%?",
    a: "If you are below 75%, the formula is: Classes needed = ceil((0.75 × Total − Attended) ÷ 0.25). This tells you the minimum additional classes you must attend consecutively to cross the 75% threshold.",
  },
  {
    q: "Does this calculator work for a single subject or the whole semester?",
    a: "It works for both. Enter the total and attended classes for a single subject to get subject-wise attendance, or enter cumulative totals across all subjects for an overall semester figure.",
  },
  {
    q: "What does 'At Risk' mean on the result?",
    a: "'At Risk' appears when your attendance is between 60% and 74%. You are not in the danger zone yet but you cannot afford to miss any more classes without risking eligibility. 'Danger' means you are below 60% and need to take immediate action.",
  },
];

// ─── Shared section card style ─────────────────────────────────────────────────
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

export default function AttendancePage() {
  useSEO(tool.seo);

  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={tool}>

      {/* ── Calculator — completely untouched ── */}
      <AttendanceCalc />

      {/* ════════════════════════════════════════════════════════════════
          SEO CONTENT — added below calculator, no UI changes above
      ════════════════════════════════════════════════════════════════ */}

      {/* ── 1. Introduction ── */}
      <section aria-label="About the Attendance Calculator" style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={h2Style}>Free Online Attendance Calculator for Students</h2>
        <p style={bodyStyle}>
          The Filtero Attendance Calculator helps college and school students instantly check their attendance
          percentage, find out how many classes they can safely skip, and calculate how many consecutive classes
          they must attend to meet the mandatory 75% requirement. Indian universities typically enforce a minimum
          75% attendance rule before a student can sit for semester exams. Missing that threshold means being
          detained from exams — this tool helps you stay aware before it is too late.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Simply enter the total number of classes held and the number you have attended. Results — including
          your safe bunk count and classes needed — update in real time with no page reload required. Works for
          a single subject, an entire semester, or any combination you choose.
        </p>
      </section>

      {/* ── 2. How to Use ── */}
      <section aria-label="How to use the Attendance Calculator" style={sectionStyle}>
        <h2 style={h2Style}>How to Use This Calculator</h2>
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

      {/* ── 3. Formula Used ── */}
      <section aria-label="Attendance calculation formulas" style={sectionStyle}>
        <h2 style={h2Style}>Formula Used</h2>

        {[
          {
            label: "Attendance Percentage",
            formula: "Attendance % = (Classes Attended ÷ Total Classes Held) × 100",
            example: "Example: 90 attended, 120 total → (90 ÷ 120) × 100 = 75.00%",
          },
          {
            label: "Classes You Can Bunk (and stay ≥ 75%)",
            formula: "Bunkable = floor(Attended − 0.75 × Total)",
            example: "Example: 96 attended, 120 total → floor(96 − 90) = 6 classes safe to skip",
          },
          {
            label: "Classes Needed to Reach 75%",
            formula: "Classes Needed = ceil((0.75 × Total − Attended) ÷ 0.25)",
            example: "Example: 60 attended, 100 total → ceil((75 − 60) ÷ 0.25) = 60 classes to attend",
          },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              marginBottom: i < arr.length - 1 ? "1.25rem" : 0,
              paddingBottom: i < arr.length - 1 ? "1.25rem" : 0,
              borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", margin: "0 0 0.5rem" }}>
              {item.label}
            </p>
            <code
              style={{
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
              }}
            >
              {item.formula}
            </code>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0, lineHeight: 1.5 }}>
              {item.example}
            </p>
          </div>
        ))}

        <p style={{ ...bodyStyle, marginTop: "1.25rem", fontSize: "0.85rem" }}>
          The bunkable-classes formula uses{" "}
          <code style={{ background: "var(--bg-input)", padding: "1px 6px", borderRadius: 4, fontSize: "0.8rem" }}>floor()</code>{" "}
          so it always rounds down to the nearest safe integer — you never get credit for a partial class. The
          classes-needed formula uses{" "}
          <code style={{ background: "var(--bg-input)", padding: "1px 6px", borderRadius: 4, fontSize: "0.8rem" }}>ceil()</code>{" "}
          because you need whole classes, and rounding down would leave you just short of 75%.
        </p>
      </section>

      {/* ── 4. FAQ ── */}
      <section
        aria-label="Frequently asked questions about attendance"
        style={sectionStyle}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 style={h2Style}>Frequently Asked Questions</h2>
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
          Other academic calculators students use alongside the attendance calculator.
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