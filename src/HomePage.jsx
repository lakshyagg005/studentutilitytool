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
  canonical: "https://filtero.app/",
};

const WHY_CARDS = [
  { icon: "⚡", title: "Instant Results", body: "All calculations happen in real time. No loading, no waiting, no page reloads — ever." },
  { icon: "🎯", title: "Zero Confusion", body: "Every tool is laid out so clearly, you understand it without reading any instructions." },
  { icon: "📱", title: "Mobile First", body: "Works flawlessly on your phone, tablet, laptop, and desktop at any screen size." },
  { icon: "🔒", title: "100% Private", body: "No data leaves your browser. No accounts. No tracking. No nonsense." },
  { icon: "🆓", title: "Always Free", body: "All 13 tools are completely free to use with no limits, no ads, no paywalls." },
  { icon: "🎨", title: "Clean Design", body: "A premium interface that respects your focus and doesn't waste your attention." },
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
          <meta itemProp="url" content="https://filtero.app" />
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
      </main>
      <Footer />
    </>
  );
}
