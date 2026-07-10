import { useState, useMemo, useEffect, useRef } from "react";
import CopyBtn from "./CopyBtn";
import { fmt } from "./helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
// jsPDF import guarded for safe compilation
let jsPDF;
try {
  jsPDF = require("jspdf").jsPDF;
} catch (e) {
  jsPDF = null;
}

// Constants for tax slabs and other configs
const NEW_REGIME_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.30 },
];
const NEW_REGIME_STANDARD_DEDUCTION = 75000;
const OLD_REGIME_STANDARD_DEDUCTION = 50000;
const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];

// Professional Tax slabs per state (monthly)
const PROFESSIONAL_TAX_STATES = {
  Karnataka: [
    { max: 15000, tax: 0 },
    { max: 20000, tax: 150 },
    { max: Infinity, tax: 200 },
  ],
  Maharashtra: [
    { max: 7500, tax: 0 },
    { max: 10000, tax: 175 },
    { max: Infinity, tax: 200 },
  ],
  Telangana: [
    { max: 15000, tax: 0 },
    { max: 20000, tax: 150 },
    { max: Infinity, tax: 200 },
  ],
  "Tamil Nadu": [
    { max: 15000, tax: 0 },
    { max: 20000, tax: 150 },
    { max: Infinity, tax: 200 },
  ],
  Delhi: [
    { max: Infinity, tax: 0 },
  ],
  Rajasthan: [
    { max: Infinity, tax: 0 },
  ],
  Other: [
    { max: Infinity, tax: 0 },
  ],
};

const COLORS = {
  netPay: "#4caf50",
  tax: "#f44336",
  empPF: "#2196f3",
  employerPF: "#03a9f4",
  gratuity: "#ff9800",
  variablePay: "#9c27b0",
};

// Helper: Calculate tax for slabs
function calculateTaxSlabs(income, slabs) {
  let tax = 0;
  for (const slab of slabs) {
    if (income > slab.min) {
      const taxable = Math.min(income, slab.max) - slab.min;
      tax += taxable * slab.rate;
    }
  }
  return tax;
}

// New Regime tax calculation with rebate and cess
export function calculateNewTax(income) {
  const taxableIncome = Math.max(0, income - NEW_REGIME_STANDARD_DEDUCTION);

  let tax = calculateTaxSlabs(taxableIncome, NEW_REGIME_SLABS);

  if (taxableIncome <= 1200000) {
    tax = Math.max(0, tax - Math.min(tax, 60000));
  }

  tax *= 1.04;
  return Math.round(tax);
}

// Old Regime tax calculation with rebate and cess
export function calculateOldTax(income) {
  const taxableIncome = Math.max(0, income - OLD_REGIME_STANDARD_DEDUCTION);

  let tax = calculateTaxSlabs(taxableIncome, OLD_REGIME_SLABS);

  if (taxableIncome <= 500000) {
    tax = Math.max(0, tax - Math.min(tax, 12500));
  }

  tax *= 1.04;
  return Math.round(tax);
}

// Marginal tax rate calculation for given income and slabs
function calculateMarginalTaxRate(income, slabs) {
  const delta = 1; // small increment
  const tax1 = calculateTaxSlabs(income, slabs);
  const tax2 = calculateTaxSlabs(income + delta, slabs);
  const marginalRate = (tax2 - tax1) / delta;
  return marginalRate;
}

// Clamp and parse number input
function clampNonNegative(val) {
  return Math.max(0, Math.round(Number(val) || 0));
}

// Calculate Professional Tax monthly based on state and gross monthly salary
function calculateProfessionalTax(state, grossMonthly) {
  const slabs = PROFESSIONAL_TAX_STATES[state] || PROFESSIONAL_TAX_STATES["Other"];
  for (const slab of slabs) {
    if (grossMonthly <= slab.max) return slab.tax;
  }
  return 0;
}

