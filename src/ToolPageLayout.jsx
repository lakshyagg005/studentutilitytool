import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FAQSection from "./FAQSection";
import { TOOLS } from "./toolsData";

/**
 * ToolPageLayout
 * Wraps every individual tool page with Navbar, back-link, page H1,
 * other-tools grid, FAQ section, and Footer.
 *
 * Props:
 *   tool     — tool metadata object from toolsData.js
 *   children — the calculator component
 */
export default function ToolPageLayout({ tool, children }) {
  const otherTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* ─── PAGE HERO ─── */}
        <section
          className="tool-page-hero"
          style={{
            padding: "3rem 2rem 2rem",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ marginBottom: "1.5rem" }}
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            <ol
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <li
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                <Link
                  to="/"
                  itemProp="item"
                  style={{
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = "var(--text-muted)")
                  }
                >
                  <span itemProp="name">Filtero</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true" style={{ opacity: 0.4 }}>
                /
              </li>
              <li
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/ListItem"
              >
                <span
                  itemProp="name"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tool.name}
                </span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* H1 */}
          <div className="tool-tag" style={{ marginBottom: "0.75rem" }}>
            {tool.tag}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1.15,
              marginBottom: "0.6rem",
            }}
          >
            {tool.name}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1rem",
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            {tool.subtitle}
          </p>
        </section>

        {/* ─── CALCULATOR ─── */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          {children}
        </div>

        {/* ─── OTHER TOOLS ─── */}
        <section
          style={{
            maxWidth: 900,
            margin: "3rem auto 0",
            padding: "0 2rem",
          }}
          aria-label="Other tools"
        >
          <div className="section-label" style={{ marginBottom: "0.75rem" }}>
            More Tools
          </div>
          <h2
            className="section-title"
            style={{ fontSize: "1.2rem", marginBottom: "1rem" }}
          >
            Explore Other Calculators
          </h2>
          <div className="tools-grid" style={{ marginBottom: "0" }}>
            {otherTools.map((t) => (
              <Link
                key={t.id}
                to={t.path}
                className="tool-card"
                style={{ textDecoration: "none" }}
              >
                <div className="tool-card-icon">{t.icon}</div>
                <div className="tool-card-name">{t.shortName}</div>
                <div className="tool-card-desc">{t.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <FAQSection faqs={tool.faqs} />
      </main>
      <Footer />
    </>
  );
}
