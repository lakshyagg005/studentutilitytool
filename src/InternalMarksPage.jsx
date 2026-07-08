import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import InternalMarksCalc from "./InternalMarksCalc";

const tool = TOOLS.find(t => t.id === "internal");
const RELATED_IDS = ["attendance", "cgpa", "percentage", "board"];

const HOW_STEPS = [
  { n: "1", title: "Enter your assignment marks", body: "Type the marks you received for assignments. The default maximum is 20, but you can change this in the 'Internal Max Marks' field to match your university's scheme." },
  { n: "2", title: "Enter your attendance marks", body: "Type the marks allocated for attendance. Most colleges award these based on your attendance percentage — higher attendance earns more marks." },
  { n: "3", title: "Enter your practical marks", body: "Enter practical or lab marks if applicable to your subject. For theory-only subjects, leave this at zero." },
  { n: "4", title: "Adjust the internal maximum", body: "Set the total internal marks your university awards. Common values are 30, 40, or 50. The calculator scales your score to this maximum automatically." },
  { n: "5", title: "Read the predicted internal score", body: "Your predicted internal score and the percentage of internal marks appear instantly. Use this to know where you stand before results are published." },
];

const DISTRIBUTION_TABLE = [
  { component: "Assignments / Tests", typical: "10 – 20 marks", notes: "Unit tests, class assignments, surprise tests" },
  { component: "Attendance", typical: "5 – 10 marks", notes: "Based on % of classes attended" },
  { component: "Practicals / Lab", typical: "10 – 25 marks", notes: "Lab work, viva, lab records" },
  { component: "Internal Assessment Max", typical: "30 – 50 marks", notes: "Varies by university and subject" },
];

const ATTENDANCE_MARKS_TABLE = [
  { range: "Above 90%", marks: "Full marks (10/10 or 5/5)" },
  { range: "80 – 90%", marks: "9/10 or 4/5" },
  { range: "75 – 80%", marks: "7–8/10 or 3–4/5" },
  { range: "65 – 75%", marks: "5–6/10 or 2–3/5" },
  { range: "Below 65%", marks: "0–4/10 or 0–2/5" },
];

const FAQS = [
  { q: "What are internal marks in college?", a: "Internal marks are scores awarded by your college or university based on continuous assessment throughout the semester. They typically include assignments, attendance, surprise tests, practicals, and viva. Internal marks contribute 20–40% to your final grade, with the remaining 60–80% coming from the external semester exam." },
  { q: "How are internal marks calculated?", a: "The method varies by institution. Generally: Internal Score = (Assignment Marks + Attendance Marks + Practical Marks) scaled to the internal maximum. For example, if you scored 17/20 + 8/10 + 16/20 = 41/50, and the internal max is 30, your scaled internal score is (41/50) × 30 = 24.6 out of 30." },
  { q: "How much do internal marks matter for the final grade?", a: "Internal marks usually carry 20–40% weightage in the final result. If internals are out of 30 and externals out of 70, getting 25/30 internally means you only need 40/70 externally to pass with 65 out of 100. Strong internal marks significantly reduce pressure in the semester exam." },
  { q: "Can I improve my internal marks before the semester exam?", a: "Yes. Most improvements can be made before the exam cutoff. Submitting pending assignments can add assignment marks. Attending remaining classes improves attendance marks. Performing well in remaining practicals or viva boosts practical marks. Some colleges also allow students to improve through internal supplementary tests." },
  { q: "What happens if internal marks are too low?", a: "Low internal marks force you to score higher in the external exam to pass overall. For example, if you score 10/30 internally and your pass mark is 40/100 overall, you must score 30/70 in the external exam. Very low attendance can also make you ineligible for the exam entirely, regardless of your internal test scores." },
  { q: "Are internal marks included in CGPA?", a: "Yes. When your university computes your final grade for a subject, it combines your internal marks and external exam marks. That combined score determines your grade point for the subject, which then feeds into your CGPA calculation. So internal marks directly affect your CGPA." },
  { q: "What is a good internal marks score?", a: "Scoring above 70% of internal marks (e.g., 21/30 or 35/50) is generally considered good. Scoring 80% or above (24/30 or 40/50) gives you a comfortable buffer in the external exam and contributes positively to your CGPA. Anything below 50% of internal marks puts significant pressure on your external performance." },
  { q: "Does this calculator work for all universities?", a: "The calculator uses a scaling formula that works for any internal marking scheme — just enter your actual marks and the maximum for each component, and set the internal maximum to match your university. Whether your internals are out of 25, 30, 40, or 50, the calculator scales proportionally." },
  { q: "How are attendance marks typically awarded?", a: "Most colleges award attendance marks on a sliding scale. Attending above 90% typically earns full attendance marks. Between 75–90%, marks are awarded proportionally. Below 75%, many universities award zero attendance marks and may also bar the student from appearing in the exam. The exact scale varies by institution." },
  { q: "Can internal marks be rechecked or revised?", a: "Unlike external exams, internal marks are usually at the discretion of the faculty and institution. Some universities allow students to apply for internal mark verification within a specified window after marks are published. However, revisions are rare and typically limited to clerical errors." },
];

const sectionStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem 2.5rem", marginTop: "1.25rem" };
const h2Style = { fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" };
const bodyStyle = { color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.75, margin: 0 };
const labelStyle = { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", margin: "0 0 0.5rem" };
const codeBlockStyle = { display: "block", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace", marginBottom: "0.5rem", wordBreak: "break-word" };
const inlineCode = { background: "var(--bg-input)", padding: "1px 6px", borderRadius: 4, fontSize: "0.82rem", fontFamily: "monospace" };
const thStyle = { padding: "0.6rem 1rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" };
const tdStyle = (accent) => ({ padding: "0.55rem 1rem", fontSize: "0.85rem", color: accent ? "var(--accent)" : "var(--text-secondary)", fontWeight: accent ? 600 : 400 });

export default function InternalMarksPage() {
  useSEO(tool.seo);
  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={{ ...tool, faqs: [] }}>
      <InternalMarksCalc />

      {/* 1 — Introduction */}
      <section aria-label="About the Internal Marks Calculator" style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={h2Style}>Free Internal Marks Calculator for College Students</h2>
        <p style={bodyStyle}>
          Internal marks play a much larger role in your final grade than most students realise. At most Indian
          universities, internal assessment contributes 20–40% of your total score — yet students often discover
          their internal standing only when it is too late to improve it. This Internal Marks Calculator gives
          you a clear picture of where you stand right now, so you can act before the semester exam.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Enter your marks for assignments, attendance, and practicals along with the maximum marks for each
          component. The calculator scales your total to your university's internal maximum and shows your
          predicted internal score as both a raw number and a percentage. Works for any university scheme —
          whether your internals are out of 25, 30, 40, or 50.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Students in engineering colleges (VTU, Anna University, JNTU, Mumbai University), arts colleges,
          commerce programs, and postgraduate courses all use internal marks as a continuous assessment tool.
          Understanding your internal score helps you gauge how much you need to score in the external exam
          to achieve your target grade.
        </p>
      </section>

      {/* 2 — How to Use */}
      <section aria-label="How to use the internal marks calculator" style={sectionStyle}>
        <h2 style={h2Style}>How to Use This Calculator — Step by Step</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {HOW_STEPS.map(step => (
            <li key={step.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "var(--accent-muted)", border: "1px solid rgba(79,107,255,0.25)", color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>{step.n}</span>
              <div>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem", margin: "0 0 0.25rem" }}>{step.title}</p>
                <p style={{ ...bodyStyle, lineHeight: 1.65 }}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — Formula */}
      <section aria-label="Internal marks formula" style={sectionStyle}>
        <h2 style={h2Style}>Internal Marks Formula</h2>
        <p style={labelStyle}>Core Formula</p>
        <code style={codeBlockStyle}>Internal Score = (Total Raw Marks / Maximum Raw Marks) × Internal Maximum</code>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Your individual component marks (assignments, attendance, practicals) are added together to get your
          total raw marks. This is divided by the sum of all component maximums, then multiplied by the internal
          maximum your university uses. This gives a scaled internal score that fits within your university's marking scheme.
        </p>
        <p style={labelStyle}>Variable Breakdown</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {[
            ["Total Raw Marks", "Sum of your actual marks across all components"],
            ["Maximum Raw Marks", "Sum of the maximum marks across all components"],
            ["Internal Maximum", "The internal marks cap set by your university (e.g. 30, 40, 50)"],
          ].map(([v, d]) => (
            <div key={v} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
              <code style={{ ...inlineCode, flexShrink: 0 }}>{v}</code>
              <span style={{ ...bodyStyle, fontSize: "0.85rem" }}>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — Worked Example */}
      <section aria-label="Internal marks worked example" style={sectionStyle}>
        <h2 style={h2Style}>Worked Example</h2>
        <p style={{ ...bodyStyle, marginBottom: "1rem" }}>
          A VTU engineering student has the following internal marks in a subject where internals are out of 30:
        </p>
        <p style={labelStyle}>Input Values</p>
        <code style={codeBlockStyle}>Assignment Marks: 17 out of 20</code>
        <code style={codeBlockStyle}>Attendance Marks: 8 out of 10</code>
        <code style={codeBlockStyle}>Practical Marks: 16 out of 20</code>
        <code style={codeBlockStyle}>Internal Maximum: 30</code>
        <p style={{ ...labelStyle, marginTop: "1rem" }}>Step-by-Step Calculation</p>
        <code style={codeBlockStyle}>Total Raw = 17 + 8 + 16 = 41</code>
        <code style={codeBlockStyle}>Max Raw = 20 + 10 + 20 = 50</code>
        <code style={codeBlockStyle}>Internal Score = (41 / 50) × 30 = 0.82 × 30 = 24.6 / 30</code>
        <code style={{ ...codeBlockStyle, color: "var(--accent)" }}>Result: 24.6 / 30 → 82.0% of internal marks</code>
        <p style={{ ...bodyStyle, marginTop: "0.75rem" }}>
          This student needs to score at least{" "}
          <code style={inlineCode}>40 − 24.6 = 15.4</code> out of 70 in the external exam to pass,
          but realistically should aim for 50+ externally to secure a B grade or above.
        </p>
      </section>

      {/* 5 — Distribution Table */}
      <section aria-label="Internal marks distribution reference" style={sectionStyle}>
        <h2 style={h2Style}>Typical Internal Marks Distribution</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Internal marking schemes vary by institution, but most follow one of these common distributions.
          Check your university's academic regulations for your exact scheme.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr", background: "var(--bg-input)", borderBottom: "1px solid var(--border)" }}>
            {["Component", "Typical Marks", "Description"].map(h => <span key={h} style={thStyle}>{h}</span>)}
          </div>
          {DISTRIBUTION_TABLE.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 2fr", borderBottom: i < DISTRIBUTION_TABLE.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ ...tdStyle(true), padding: "0.55rem 1rem" }}>{row.component}</span>
              <span style={{ ...tdStyle(false), padding: "0.55rem 1rem" }}>{row.typical}</span>
              <span style={{ ...tdStyle(false), padding: "0.55rem 1rem" }}>{row.notes}</span>
            </div>
          ))}
        </div>
        <h3 style={{ ...h2Style, fontSize: "1rem", marginBottom: "0.75rem" }}>Attendance Marks Reference</h3>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg-input)", borderBottom: "1px solid var(--border)" }}>
            {["Attendance Range", "Marks Awarded (approximate)"].map(h => <span key={h} style={thStyle}>{h}</span>)}
          </div>
          {ATTENDANCE_MARKS_TABLE.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < ATTENDANCE_MARKS_TABLE.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span style={{ ...tdStyle(false), padding: "0.55rem 1rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.range}</span>
              <span style={{ ...tdStyle(false), padding: "0.55rem 1rem" }}>{row.marks}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — Interpretation */}
      <section aria-label="How to interpret your internal marks score" style={sectionStyle}>
        <h2 style={h2Style}>How to Interpret Your Internal Score</h2>
        {[
          { range: "85% or above of internals", label: "Excellent", body: "You have maximal internal marks working in your favour. A moderate performance in the external exam (50–55%) will still produce a good overall grade. Focus on understanding external exam patterns rather than worrying about internals." },
          { range: "70–84% of internals", label: "Good", body: "Your internal marks provide a solid cushion. You need a decent external performance to pass comfortably. Scoring 55–65% in the external exam will give you a first division overall." },
          { range: "50–69% of internals", label: "Average", body: "You are relying more on the external exam. Aim for at least 60% in the external to compensate. Use remaining practicals, assignments, or attendance to push your internal score higher before the cutoff." },
          { range: "Below 50% of internals", label: "At Risk", body: "Low internal marks put significant pressure on your external performance. You need 65%+ in the external exam to pass. Address any remaining internal components immediately — even a few extra marks internally can make a meaningful difference." },
        ].map((item, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", marginBottom: i < 3 ? "0.75rem" : 0 }}>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.875rem", margin: "0 0 0.35rem" }}>{item.range} — <span style={{ color: "var(--accent)" }}>{item.label}</span></p>
            <p style={{ ...bodyStyle, fontSize: "0.85rem" }}>{item.body}</p>
          </div>
        ))}
      </section>

      {/* 7 — Common Mistakes */}
      <section aria-label="Common internal marks mistakes" style={sectionStyle}>
        <h2 style={h2Style}>Common Mistakes Students Make with Internal Marks</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { title: "Ignoring internals until it is too late", body: "Many students focus entirely on the semester exam and only check their internal marks after the submission window has closed. By then, there is no way to improve assignments or attendance marks. Track your internal standing from week 4 or 5 of the semester." },
            { title: "Not submitting all assignments", body: "Missing even one assignment can drop your assignment marks significantly. A single missing assignment out of five reduces your assignment score by 20%, which flows through to your scaled internal mark. Always submit — even an incomplete attempt scores better than zero." },
            { title: "Assuming practicals are separate from CGPA", body: "Practical marks are part of the internal assessment and feed directly into your final subject grade and CGPA. Students who perform poorly in lab work or viva are often surprised to see their CGPA affected even after a good external exam." },
            { title: "Not knowing the university's exact scheme", body: "Every university distributes internal marks differently. Using the wrong maximum marks in your calculation will give a misleading result. Always cross-check with your department's academic calendar or the official course plan document." },
          ].map((item, i, arr) => (
            <article key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>{i + 1}. {item.title}</h3>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8 — Tips */}
      <section aria-label="Tips to improve internal marks" style={sectionStyle}>
        <h2 style={h2Style}>Tips to Maximise Your Internal Marks</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {[
            "Attend every class in the first 8 weeks — this is when attendance marks are most commonly locked in.",
            "Submit assignments on time even if they are incomplete. Partial marks always beat a zero.",
            "Ask your faculty what the internal marking scheme is at the start of the semester — most will tell you directly.",
            "Practicals carry significant weight. Keep your lab records updated and viva-ready throughout the semester.",
            "If your university runs internal improvement tests, appear for them even if your existing score seems adequate.",
            "Calculate your internal standing at the mid-semester point. This gives you 4–6 weeks to improve attendance or submit missed work.",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>→</span>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 9 — FAQ */}
      <section aria-label="Internal marks calculator FAQs" style={sectionStyle} itemScope itemType="https://schema.org/FAQPage">
        <h2 style={h2Style}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {FAQS.map((faq, i) => (
            <article key={i} itemScope itemType="https://schema.org/Question" itemProp="mainEntity" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.1rem 1.25rem" }}>
              <h3 itemProp="name" style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{faq.q}</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text" style={{ ...bodyStyle, fontSize: "0.865rem" }}>{faq.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 10 — Related Tools */}
      <section aria-label="Related academic tools" style={{ ...sectionStyle, marginBottom: "1rem" }}>
        <h2 style={h2Style}>Related Tools</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem", fontSize: "0.865rem" }}>Other calculators students use alongside the internal marks calculator.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "0.875rem" }}>
          {relatedTools.map(t => (
            <Link key={t.id} to={t.path} aria-label={`Open ${t.name}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--bg-card-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}>
              <span style={{ fontSize: "1.2rem", flexShrink: 0 }} aria-hidden="true">{t.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.3 }}>{t.shortName}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </ToolPageLayout>
  );
}
