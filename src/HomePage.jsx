import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HOME_SEO = {
  title: "Filtero – Free Student Utility Tools | Attendance, CGPA, EMI & More",
  description:
    "Filtero is a free student utility platform with 13 instant-use tools: attendance calculator, CGPA calculator, EMI calculator, salary calculator, pomodoro timer, word counter, and more. No sign-up required.",
  canonical: "https://tools.filterero.in/",
};

const WHY_CARDS = [
  { icon: "⚡", title: "Instant Results", body: "All calculations happen in real time. No loading, no waiting, no page reloads — ever." },
  { icon: "🎯", title: "Zero Confusion", body: "Every tool is laid out so clearly, you understand it without reading any instructions." },
  { icon: "📱", title: "Mobile First", body: "Works flawlessly on your phone, tablet, laptop, and desktop at any screen size." },
  { icon: "🔒", title: "100% Private", body: "No data leaves your browser. No accounts. No tracking. No nonsense." },
  { icon: "🆓", title: "Always Free", body: "All 13 tools are completely free to use with no limits, no ads, no paywalls." },
  { icon: "🎨", title: "Clean Design", body: "A premium interface that respects your focus and doesn't waste your attention." },
];

// ─── Popular tools with SEO-friendly descriptions ─────────────────────────────
const POPULAR_TOOLS = [
  {
    id: "attendance",
    path: "/attendance-calculator",
    icon: "📅",
    name: "Attendance Calculator",
    seoDesc:
      "Find out your current attendance percentage, how many classes you can safely skip, and how many you need to attend to reach the 75% minimum — instantly.",
  },
  {
    id: "cgpa",
    path: "/cgpa-calculator",
    icon: "🎓",
    name: "CGPA Calculator",
    seoDesc:
      "Calculate your weighted CGPA by entering subject grades and credit hours. Instantly converts to equivalent percentage using the standard 9.5 multiplier.",
  },
  {
    id: "percentage",
    path: "/percentage-calculator",
    icon: "📊",
    name: "Percentage Calculator",
    seoDesc:
      "Convert marks to percentage in one step. Enter obtained marks and total marks to get your score with pass or fail status — for boards, semesters, and tests.",
  },
  {
    id: "emi",
    path: "/emi-calculator",
    icon: "💳",
    name: "EMI Calculator",
    seoDesc:
      "Calculate your monthly loan instalment using the standard EMI formula. Shows principal, total interest payable, and total repayment amount side by side.",
  },
  {
    id: "salary",
    path: "/salary-calculator",
    icon: "💰",
    name: "Salary Calculator",
    seoDesc:
      "Estimate your monthly in-hand salary after income tax (New Regime FY 2025-26) and PF deductions. Essential for freshers evaluating their first job offer.",
  },
  {
    id: "pomodoro",
    path: "/pomodoro",
    icon: "🍅",
    name: "Pomodoro Timer",
    seoDesc:
      "Stay productive with 25-minute focused study sessions followed by short breaks. Tracks your session count and reminds you when to take a long break.",
  },
];

// ─── How Filtero helps — step-by-step ─────────────────────────────────────────
const HOW_STEPS = [
  {
    num: "01",
    title: "Pick your tool",
    body: "Browse 13 free student tools covering academics, finance, writing, and productivity. Everything is one click away from the homepage.",
  },
  {
    num: "02",
    title: "Enter your numbers",
    body: "Clean, labelled input fields guide you through each calculation. No instructions needed — every tool is self-explanatory.",
  },
  {
    num: "03",
    title: "Get instant results",
    body: "Results update in real time as you type. No button press needed. Copy your result or share it directly from the tool.",
  },
  {
    num: "04",
    title: "Use it anywhere",
    body: "Filtero works on your phone, tablet, and laptop without installing anything. Open it in any browser, anytime, for free.",
  },
];