// Calculate salary breakup and tax details given inputs
function calculateSalaryDetails({
  grossSalaryAnnual,
  variablePayAnnual,
  joiningBonusAnnual,
  retentionBonusAnnual,
  basicSalaryPercent,
  profTaxState,
  regime,
}) {
  // Basic Salary
  const basicAnnual = (grossSalaryAnnual * basicSalaryPercent) / 100;

  // HRA = 50% of Basic (assuming metro city for simplicity)
  const hraAnnual = basicAnnual * 0.5;

  // Special Allowance = Gross - (Basic + HRA)
  const specialAllowanceAnnual = grossSalaryAnnual - basicAnnual - hraAnnual;

  // Employer PF = 12% of EPF wage ceiling (₹15,000/month) or actual basic, whichever is lower (estimated)
  const employerPFAnnual = Math.min(basicAnnual * 0.12, 1800 * 12);

  // Employee PF = 12% of Basic, capped at 21600/year
  const employeePFAnnual = Math.min(basicAnnual * 0.12, 21600);

  // Gratuity = 4.81% of Basic (approximate)
  const gratuityAnnual = basicAnnual * 0.0481;

  // Professional Tax (monthly)
  const profTaxMonthly = calculateProfessionalTax(profTaxState, grossSalaryAnnual / 12);
  const profTaxAnnual = profTaxMonthly * 12;

  // Total CTC = Gross Salary + Employer PF + Gratuity + Variable Pay + Joining + Retention Bonuses
  const totalCTC = grossSalaryAnnual + employerPFAnnual + gratuityAnnual + variablePayAnnual + joiningBonusAnnual + retentionBonusAnnual;

  // Taxable Income = Gross + Variable + Joining + Retention - Employee PF - Prof Tax (assuming these deductions)
  // For simplicity, we treat bonuses as one-time annual taxable income additions.
  let taxableIncome = grossSalaryAnnual + variablePayAnnual + joiningBonusAnnual + retentionBonusAnnual - employeePFAnnual - profTaxAnnual;
  if (taxableIncome < 0) taxableIncome = 0;

  // Calculate tax based on regime
  const tax = regime === "new"
    ? calculateNewTax(taxableIncome)
    : calculateOldTax(taxableIncome);

  // Effective tax rate
  const effectiveTaxRate = taxableIncome > 0 ? (tax / taxableIncome) : 0;

  // Marginal tax rate
  const marginalTaxRate = regime === "new"
    ? calculateMarginalTaxRate(taxableIncome, NEW_REGIME_SLABS)
    : calculateMarginalTaxRate(taxableIncome, OLD_REGIME_SLABS);

  // Net In-hand = Total CTC - Tax - Employee PF - Prof Tax
  const netInHandAnnual = totalCTC - tax - employeePFAnnual - profTaxAnnual;

  return {
    basicAnnual,
    hraAnnual,
    specialAllowanceAnnual,
    employerPFAnnual,
    employeePFAnnual,
    gratuityAnnual,
    profTaxMonthly,
    profTaxAnnual,
    variablePayAnnual,
    joiningBonusAnnual,
    retentionBonusAnnual,
    grossSalaryAnnual,
    totalCTC,
    taxableIncome,
    tax,
    effectiveTaxRate,
    marginalTaxRate,
    netInHandAnnual,
  };
}

// Helper to format percentage
function fmtPct(val) {
  return (val * 100).toFixed(2) + "%";
}

