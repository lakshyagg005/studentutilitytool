import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import SalaryCalc from "./SalaryCalc";

const tool = TOOLS.find(t => t.id === "salary");

const RELATED_IDS = ["attendance", "cgpa", "percentage", "internal", "emi", "loan", "board", "age"];

const HOW_STEPS = [
  { n: "1", title: "Enter your annual CTC", body: "Type your Cost to Company in rupees as stated in your offer letter or appointment letter. CTC is the total amount your employer spends on you annually — it includes your gross salary plus employer contributions like PF and gratuity." },
  { n: "2", title: "Read your monthly gross salary", body: "The calculator instantly shows your monthly gross — CTC divided by 12. This is what you earn before deductions. Note that this is not what gets credited to your bank account." },
  { n: "3", title: "Check income tax and PF deductions", body: "The calculator applies New Tax Regime slabs (FY 2024-25) and caps PF at ₹21,600 per year. These are the two largest deductions for most salaried employees." },
  { n: "4", title: "See your monthly in-hand salary", body: "Your take-home salary appears after subtracting income tax and PF. This is the amount credited to your bank account each month." },
  { n: "5", title: "Compare annual in-hand vs CTC", body: "The difference between your annual CTC and annual in-hand is your total yearly deductions. This gap helps you budget accurately and evaluate whether a job offer meets your actual financial needs." },
];

const SALARY_COMPONENTS = [
  { component: "Basic Salary",         meaning: "Core fixed pay",                        pct: "35–50% of CTC",  example: "₹35,000" },
  { component: "HRA",                  meaning: "House Rent Allowance",                  pct: "40–50% of Basic",example: "₹17,500" },
  { component: "Special Allowance",    meaning: "Flexible pay component",                pct: "10–30% of CTC",  example: "₹20,000" },
  { component: "Performance Bonus",    meaning: "Variable pay based on target",          pct: "5–20% of CTC",   example: "₹60,000" },
  { component: "Employee PF",          meaning: "Provident Fund (employee share)",       pct: "12% of Basic",   example: "₹4,200" },
  { component: "Employer PF",          meaning: "PF contribution from employer",         pct: "12% of Basic",   example: "₹4,200" },
  { component: "Income Tax (TDS)",     meaning: "Tax Deducted at Source monthly",        pct: "Slab-based",     example: "₹8,333" },
  { component: "Professional Tax",     meaning: "State-levied tax on employment",        pct: "Fixed (up to ₹2,500/yr)", example: "₹200" },
  { component: "Net / In-Hand Salary", meaning: "Amount credited to your bank account", pct: "CTC minus all deductions", example: "₹62,267" },
];

const TAX_REGIME_TABLE = [
  { feature: "Standard Deduction",   old: "₹50,000",           newR: "₹75,000 (FY 2024-25)" },
  { feature: "80C Deduction",        old: "Up to ₹1.5L",       newR: "Not available" },
  { feature: "HRA Exemption",        old: "Available",          newR: "Not available" },
  { feature: "LTA Exemption",        old: "Available",          newR: "Not available" },
  { feature: "Home Loan Interest",   old: "Up to ₹2L",         newR: "Not available" },
  { feature: "NPS (80CCD(2))",       old: "Available",          newR: "Available" },
  { feature: "Tax on ₹10L income",   old: "~₹1,12,500",        newR: "~₹60,000" },
  { feature: "Tax on ₹15L income",   old: "~₹2,62,500",        newR: "~₹1,50,000" },
  { feature: "Best suited for",      old: "High deductions (>₹3.5L)", newR: "Simple structure / fewer deductions" },
];