// ─── Homepage FAQ ──────────────────────────────────────────────────────────────
const HOME_FAQS = [
  {
    q: "Is Filtero completely free?",
    a: "Yes. Every tool on Filtero is 100% free to use with no hidden charges, no premium tier, and no usage limits. There are no ads either. Filtero is built to give students instant access to essential tools without friction.",
  },
  {
    q: "Are the calculations accurate?",
    a: "Yes. All calculators use standard, well-established formulas — the same ones taught in textbooks and used by universities. The EMI calculator uses the standard reducing-balance formula, the CGPA calculator uses weighted grade-point averages, and so on. Results are computed locally in your browser in real time.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Filtero requires zero sign-up, zero registration, and zero login. Open the site, pick a tool, and start calculating. There is no account system of any kind.",
  },
  {
    q: "Is my data stored or shared?",
    a: "No. All calculations happen entirely in your browser. Filtero does not send any of your inputs to a server, does not store any data, and does not share anything with third parties. Your numbers stay on your device.",
  },
  {
    q: "Can I use Filtero on my phone?",
    a: "Yes. Filtero is designed mobile-first. Every tool is fully responsive and works perfectly on phones, tablets, and laptops. No app download or installation is required — just open it in your mobile browser.",
  },
  {
    q: "Which tools are most useful for college students?",
    a: "The most popular tools among college students are the Attendance Calculator (to track bunk limits), the CGPA Calculator (for weighted grade averages), the Percentage Calculator (for semester results), the Pomodoro Timer (for focused study sessions), and the EMI Calculator (for education loan planning).",
  },
];

