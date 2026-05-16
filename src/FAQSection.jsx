export default function FAQSection({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section
      className="faq-section"
      aria-label="Frequently Asked Questions"
      style={{ marginTop: "3rem" }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "0 1.25rem 4rem",
        }}
      >
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>
          FAQ
        </div>
        <h2
          className="section-title"
          style={{ marginBottom: "0.5rem", fontSize: "1.4rem" }}
        >
          Frequently Asked Questions
        </h2>
        <p className="section-sub" style={{ marginBottom: "2rem" }}>
          Common questions about this tool.
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "1.25rem 1.5rem",
              }}
              itemScope
              itemType="https://schema.org/Question"
            >
              <h3
                itemProp="name"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.6rem",
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
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