export default function SalaryCalc() {
  // Input states
  const [grossSalaryInput, setGrossSalaryInput] = useState("");
  const [variablePayInput, setVariablePayInput] = useState("");
  const [joiningBonusInput, setJoiningBonusInput] = useState("");
  const [retentionBonusInput, setRetentionBonusInput] = useState("");
  const [basicSalaryPercent, setBasicSalaryPercent] = useState(40);
  const [regime, setRegime] = useState("new"); // new or old
  const [period, setPeriod] = useState("annual"); // annual or monthly
  const [profTaxState, setProfTaxState] = useState("Karnataka");
  const [reverseMode, setReverseMode] = useState(false);
  const [reverseInput, setReverseInput] = useState("");
  const [offerComparisonMode, setOfferComparisonMode] = useState(false);

  // Offer comparison inputs
  const [offer1, setOffer1] = useState({
    grossSalaryInput: "",
    variablePayInput: "",
    joiningBonusInput: "",
    retentionBonusInput: "",
    basicSalaryPercent: 40,
    regime: "new",
    profTaxState: "Karnataka",
  });
  const [offer2, setOffer2] = useState({
    grossSalaryInput: "",
    variablePayInput: "",
    joiningBonusInput: "",
    retentionBonusInput: "",
    basicSalaryPercent: 40,
    regime: "new",
    profTaxState: "Karnataka",
  });

  // Clamp inputs and convert to annual
  function toAnnual(val) {
    return period === "monthly" ? val * 12 : val;
  }
  function fromAnnual(val) {
    return period === "monthly" ? val / 12 : val;
  }

  // Clamp inputs
  const grossSalaryAnnual = toAnnual(clampNonNegative(grossSalaryInput));
  const variablePayAnnual = toAnnual(clampNonNegative(variablePayInput));
  const joiningBonusAnnual = toAnnual(clampNonNegative(joiningBonusInput));
  const retentionBonusAnnual = toAnnual(clampNonNegative(retentionBonusInput));

  // Calculate salary details for selected regime
  const salaryDetails = useMemo(() => {
    if (grossSalaryAnnual === 0 && variablePayAnnual === 0 && joiningBonusAnnual === 0 && retentionBonusAnnual === 0) {
      return null;
    }
    return calculateSalaryDetails({
      grossSalaryAnnual,
      variablePayAnnual,
      joiningBonusAnnual,
      retentionBonusAnnual,
      basicSalaryPercent,
      profTaxState,
      regime,
    });
  }, [grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, regime]);

  // Calculate salary details for both regimes for comparison
  const comparisonDetails = useMemo(() => {
    if (grossSalaryAnnual === 0 && variablePayAnnual === 0 && joiningBonusAnnual === 0 && retentionBonusAnnual === 0) {
      return null;
    }
    const newRegimeDetails = calculateSalaryDetails({
      grossSalaryAnnual,
      variablePayAnnual,
      joiningBonusAnnual,
      retentionBonusAnnual,
      basicSalaryPercent,
      profTaxState,
      regime: "new",
    });
    const oldRegimeDetails = calculateSalaryDetails({
      grossSalaryAnnual,
      variablePayAnnual,
      joiningBonusAnnual,
      retentionBonusAnnual,
      basicSalaryPercent,
      profTaxState,
      regime: "old",
    });
    const taxDiff = oldRegimeDetails.tax - newRegimeDetails.tax;
    const cheaperRegime = taxDiff > 0 ? "New Regime" : (taxDiff < 0 ? "Old Regime" : "Both equal");
    const savings = Math.abs(taxDiff);
    return { newRegimeDetails, oldRegimeDetails, taxDiff, cheaperRegime, savings };
  }, [grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState]);

  // Reverse calculator: estimate required gross salary to achieve desired net in-hand
  const reverseAnnualDesired = toAnnual(clampNonNegative(reverseInput));
  const reverseResult = useMemo(() => {
    if (!reverseMode || reverseAnnualDesired === 0) return null;

    // Binary search for required gross salary annual
    let lo = 0;
    let hi = 1e8;
    let best = null;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const details = calculateSalaryDetails({
        grossSalaryAnnual: mid,
        variablePayAnnual: 0,
        joiningBonusAnnual: 0,
        retentionBonusAnnual: 0,
        basicSalaryPercent,
        profTaxState,
        regime,
      });
      if (!details) break;
      const net = details.netInHandAnnual;
      if (net >= reverseAnnualDesired) {
        hi = mid;
        best = details;
      } else {
        lo = mid;
      }
    }
    return best;
  }, [reverseMode, reverseAnnualDesired, basicSalaryPercent, profTaxState, regime]);

  // Offer comparison calculations
  const offer1Details = useMemo(() => {
    const g = toAnnual(clampNonNegative(offer1.grossSalaryInput));
    const v = toAnnual(clampNonNegative(offer1.variablePayInput));
    const j = toAnnual(clampNonNegative(offer1.joiningBonusInput));
    const r = toAnnual(clampNonNegative(offer1.retentionBonusInput));
    if (g === 0 && v === 0 && j === 0 && r === 0) return null;
    return calculateSalaryDetails({
      grossSalaryAnnual: g,
      variablePayAnnual: v,
      joiningBonusAnnual: j,
      retentionBonusAnnual: r,
      basicSalaryPercent: offer1.basicSalaryPercent,
      profTaxState: offer1.profTaxState,
      regime: offer1.regime,
    });
  }, [offer1, period]);

  const offer2Details = useMemo(() => {
    const g = toAnnual(clampNonNegative(offer2.grossSalaryInput));
    const v = toAnnual(clampNonNegative(offer2.variablePayInput));
    const j = toAnnual(clampNonNegative(offer2.joiningBonusInput));
    const r = toAnnual(clampNonNegative(offer2.retentionBonusInput));
    if (g === 0 && v === 0 && j === 0 && r === 0) return null;
    return calculateSalaryDetails({
      grossSalaryAnnual: g,
      variablePayAnnual: v,
      joiningBonusAnnual: j,
      retentionBonusAnnual: r,
      basicSalaryPercent: offer2.basicSalaryPercent,
      profTaxState: offer2.profTaxState,
      regime: offer2.regime,
    });
  }, [offer2, period]);

  // Copy text for clipboard
  const copyText = reverseMode && reverseResult
    ? `Regime: ${regime === "new" ? "New" : "Old"} | Required Gross Salary: ₹${fmt(reverseResult.grossSalaryAnnual)} | Tax: ₹${fmt(reverseResult.tax)} | Employee PF: ₹${fmt(reverseResult.employeePFAnnual)} | Net In-hand: ₹${fmt(period === "monthly" ? reverseResult.netInHandAnnual/12 : reverseResult.netInHandAnnual)} (${period === "monthly" ? "monthly" : "annual"})`
    : salaryDetails
      ? `Regime: ${regime === "new" ? "New" : "Old"} | Net In-hand: ₹${fmt(period === "monthly" ? salaryDetails.netInHandAnnual / 12 : salaryDetails.netInHandAnnual)} | Tax: ₹${fmt(salaryDetails.tax)} | Employee PF: ₹${fmt(salaryDetails.employeePFAnnual)} | Total CTC: ₹${fmt(salaryDetails.totalCTC)} (${period === "monthly" ? "monthly" : "annual"})`
      : "";

  // Download PDF handler
  const handleDownloadPDF = () => {
    if (!jsPDF || !salaryDetails) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Breakdown", 10, 10);
    doc.setFontSize(12);
    doc.text(`Period: ${period === "monthly" ? "Monthly" : "Annual"}`, 10, 20);
    doc.text(`Tax Regime: ${regime === "new" ? "New" : "Old"}`, 10, 30);
    doc.text(`Professional Tax State: ${profTaxState}`, 10, 40);
    doc.text(`Basic Salary %: ${basicSalaryPercent}%`, 10, 50);
    doc.text(`Gross Salary: ₹${fmt(fromAnnual(salaryDetails.grossSalaryAnnual))}`, 10, 60);
    doc.text(`Variable Pay: ₹${fmt(fromAnnual(salaryDetails.variablePayAnnual))}`, 10, 70);
    doc.text(`Joining Bonus: ₹${fmt(fromAnnual(salaryDetails.joiningBonusAnnual))}`, 10, 80);
    doc.text(`Retention Bonus: ₹${fmt(fromAnnual(salaryDetails.retentionBonusAnnual))}`, 10, 90);
    doc.text(`Basic Salary: ₹${fmt(fromAnnual(salaryDetails.basicAnnual))}`, 10, 100);
    doc.text(`HRA: ₹${fmt(fromAnnual(salaryDetails.hraAnnual))}`, 10, 110);
    doc.text(`Special Allowance: ₹${fmt(fromAnnual(salaryDetails.specialAllowanceAnnual))}`, 10, 120);
    doc.text(`Employer PF: ₹${fmt(fromAnnual(salaryDetails.employerPFAnnual))}`, 10, 130);
    doc.text(`Employee PF: ₹${fmt(fromAnnual(salaryDetails.employeePFAnnual))}`, 10, 140);
    doc.text(`Gratuity: ₹${fmt(fromAnnual(salaryDetails.gratuityAnnual))}`, 10, 150);
    doc.text(`Professional Tax (annual): ₹${fmt(fromAnnual(salaryDetails.profTaxAnnual))}`, 10, 160);
    doc.text(`Taxable Income: ₹${fmt(fromAnnual(salaryDetails.taxableIncome))}`, 10, 170);
    doc.text(`Income Tax: ₹${fmt(fromAnnual(salaryDetails.tax))}`, 10, 180);
    doc.text(`Net In-hand: ₹${fmt(fromAnnual(salaryDetails.netInHandAnnual))}`, 10, 190);
    doc.text(`Effective Tax Rate: ${fmtPct(salaryDetails.effectiveTaxRate)}`, 10, 200);
    doc.text(`Marginal Tax Rate: ${fmtPct(salaryDetails.marginalTaxRate)}`, 10, 210);
    doc.save("salary_breakdown.pdf");
  };

  // Share result handler
  const handleShareResult = () => {
    if (!salaryDetails) return;
    const text = copyText;
    if (navigator.share) {
      navigator.share({
        title: "Salary Calculator Result",
        text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert("Result copied to clipboard");
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Result copied to clipboard");
    }
  };

  // Chart data for donut chart
  const chartData = salaryDetails ? [
    { name: "Net Pay", value: salaryDetails.netInHandAnnual, color: COLORS.netPay },
    { name: "Income Tax", value: salaryDetails.tax, color: COLORS.tax },
    { name: "Employee PF", value: salaryDetails.employeePFAnnual, color: COLORS.empPF },
    { name: "Employer PF", value: salaryDetails.employerPFAnnual, color: COLORS.employerPF },
    { name: "Gratuity", value: salaryDetails.gratuityAnnual, color: COLORS.gratuity },
    { name: "Variable Pay", value: salaryDetails.variablePayAnnual, color: COLORS.variablePay },
  ] : [];

  // Fixed height style for result cards to avoid layout shift
  const fixedCardStyle = { minHeight: "120px" };

  // Reset handler
  function handleReset() {
    setGrossSalaryInput("");
    setVariablePayInput("");
    setJoiningBonusInput("");
    setRetentionBonusInput("");
    setBasicSalaryPercent(40);
    setProfTaxState("Karnataka");
    setReverseInput("");
    setReverseMode(false);
    setRegime("new");
  }

  // Offer comparison reset
  function handleOfferReset() {
    setOffer1({
      grossSalaryInput: "",
      variablePayInput: "",
      joiningBonusInput: "",
      retentionBonusInput: "",
      basicSalaryPercent: 40,
      regime: "new",
      profTaxState: "Karnataka",
    });
    setOffer2({
      grossSalaryInput: "",
      variablePayInput: "",
      joiningBonusInput: "",
      retentionBonusInput: "",
      basicSalaryPercent: 40,
      regime: "new",
      profTaxState: "Karnataka",
    });
  }

  // Render salary breakup section
  function renderSalaryBreakup(details) {
    if (!details) return null;
    // Card styles
    const greenBg = { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", ...fixedCardStyle };
    const blueBg = { background: "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.15)", ...fixedCardStyle };
    const redBg = { background: "rgba(244,67,54,0.08)", border: "1px solid rgba(244,67,54,0.15)", ...fixedCardStyle };
    const summaryBg = {
      background: "linear-gradient(90deg, #166534 80%, #22c55e 100%)",
      color: "#fff",
      borderRadius: "12px",
      fontWeight: 700,
      fontFamily: "var(--font-display)",
      fontSize: "1.15rem",
      boxShadow: "0 2px 8px 0 rgba(34,197,94,0.12)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ...fixedCardStyle,
    };
    return (
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Salary Breakup</h3>

        {/* Earnings Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>💼 Earnings</div>
          <div className="result-grid">
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.grossSalaryAnnual))}</span>
              <span className="result-label">Gross Salary</span>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.basicAnnual))}</span>
              <span className="result-label">Basic Salary</span>
              <small style={{ color: "#666" }}>40% of Gross</small>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.hraAnnual))}</span>
              <span className="result-label">House Rent Allowance</span>
              <small style={{ color: "#666" }}>50% of Basic</small>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.specialAllowanceAnnual))}</span>
              <span className="result-label">Special Allowance</span>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.variablePayAnnual))}</span>
              <span className="result-label">Variable Pay</span>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.joiningBonusAnnual))}</span>
              <span className="result-label">Joining Bonus</span>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.retentionBonusAnnual))}</span>
              <span className="result-label">Retention Bonus</span>
            </div>
          </div>
        </div>

        {/* Employer Contributions Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>🧾 Employer Contributions</div>
          <div className="result-grid">
            <div className="result-card" style={blueBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.employerPFAnnual))}</span>
              <span className="result-label">Employer PF</span>
              <small style={{ color: "#666" }}>Estimated (EPF wage ceiling applied)</small>
            </div>
            <div className="result-card" style={blueBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.gratuityAnnual))}</span>
              <span className="result-label">Gratuity</span>
              <small style={{ color: "#666" }}>4.81% of Basic</small>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>➖ Deductions</div>
          <div className="result-grid">
            <div className="result-card" style={redBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.employeePFAnnual))}</span>
              <span className="result-label">Employee PF</span>
            </div>
            <div className="result-card" style={redBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.profTaxAnnual))}</span>
              <span className="result-label">Professional Tax</span>
            </div>
            <div className="result-card" style={redBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(details.tax))}</span>
              <span className="result-label">Income Tax</span>
            </div>
          </div>
        </div>

        {/* Final Summary Section */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>💰 Final Summary</div>
          <div className="result-grid">
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>₹{fmt(fromAnnual(details.totalCTC))}</span>
              <span style={{ marginTop: "0.4rem" }}>Total CTC</span>
            </div>
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>₹{fmt(fromAnnual(details.netInHandAnnual))}</span>
              <span style={{ marginTop: "0.4rem" }}>Annual In-Hand</span>
            </div>
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>₹{fmt(fromAnnual(details.netInHandAnnual / 12))}</span>
              <span style={{ marginTop: "0.4rem" }}>Monthly In-Hand</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render donut chart for salary allocation
  function renderDonutChart() {
    if (!salaryDetails) return null;
    return (
      <div style={{ width: "100%", height: 300, marginTop: "1rem" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip formatter={(value) => `₹${fmt(fromAnnual(value))}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render offer comparison form
  function renderOfferComparisonForm() {
    return (
      <div>
        <h3>Offer Comparison</h3>
        <div className="form-grid">
          {/* Offer 1 */}
          <div className="offer-column">
            <h4>Offer 1</h4>
            <div className="form-field">
              <label className="form-label">Gross Salary ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer1.grossSalaryInput}
                onChange={e => setOffer1({ ...offer1, grossSalaryInput: e.target.value })}
                placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 800000"}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Variable Pay ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer1.variablePayInput}
                onChange={e => setOffer1({ ...offer1, variablePayInput: e.target.value })}
                placeholder="e.g. 100000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Joining Bonus ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer1.joiningBonusInput}
                onChange={e => setOffer1({ ...offer1, joiningBonusInput: e.target.value })}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Retention Bonus ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer1.retentionBonusInput}
                onChange={e => setOffer1({ ...offer1, retentionBonusInput: e.target.value })}
                placeholder="e.g. 40000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Basic Salary % ({offer1.basicSalaryPercent}%)</label>
              <input
                type="range"
                min="35"
                max="50"
                value={offer1.basicSalaryPercent}
                onChange={e => setOffer1({ ...offer1, basicSalaryPercent: Number(e.target.value) })}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tax Regime</label>
              <select
                className="form-input"
                value={offer1.regime}
                onChange={e => setOffer1({ ...offer1, regime: e.target.value })}
              >
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Professional Tax State</label>
              <select
                className="form-input"
                value={offer1.profTaxState}
                onChange={e => setOffer1({ ...offer1, profTaxState: e.target.value })}
              >
                {Object.keys(PROFESSIONAL_TAX_STATES).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Offer 2 */}
          <div className="offer-column">
            <h4>Offer 2</h4>
            <div className="form-field">
              <label className="form-label">Gross Salary ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer2.grossSalaryInput}
                onChange={e => setOffer2({ ...offer2, grossSalaryInput: e.target.value })}
                placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 800000"}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Variable Pay ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer2.variablePayInput}
                onChange={e => setOffer2({ ...offer2, variablePayInput: e.target.value })}
                placeholder="e.g. 100000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Joining Bonus ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer2.joiningBonusInput}
                onChange={e => setOffer2({ ...offer2, joiningBonusInput: e.target.value })}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Retention Bonus ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={offer2.retentionBonusInput}
                onChange={e => setOffer2({ ...offer2, retentionBonusInput: e.target.value })}
                placeholder="e.g. 40000"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Basic Salary % ({offer2.basicSalaryPercent}%)</label>
              <input
                type="range"
                min="35"
                max="50"
                value={offer2.basicSalaryPercent}
                onChange={e => setOffer2({ ...offer2, basicSalaryPercent: Number(e.target.value) })}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tax Regime</label>
              <select
                className="form-input"
                value={offer2.regime}
                onChange={e => setOffer2({ ...offer2, regime: e.target.value })}
              >
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Professional Tax State</label>
              <select
                className="form-input"
                value={offer2.profTaxState}
                onChange={e => setOffer2({ ...offer2, profTaxState: e.target.value })}
              >
                {Object.keys(PROFESSIONAL_TAX_STATES).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {(offer1Details && offer2Details) && (
          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card" style={{ minHeight: "40px" }}>
              <strong>Net In-hand</strong>
              <div>₹{fmt(fromAnnual(offer1Details.netInHandAnnual))}</div>
              <div>₹{fmt(fromAnnual(offer2Details.netInHandAnnual))}</div>
            </div>
            <div className="result-card" style={{ minHeight: "40px" }}>
              <strong>Total Tax</strong>
              <div>₹{fmt(fromAnnual(offer1Details.tax))}</div>
              <div>₹{fmt(fromAnnual(offer2Details.tax))}</div>
            </div>
            <div className="result-card" style={{ minHeight: "40px" }}>
              <strong>Total CTC</strong>
              <div>₹{fmt(fromAnnual(offer1Details.totalCTC))}</div>
              <div>₹{fmt(fromAnnual(offer2Details.totalCTC))}</div>
            </div>
          </div>
        )}
        <div className="tool-actions" style={{ marginTop: "1rem" }}>
          <button className="btn-tool btn-reset" onClick={handleOfferReset}>↺ Reset Offers</button>
        </div>
      </div>
    );
  }

  return (
    <section className="tool-section" id="salary">
      <div className="tool-header">
        <div className="tool-tag">💰 Finance</div>
        <h2 className="tool-title">Salary Calculator</h2>
        <p className="tool-desc">
          A detailed salary calculator with tax regime comparison, salary breakup, bonuses, professional tax, and more.
        </p>
      </div>

      <div className="form-grid" style={{ marginBottom: "1rem" }}>
        <div className="form-field">
          <label className="form-label">Input Period</label>
          <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="annual">Annual (₹/year)</option>
            <option value="monthly">Monthly (₹/month)</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Reverse Calculator</label>
          <input
            type="checkbox"
            checked={reverseMode}
            onChange={e => setReverseMode(e.target.checked)}
            style={{ width: "1.2rem", height: "1.2rem" }}
          />{" "}
          <span style={{ fontSize: "0.9rem" }}>Estimate required gross salary for desired net in-hand</span>
        </div>
        <div className="form-field">
          <label className="form-label">Offer Comparison Mode</label>
          <input
            type="checkbox"
            checked={offerComparisonMode}
            onChange={e => setOfferComparisonMode(e.target.checked)}
            style={{ width: "1.2rem", height: "1.2rem" }}
          />{" "}
          <span style={{ fontSize: "0.9rem" }}>Compare two salary offers side-by-side</span>
        </div>
      </div>

      {!offerComparisonMode && !reverseMode && (
        <>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Gross Salary ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 800000"}
                value={grossSalaryInput}
                onChange={e => setGrossSalaryInput(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Variable Pay ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                placeholder="e.g. 100000"
                value={variablePayInput}
                onChange={e => setVariablePayInput(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Joining Bonus (One-time) ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={joiningBonusInput}
                onChange={e => setJoiningBonusInput(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Retention Bonus (One-time) ({period === "monthly" ? "₹/month" : "₹/year"})</label>
              <input
                className="form-input"
                type="number"
                min="0"
                placeholder="e.g. 40000"
                value={retentionBonusInput}
                onChange={e => setRetentionBonusInput(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Basic Salary % ({basicSalaryPercent}%)</label>
              <input
                type="range"
                min="35"
                max="50"
                value={basicSalaryPercent}
                onChange={e => setBasicSalaryPercent(Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Tax Regime</label>
              <select className="form-input" value={regime} onChange={e => setRegime(e.target.value)}>
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Professional Tax State</label>
              <select className="form-input" value={profTaxState} onChange={e => setProfTaxState(e.target.value)}>
                {Object.keys(PROFESSIONAL_TAX_STATES).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {salaryDetails && (
            <>
              <div className="result-main" style={{ marginTop: "1rem" }}>
                <div>
                  <div className="result-main-value">₹{fmt(fromAnnual(salaryDetails.netInHandAnnual))}</div>
                  <div className="result-main-label">{period === "monthly" ? "Monthly In-Hand Salary" : "Annual In-Hand Salary"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>
                    ₹{fmt(fromAnnual(salaryDetails.totalCTC))}
                  </div>
                  <div className="result-main-label">Total CTC</div>
                </div>
              </div>

              {renderSalaryBreakup(salaryDetails)}

              <div className="result-grid" style={{ marginTop: "1rem" }}>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value text-danger" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(salaryDetails.tax))}</span>
                  <span className="result-label">Income Tax</span>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">{fmtPct(salaryDetails.effectiveTaxRate)}</span>
                  <span className="result-label">Effective Tax Rate</span>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">{fmtPct(salaryDetails.marginalTaxRate)}</span>
                  <span className="result-label">Marginal Tax Rate</span>
                </div>
              </div>

              {renderDonutChart()}

              <p className="info-text" style={{ marginTop: "1rem" }}>
                Based on {regime === "new" ? "New" : "Old"} Tax Regime. Includes 4% health & education cess. PF capped at ₹21,600/yr.
              </p>

              <div className="tool-actions">
                <CopyBtn text={copyText} />
                <button className="btn-tool btn-reset" onClick={handleReset}>↺ Reset</button>
                <button className="btn-tool" onClick={handleDownloadPDF} disabled={!jsPDF}>⬇ Download PDF</button>
                <button className="btn-tool" onClick={handleShareResult}>📤 Share Result</button>
              </div>

              {/* Comparison Section */}
              {comparisonDetails && (
                <div style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
                  <h3>Tax Regime Comparison</h3>

                  <div className="result-grid">
                    <div className="result-card">
                      <strong>Old Regime Tax</strong>
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          marginTop: "8px",
                        }}
                      >
                        ₹{fmt(fromAnnual(comparisonDetails.oldRegimeDetails.tax))}
                      </div>
                    </div>

                    <div className="result-card">
                      <strong>New Regime Tax</strong>
                      <div
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 700,
                          marginTop: "8px",
                        }}
                      >
                        ₹{fmt(fromAnnual(comparisonDetails.newRegimeDetails.tax))}
                      </div>
                    </div>
                  </div>

                  <div
                    className="result-card"
                    style={{
                      marginTop: "16px",
                      background: "rgba(34,197,94,.08)",
                      border: "1px solid rgba(34,197,94,.25)",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--success)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      {comparisonDetails.taxDiff > 0 ? (
                        <>
                          ✅ Save ₹{fmt(fromAnnual(comparisonDetails.savings))} with
                          <strong> New Regime</strong>
                        </>
                      ) : comparisonDetails.taxDiff < 0 ? (
                        <>
                          ✅ Save ₹{fmt(fromAnnual(comparisonDetails.savings))} with
                          <strong> Old Regime</strong>
                        </>
                      ) : (
                        <>✅ Both tax regimes result in the same tax.</>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {reverseMode && (
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Desired Net In-hand ({period === "monthly" ? "₹/month" : "₹/year"})</label>
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 800000"}
              value={reverseInput}
              onChange={e => setReverseInput(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Basic Salary % ({basicSalaryPercent}%)</label>
            <input
              type="range"
              min="35"
              max="50"
              value={basicSalaryPercent}
              onChange={e => setBasicSalaryPercent(Number(e.target.value))}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Tax Regime</label>
            <select className="form-input" value={regime} onChange={e => setRegime(e.target.value)}>
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Professional Tax State</label>
            <select className="form-input" value={profTaxState} onChange={e => setProfTaxState(e.target.value)}>
              {Object.keys(PROFESSIONAL_TAX_STATES).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {reverseMode && reverseResult && (
        <>
          <div className="result-main" style={{ marginTop: "1rem" }}>
            <div>
              <div className="result-main-value">₹{fmt(fromAnnual(reverseResult.netInHandAnnual))}</div>
              <div className="result-main-label">{period === "monthly" ? "Monthly Net In-Hand" : "Annual Net In-Hand"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>
                ₹{fmt(fromAnnual(reverseResult.grossSalaryAnnual))}
              </div>
              <div className="result-main-label">Required Gross Salary</div>
            </div>
          </div>

          {renderSalaryBreakup(reverseResult)}

          <div className="result-grid" style={{ marginTop: "1rem" }}>
            <div className="result-card" style={fixedCardStyle}>
              <span className="result-value text-danger" style={{ fontSize: "1.2rem" }}>₹{fmt(fromAnnual(reverseResult.tax))}</span>
              <span className="result-label">Income Tax</span>
            </div>
            <div className="result-card" style={fixedCardStyle}>
              <span className="result-value">₹{fmt(fromAnnual(reverseResult.employeePFAnnual))}</span>
              <span className="result-label">Employee PF</span>
            </div>
            <div className="result-card" style={fixedCardStyle}>
              <span className="result-value">{fmtPct(reverseResult.effectiveTaxRate)}</span>
              <span className="result-label">Effective Tax Rate</span>
            </div>
            <div className="result-card" style={fixedCardStyle}>
              <span className="result-value">{fmtPct(reverseResult.marginalTaxRate)}</span>
              <span className="result-label">Marginal Tax Rate</span>
            </div>
          </div>

          {renderDonutChart()}

          <p className="info-text" style={{ marginTop: "1rem" }}>
            Required gross salary estimated considering salary breakup, PF, gratuity, professional tax, and tax regime.
          </p>

          <div className="tool-actions">
            <CopyBtn text={copyText} />
            <button className="btn-tool btn-reset" onClick={handleReset}>↺ Reset</button>
            <button className="btn-tool" onClick={handleDownloadPDF} disabled={!jsPDF}>⬇ Download PDF</button>
            <button className="btn-tool" onClick={handleShareResult}>📤 Share Result</button>
          </div>
        </>
      )}

      {offerComparisonMode && renderOfferComparisonForm()}
    </section>
  );
}