export default function HomePage() {
  useSEO(HOME_SEO);
  const location = useLocation();

  // Handle hash scroll after navigation (e.g. from tool page back to /#tools)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO ─── */}
        <section className="hero" aria-label="Hero" itemScope itemType="https://schema.org/WebSite">
          <meta itemProp="name" content="Filtero" />
          <meta itemProp="url" content="https://tools.filterero.in" />
          <div className="hero-badge">
            <span>⚡</span> Free Student Utility Platform
          </div>
          <h1 className="hero-title">
            Every tool a student<br />
            needs — <em>in one place</em>
          </h1>
          <p className="hero-subtitle">
            13 powerful, instant-use tools for academics, productivity, and finance. No sign-up. No clutter. Just results.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("tools-nav")}>
              Explore Tools →
            </button>
            <Link className="btn-secondary" to="/attendance-calculator">
              Try Attendance Calc
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">13</span>
              <span className="hero-stat-label">Utility Tools</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Free Forever</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">0</span>
              <span className="hero-stat-label">Sign-ups Needed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">∞</span>
              <span className="hero-stat-label">Uses</span>
            </div>
          </div>
        </section>

        {/* ─── TOOLS GRID ─── */}
        <section className="tools-nav" id="tools-nav" aria-label="All tools">
          <div className="section-label">Quick Access</div>
          <h2 className="section-title">All Tools</h2>
          <p className="section-sub">Click any tool to open its dedicated page.</p>
          <nav aria-label="Tool navigation">
            <div className="tools-grid" role="list">
              {TOOLS.map(t => (
                <Link
                  key={t.id}
                  to={t.path}
                  className="tool-card"
                  role="listitem"
                  aria-label={`Open ${t.name}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="tool-card-icon">{t.icon}</div>
                  <div className="tool-card-name">{t.shortName}</div>
                  <div className="tool-card-desc">{t.desc}</div>
                </Link>
              ))}
            </div>
          </nav>
        </section>

        {/* ─── WHY FILTERO ─── */}
        <section className="why-section" id="why" aria-label="Why Filtero">
          <div className="why-inner">
            <div className="section-label">Why Filtero</div>
            <h2 className="section-title">Built for students, by design</h2>
            <p className="section-sub">Everything stripped down to what matters — speed, clarity, and usefulness.</p>
            <div className="why-grid">
              {WHY_CARDS.map(card => (
                <div className="why-card" key={card.title}>
                  <span className="why-icon">{card.icon}</span>
                  <div className="why-title">{card.title}</div>
                  <p className="why-body">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            NEW SECTIONS — existing sections above are untouched
        ═══════════════════════════════════════════════════════════════════ */}

        {/* ─── POPULAR STUDENT TOOLS ─── */}
        <section
          id="popular-tools"
          aria-label="Popular student tools"
          style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <meta itemProp="name" content="Popular Student Utility Tools on Filtero" />
          <div className="section-label">Most Used</div>
          <h2 className="section-title">Popular Student Tools</h2>
          <p className="section-sub" style={{ maxWidth: 560 }}>
            The tools students reach for most — from checking attendance to planning study sessions and calculating loan EMIs.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.25rem",
              marginTop: "2.5rem",
            }}
          >
            {POPULAR_TOOLS.map((tool, i) => (
              <article
                key={tool.id}
                itemScope
                itemType="https://schema.org/SoftwareApplication"
                itemProp="itemListElement"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <meta itemProp="position" content={String(i + 1)} />
                <meta itemProp="applicationCategory" content="UtilityApplication" />
                <meta itemProp="operatingSystem" content="Web Browser" />
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "var(--accent-muted)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {tool.icon}
                  </div>
                  <h3
                    itemProp="name"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {tool.name}
                  </h3>
                </div>
                <p
                  itemProp="description"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  {tool.seoDesc}
                </p>
                <Link
                  to={tool.path}
                  itemProp="url"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    textDecoration: "none",
                    marginTop: "0.25rem",
                    transition: "opacity 0.2s",
                  }}
                  aria-label={`Open ${tool.name}`}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Open {tool.name} →
                </Link>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "2.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
            Looking for something else?{" "}
            <button
              onClick={() => scrollTo("tools-nav")}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: "inherit",
                fontWeight: 600,
                fontFamily: "inherit",
                padding: 0,
              }}
              aria-label="Scroll to all tools"
            >
              Browse all 13 free tools ↑
            </button>
          </p>
        </section>

        {/* ─── HOW FILTERO HELPS STUDENTS ─── */}
        <section
          id="how-it-works"
          aria-label="How Filtero helps students"
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "5rem 2rem",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">How Filtero Helps Students</h2>
            <p className="section-sub" style={{ maxWidth: 520, marginBottom: "3rem" }}>
              Filtero removes every barrier between you and the answer you need. No tutorials, no accounts, no waiting.
            </p>
            <ol
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: "1.5rem",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
              aria-label="Steps to use Filtero"
            >
              {HOW_STEPS.map(step => (
                <li
                  key={step.num}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.75rem 1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      fontWeight: 800,
                      lineHeight: 1,
                      marginBottom: "1rem",
                      WebkitTextStroke: "1.5px var(--accent)",
                      color: "transparent",
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
            <p
              style={{
                marginTop: "3rem",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.75,
                maxWidth: 720,
              }}
            >
              Filtero is built specifically for Indian college students and school students preparing for board exams.
              Whether you need to check if you have enough attendance to appear for exams, calculate your CGPA before
              results are published, estimate your take-home salary for a new job offer, or stay focused during study
              sessions with a Pomodoro timer — every tool is designed to give you a correct, instant answer with no
              friction. All tools are free, work in any browser, and require no installation.
            </p>
          </div>
        </section>

        {/* ─── HOMEPAGE FAQ ─── */}
        <section
          id="faq"
          aria-label="Frequently asked questions about Filtero"
          style={{ padding: "5rem 2rem" }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub" style={{ marginBottom: "2.5rem" }}>
              Everything you need to know about Filtero.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {HOME_FAQS.map((faq, i) => (
                <article
                  key={i}
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                  }}
                >
                  <h3
                    itemProp="name"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </h3>
                  <div
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p
                      itemProp="text"
                      style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA after FAQ */}
            <div
              style={{
                marginTop: "3rem",
                background: "var(--accent-muted)",
                border: "1px solid rgba(79,107,255,0.2)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Ready to get started?
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                All 13 tools are free, instant, and require zero sign-up.
              </p>
              <button
                className="btn-primary"
                onClick={() => scrollTo("tools-nav")}
                aria-label="Browse all Filtero tools"
              >
                Browse All Tools →
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}