const FAQS = [
  { q: "What is CTC and how is it different from in-hand salary?", a: "CTC (Cost to Company) is the total annual expenditure your employer makes on your employment. It includes your gross salary, employer's PF contribution, gratuity, health insurance premium, and other benefits. In-hand or take-home salary is what you actually receive after subtracting income tax (TDS), your own PF contribution (12% of basic), and professional tax. For a ₹12 LPA CTC, the in-hand salary is typically ₹75,000–₹85,000 per month depending on tax liability and structure." },
  { q: "How is in-hand salary calculated from CTC?", a: "In-hand salary = Annual CTC − Income Tax (TDS) − Employee PF − Professional Tax (if applicable) − other deductions, all divided by 12 for monthly. For example, on a ₹12 LPA CTC with New Tax Regime, income tax is approximately ₹90,000 + 4% cess = ₹93,600, PF is ₹21,600 (capped), making the annual in-hand approximately ₹10,14,800, or ₹84,567 per month." },
  { q: "What is the New Tax Regime for FY 2024-25?", a: "The New Tax Regime (FY 2024-25) offers lower tax rates but removes most deductions. Slabs: 0% up to ₹3L, 5% for ₹3L–6L, 10% for ₹6L–9L, 15% for ₹9L–12L, 20% for ₹12L–15L, and 30% above ₹15L. A standard deduction of ₹75,000 is available. A 4% health and education cess applies on the total tax. Income up to ₹7L is effectively tax-free under the rebate under Section 87A." },
  { q: "Should I choose Old or New Tax Regime?", a: "The New Regime is better when your total exemptions and deductions under the Old Regime are below approximately ₹3.5 lakh. If you have a home loan, pay high rent (and claim HRA), invest heavily under 80C, or have significant LTA claims, the Old Regime often results in lower tax. For most freshers with CTC below ₹8–10 LPA and minimal deductions, the New Regime offers lower effective tax." },
  { q: "What is PF deduction and how is it calculated?", a: "Employee PF = 12% of Basic Salary, subject to a wage ceiling. For employees with basic salary above ₹15,000, the mandatory employer PF contribution is calculated on ₹15,000 (₹1,800/month or ₹21,600/year). Your PF contribution of the same amount is deducted from your salary. The combined PF (employee + employer) accumulates in your EPF account and earns tax-free interest (currently 8.25% per year)." },
  { q: "Is professional tax part of every salary?", a: "Professional tax is a state-level tax levied on salaried employees in some Indian states — including Maharashtra, Karnataka, West Bengal, Tamil Nadu, Telangana, and Andhra Pradesh. The maximum is ₹2,500 per year (₹200/month in most states). States like Delhi, Rajasthan, Haryana, and Uttar Pradesh do not levy professional tax. Your employer deducts it monthly and remits it to the state government." },
  { q: "What is the basic salary and why does it matter?", a: "Basic salary is the fixed core component of your CTC. It typically ranges from 35–50% of your CTC. Basic salary matters because PF, gratuity, and HRA are all calculated as a percentage of basic. A higher basic means higher PF deduction (less take-home) but also faster accumulation of retirement corpus and higher gratuity on exit. Companies sometimes keep basic low to reduce statutory obligations." },
  { q: "How does a performance bonus affect monthly salary?", a: "Annual performance bonuses are part of your CTC but are not paid monthly in most companies. They are typically disbursed quarterly or annually based on performance rating and company results. The calculator assumes CTC divided by 12 for monthly gross. If your bonus is variable, your actual monthly salary before tax can be lower than this figure in non-bonus months." },
  { q: "What is gratuity and is it part of my in-hand salary?", a: "Gratuity is a statutory retirement benefit payable after 5 years of continuous employment. It is part of your CTC but is not paid monthly — it is a lump sum paid when you leave the organisation after completing 5 years. The gratuity amount = (15 × Last Basic Salary × Years of Service) / 26. Since you do not receive it monthly, it reduces your effective monthly in-hand even though it appears in the CTC." },
  { q: "How can I increase my take-home salary legally?", a: "Several legal methods exist: Switch to New Tax Regime if your deductions are low (saves tax for most employees below ₹15 LPA). Invest in NPS (Tier 1) for an additional deduction under Section 80CCD(2) up to 10% of basic — available even under New Regime. Claim meal vouchers and LTA if offered. Optimise your salary structure with HR — a higher special allowance and lower basic can sometimes increase take-home while reducing PF." },
];

const sectionStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem 2.5rem", marginTop: "1.25rem" };
const h2Style = { fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" };
const bodyStyle = { color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.75, margin: 0 };
const labelStyle = { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", margin: "0 0 0.5rem" };
const codeBlockStyle = { display: "block", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace", marginBottom: "0.5rem", wordBreak: "break-word" };
const inlineCode = { background: "var(--bg-input)", padding: "1px 6px", borderRadius: 4, fontSize: "0.82rem", fontFamily: "monospace" };
const thStyle = { padding: "0.6rem 1rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" };

export default function SalaryPage() {
  useSEO(tool.seo);
  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={{ ...tool, faqs: [] }}>
      <SalaryCalc />

      {/* 1 — Introduction */}
      <section aria-label="About the Salary Calculator" style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={h2Style}>Free Salary Calculator India — CTC to In-Hand Monthly Salary</h2>
        <p style={bodyStyle}>
          When you receive a job offer, the number on the letter is your CTC — Cost to Company. This is not your
          take-home salary. Between your CTC and the amount credited to your bank account every month lies a set of
          deductions that most freshers and even experienced professionals underestimate. This salary calculator
          bridges that gap by showing you exactly what you will actually earn.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          The calculator uses the New Tax Regime (FY 2024-25), which is now the default regime for salaried
          employees in India. It deducts income tax based on the latest slab rates, applies a 4% health and
          education cess, and caps PF at ₹21,600 per year in line with the EPF wage ceiling. The result is
          your real monthly in-hand salary — the number that matters when you are deciding whether to accept
          an offer, negotiate a hike, or plan your monthly budget.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Understanding your salary breakdown is more important than knowing your CTC. Two candidates with
          identical CTC packages can have very different in-hand salaries depending on their salary structure,
          tax regime choice, and applicable deductions. A candidate with a higher basic salary and employer
          PF may take home less than one with a lower CTC but no PF deduction and a higher variable component.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          Use this calculator before every salary negotiation, job change, and tax filing season. It gives
          you clarity on what you are earning, what you are losing to deductions, and what you can realistically
          spend, save, and invest every month. No sign-up required — results appear instantly.
        </p>
      </section>

      {/* 2 — How to Use */}
      <section aria-label="How to use the salary calculator" style={sectionStyle}>
        <h2 style={h2Style}>How to Use This Salary Calculator — Step by Step</h2>
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
      <section aria-label="Salary calculation formula" style={sectionStyle}>
        <h2 style={h2Style}>Salary Calculation Formula</h2>
        <p style={labelStyle}>Step 1 — Monthly and Annual Gross</p>
        <code style={codeBlockStyle}>Monthly Gross = Annual CTC / 12</code>
        <code style={codeBlockStyle}>Annual Gross = CTC (assumed full fixed package)</code>

        <p style={{ ...labelStyle, marginTop: "1.25rem" }}>Step 2 — Income Tax (New Regime, FY 2024-25)</p>
        <code style={codeBlockStyle}>0%   → Income up to ₹3,00,000</code>
        <code style={codeBlockStyle}>5%   → ₹3,00,001 to ₹6,00,000</code>
        <code style={codeBlockStyle}>10%  → ₹6,00,001 to ₹9,00,000</code>
        <code style={codeBlockStyle}>15%  → ₹9,00,001 to ₹12,00,000</code>
        <code style={codeBlockStyle}>20%  → ₹12,00,001 to ₹15,00,000</code>
        <code style={codeBlockStyle}>30%  → Above ₹15,00,000</code>
        <code style={{ ...codeBlockStyle, color: "var(--accent)" }}>Total Tax = Slab Tax + 4% Health & Education Cess</code>

        <p style={{ ...labelStyle, marginTop: "1.25rem" }}>Step 3 — PF Deduction</p>
        <code style={codeBlockStyle}>PF = min(Annual CTC × 12%, ₹21,600)</code>
        <p style={{ ...bodyStyle, fontSize: "0.85rem", margin: "0.5rem 0 1.25rem" }}>PF is capped at ₹21,600/year (₹1,800/month) per EPF wage ceiling on ₹15,000 basic.</p>

        <p style={labelStyle}>Step 4 — Annual In-Hand</p>
        <code style={{ ...codeBlockStyle, color: "var(--accent)" }}>Annual In-Hand = CTC − Total Tax − PF</code>
        <code style={codeBlockStyle}>Monthly In-Hand = Annual In-Hand / 12</code>
      </section>

      {/* 4 — Worked Example */}
      <section aria-label="Salary worked example" style={sectionStyle}>
        <h2 style={h2Style}>Worked Example — ₹12 LPA CTC</h2>
        <p style={{ ...bodyStyle, marginBottom: "1rem" }}>
          A software developer receives an offer of ₹12,00,000 CTC per year. Here is the full breakdown
          under the New Tax Regime (FY 2024-25):
        </p>

        <p style={labelStyle}>Input</p>
        <code style={codeBlockStyle}>Annual CTC = ₹12,00,000</code>
        <code style={codeBlockStyle}>Monthly Gross = ₹12,00,000 / 12 = ₹1,00,000</code>

        <p style={{ ...labelStyle, marginTop: "1rem" }}>Income Tax Calculation (New Regime)</p>
        <code style={codeBlockStyle}>0% on ₹3,00,000          = ₹0</code>
        <code style={codeBlockStyle}>5% on ₹3,00,000          = ₹15,000</code>
        <code style={codeBlockStyle}>10% on ₹3,00,000         = ₹30,000</code>
        <code style={codeBlockStyle}>15% on ₹3,00,000         = ₹45,000</code>
        <code style={codeBlockStyle}>Subtotal Tax              = ₹90,000</code>
        <code style={codeBlockStyle}>4% Cess on ₹90,000       = ₹3,600</code>
        <code style={{ ...codeBlockStyle, color: "var(--warning)" }}>Total Income Tax          = ₹93,600 / year  →  ₹7,800 / month</code>

        <p style={{ ...labelStyle, marginTop: "1rem" }}>PF Deduction</p>
        <code style={codeBlockStyle}>12% of ₹12,00,000 = ₹1,44,000 → Capped at ₹21,600 / year</code>
        <code style={{ ...codeBlockStyle, color: "var(--warning)" }}>Monthly PF                = ₹1,800</code>

        <p style={{ ...labelStyle, marginTop: "1rem" }}>Final Result</p>
        <code style={codeBlockStyle}>Annual In-Hand = ₹12,00,000 − ₹93,600 − ₹21,600 = ₹10,84,800</code>
        <code style={{ ...codeBlockStyle, color: "var(--accent)" }}>Monthly In-Hand = ₹10,84,800 / 12 = ₹90,400</code>
        <p style={{ ...bodyStyle, fontSize: "0.85rem", marginTop: "0.75rem" }}>
          On a ₹12 LPA CTC, you take home approximately{" "}
          <code style={inlineCode}>₹90,400/month</code> under the New Tax Regime — about 90.4% of monthly gross.
        </p>
      </section>

      {/* 5 — Salary Components Table */}
      <section aria-label="Salary components breakdown table" style={sectionStyle}>
        <h2 style={h2Style}>Salary Components — What Each Part Means</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          A typical Indian salary structure includes several components. Understanding each helps you evaluate
          an offer accurately and identify opportunities to optimise your take-home.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr", background: "var(--bg-input)", borderBottom: "1px solid var(--border)", minWidth: 520 }}>
            {["Component", "Meaning", "Typical %", "Example (₹10L CTC)"].map(h => <span key={h} style={thStyle}>{h}</span>)}
          </div>
          {SALARY_COMPONENTS.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr", borderBottom: i < SALARY_COMPONENTS.length - 1 ? "1px solid var(--border)" : "none", minWidth: 520, alignItems: "center" }}>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>{row.component}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{row.meaning}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>{row.pct}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.example}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — Tax Regime Comparison */}
      <section aria-label="Old vs New Tax Regime comparison" style={sectionStyle}>
        <h2 style={h2Style}>Old vs New Tax Regime — Which is Better for You?</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Since FY 2023-24, the New Tax Regime is the default. You must actively opt for the Old Regime
          if you want to claim deductions. The right choice depends on your deductions. Here is a side-by-side comparison:
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr", background: "var(--bg-input)", borderBottom: "1px solid var(--border)", minWidth: 420 }}>
            {["Feature", "Old Regime", "New Regime (Default)"].map(h => <span key={h} style={thStyle}>{h}</span>)}
          </div>
          {TAX_REGIME_TABLE.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr", borderBottom: i < TAX_REGIME_TABLE.length - 1 ? "1px solid var(--border)" : "none", minWidth: 420, alignItems: "center" }}>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.feature}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--warning)" }}>{row.old}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--accent)" }}>{row.newR}</span>
            </div>
          ))}
        </div>
        <p style={{ ...bodyStyle, marginTop: "1rem", fontSize: "0.85rem" }}>
          <strong style={{ color: "var(--text-primary)" }}>Quick rule:</strong> If your annual deductions (80C + HRA + home loan + other) exceed ₹3.5 lakh, the Old Regime
          likely saves more tax. For most salaried freshers and mid-level employees with fewer deductions,
          the New Regime results in lower tax.
        </p>
      </section>

      {/* 7 — Interpret Salary */}
      <section aria-label="How to interpret your monthly in-hand salary" style={sectionStyle}>
        <h2 style={h2Style}>What Your Monthly In-Hand Salary Means</h2>
        {[
          { range: "Below ₹25,000 / month", label: "Entry Level", body: "Typical for freshers in Tier-2 cities, BPO roles, teaching, retail, and junior positions. Sufficient for basic living if housing costs are low. Focus on building skills aggressively to move to the next bracket within 18–24 months." },
          { range: "₹25,000 – ₹50,000 / month", label: "Growing", body: "The salary range for 2–5 year professionals in mid-size companies and most government jobs. Comfortable for single individuals in metro cities when shared accommodation is opted for. Savings of 15–20% are achievable with careful budgeting." },
          { range: "₹50,000 – ₹1,00,000 / month", label: "Good", body: "Corresponds to senior professionals, experienced engineers, product managers, and finance roles at established companies. Allows meaningful investment, EMI repayments, and lifestyle upgrades. Tax planning becomes important at this level." },
          { range: "Above ₹1,00,000 / month", label: "Excellent", body: "Senior managers, engineering leads, finance professionals, and specialist consultants. At this level, optimising your salary structure (higher special allowance, NPS contributions, correct tax regime) can save ₹50,000–₹1,50,000 annually in taxes. Professional financial planning is strongly recommended." },
        ].map((item, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: "3px solid var(--accent)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", marginBottom: i < 3 ? "0.75rem" : 0 }}>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.875rem", margin: "0 0 0.35rem" }}>{item.range} — <span style={{ color: "var(--accent)" }}>{item.label}</span></p>
            <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
          </div>
        ))}
      </section>

      {/* 8 — Common Mistakes */}
      <section aria-label="Common salary calculation mistakes" style={sectionStyle}>
        <h2 style={h2Style}>Common Salary Mistakes Employees Make</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { title: "Confusing CTC with in-hand salary", body: "The most common mistake. When comparing two offers, always compare in-hand salaries, not CTC. A ₹15 LPA offer with no allowances and high PF can yield less take-home than a ₹12 LPA offer with a favourable structure." },
            { title: "Choosing the wrong tax regime", body: "Many employees default to the New Regime without calculating whether the Old Regime saves more tax. If you have a home loan, pay rent, and invest ₹1.5L in ELSS, the Old Regime can save ₹40,000–₹80,000 annually on incomes between ₹10–20 LPA." },
            { title: "Ignoring PF as part of the savings equation", body: "PF deduction feels like lost income but is actually forced savings earning 8.25% tax-free interest. On a 30-year career, ₹21,600/year in PF (with matching employer contribution) compounds to a significant retirement corpus. Do not view PF only as a deduction." },
            { title: "Not accounting for variable pay in budgeting", body: "Many CTC structures include 10–20% variable (performance bonus). This is not guaranteed and should not be counted as part of monthly budget. Plan finances on fixed in-hand only and treat variable pay as surplus when it arrives." },
          ].map((item, i) => (
            <article key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>{i + 1}. {item.title}</h3>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 9 — Tips */}
      <section aria-label="Salary saving and planning tips" style={sectionStyle}>
        <h2 style={h2Style}>Tips to Maximise Your Take-Home and Build Wealth</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {[
            "Invest ₹1.5L per year in 80C instruments (PPF, ELSS, EPF, LIC) if using Old Regime — this saves ₹15,000–₹45,000 in tax depending on your slab.",
            "Contribute to NPS Tier 1 for an extra deduction under Section 80CCD(2) — this works in both regimes and provides 10% of basic as employer NPS contribution tax-free.",
            "Check if your employer offers meal vouchers or food coupons (up to ₹2,200/month tax-free) or Leave Travel Allowance (LTA) — these reduce taxable income without changing your CTC.",
            "Build a 3–6 month emergency fund in a liquid fund before investing in markets. This prevents you from breaking long-term investments during financial emergencies.",
            "Negotiate salary structure, not just CTC. Ask HR for a higher special allowance and lower basic during negotiations — this can increase take-home while keeping CTC constant.",
            "Review your tax regime choice every year in April. As income grows and life circumstances change (home loan, marriage, children), the optimal regime can switch between Old and New.",
            "Start a SIP in an index fund with even 10–15% of your take-home. Consistency over 10+ years produces returns that significantly outpace inflation.",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>→</span>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 10 — FAQ */}
      <section aria-label="Salary calculator FAQs" style={sectionStyle} itemScope itemType="https://schema.org/FAQPage">
        <h2 style={h2Style}>Frequently Asked Questions about Salary Calculation</h2>
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

      {/* 11 — Related Tools */}
      <section aria-label="Related financial and academic tools" style={{ ...sectionStyle, marginBottom: "1rem" }}>
        <h2 style={h2Style}>Related Tools</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem", fontSize: "0.865rem" }}>Other calculators students and professionals use alongside the salary calculator.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "0.875rem" }}>
          {relatedTools.map(t => (
            <Link key={t.id} to={t.path} aria-label={`Open ${t.name}`}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
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