import { useState, useMemo } from "react";
import CopyBtn from "./CopyBtn";
import { fmt } from "./helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

let jsPDF;
try { jsPDF = require("jspdf").jsPDF; } catch (e) { jsPDF = null; }

// ─── Tax Constants (FY 2025-26 / Budget 2025) ─────────────────────────────────
const NEW_REGIME_SLABS = [
  { min: 0,       max: 400000,   rate: 0    },
  { min: 400000,  max: 800000,   rate: 0.05 },
  { min: 800000,  max: 1200000,  rate: 0.10 },
  { min: 1200000, max: 1600000,  rate: 0.15 },
  { min: 1600000, max: 2000000,  rate: 0.20 },
  { min: 2000000, max: 2400000,  rate: 0.25 },
  { min: 2400000, max: Infinity, rate: 0.30 },
];
const OLD_REGIME_SLABS = [
  { min: 0,       max: 250000,   rate: 0    },
  { min: 250000,  max: 500000,   rate: 0.05 },
  { min: 500000,  max: 1000000,  rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];
const NEW_REGIME_STANDARD_DEDUCTION = 75000;
const OLD_REGIME_STANDARD_DEDUCTION = 50000;
// Section 87A rebate thresholds
const NEW_REBATE_LIMIT = 1200000;  // ₹12L taxable → zero tax (FY 2025-26)
const OLD_REBATE_LIMIT = 500000;   // ₹5L taxable → max ₹12,500 rebate
const OLD_REBATE_MAX   = 12500;
const CESS_RATE        = 0.04;
// EPF
const EPF_WAGE_CEILING_MONTHLY = 15000; // statutory EPF wage ceiling
const EPF_RATE                  = 0.12;
// Gratuity: Payment of Gratuity Act formula = (Basic / 26) × 15 per year ≈ 4.81% of annual basic
const GRATUITY_RATE = 15 / (26 * 12); // monthly accrual as fraction of monthly basic

// ─── Professional Tax (monthly gross salary thresholds → monthly tax) ─────────
// Slabs are approximate; exact figures vary by state gazette notification
const PROFESSIONAL_TAX_STATES = {
  Karnataka:         [{ max: 15000, tax: 0 }, { max: Infinity, tax: 200 }],
  Maharashtra:       [{ max: 7500, tax: 0 }, { max: 10000, tax: 175 }, { max: Infinity, tax: 200 }],
  "West Bengal":     [{ max: 10000, tax: 0 }, { max: 15000, tax: 110 }, { max: 25000, tax: 130 }, { max: 40000, tax: 150 }, { max: Infinity, tax: 200 }],
  "Tamil Nadu":      [{ max: 21000, tax: 0 }, { max: Infinity, tax: 208 }],
  Telangana:         [{ max: 15000, tax: 0 }, { max: Infinity, tax: 200 }],
  "Andhra Pradesh":  [{ max: 15000, tax: 0 }, { max: Infinity, tax: 200 }],
  Kerala:            [{ max: 2000, tax: 0 }, { max: 3000, tax: 20 }, { max: 5000, tax: 30 }, { max: 8000, tax: 50 }, { max: 10000, tax: 75 }, { max: 12000, tax: 100 }, { max: 16000, tax: 125 }, { max: 20000, tax: 160 }, { max: Infinity, tax: 200 }],
  Gujarat:           [{ max: 5999, tax: 0 }, { max: 8999, tax: 80 }, { max: 11999, tax: 150 }, { max: Infinity, tax: 200 }],
  "Madhya Pradesh":  [{ max: 18750, tax: 0 }, { max: Infinity, tax: 208 }],
  Odisha:            [{ max: 13304, tax: 0 }, { max: 25000, tax: 125 }, { max: 40000, tax: 175 }, { max: Infinity, tax: 200 }],
  Assam:             [{ max: 10000, tax: 0 }, { max: 14999, tax: 80 }, { max: Infinity, tax: 208 }],
  Delhi:             [{ max: Infinity, tax: 0 }],
  Rajasthan:         [{ max: Infinity, tax: 0 }],
  "Uttar Pradesh":   [{ max: Infinity, tax: 0 }],
  Haryana:           [{ max: Infinity, tax: 0 }],
  Punjab:            [{ max: Infinity, tax: 0 }],
  Bihar:             [{ max: Infinity, tax: 0 }],
  Other:             [{ max: Infinity, tax: 0 }],
};

const COLORS = {
  netPay:     "#4caf50",
  tax:        "#f44336",
  empPF:      "#2196f3",
  employerPF: "#03a9f4",
  gratuity:   "#ff9800",
  profTax:    "#9c27b0",
};

// ─── Tax Engine ───────────────────────────────────────────────────────────────
function calcSlabTax(income, slabs) {
  let tax = 0;
  for (const s of slabs) {
    if (income > s.min) tax += (Math.min(income, s.max) - s.min) * s.rate;
  }
  return tax;
}

/**
 * New Regime income tax (FY 2025-26).
 * @param {number} incomeAfterPT  Total income minus Professional Tax (Section 16(iii))
 */
export function calculateNewTax(incomeAfterPT) {
  const taxable = Math.max(0, incomeAfterPT - NEW_REGIME_STANDARD_DEDUCTION);
  let tax = calcSlabTax(taxable, NEW_REGIME_SLABS);

  if (taxable <= NEW_REBATE_LIMIT) {
    // Section 87A: full rebate — zero tax for taxable income ≤ ₹12,00,000
    tax = 0;
  } else {
    // Marginal relief: tax cannot exceed income above the rebate threshold
    tax = Math.min(tax, taxable - NEW_REBATE_LIMIT);
  }

  return Math.round(tax * (1 + CESS_RATE));
}

/**
 * Old Regime income tax.
 * @param {number} incomeAfterAllDeductions  Income after HRA, 80C etc. (before std deduction)
 */
export function calculateOldTax(incomeAfterAllDeductions) {
  const taxable = Math.max(0, incomeAfterAllDeductions - OLD_REGIME_STANDARD_DEDUCTION);
  let tax = calcSlabTax(taxable, OLD_REGIME_SLABS);

  // Section 87A: rebate up to ₹12,500 for taxable income ≤ ₹5L
  if (taxable <= OLD_REBATE_LIMIT) tax = Math.max(0, tax - Math.min(tax, OLD_REBATE_MAX));

  return Math.round(tax * (1 + CESS_RATE));
}

/**
 * Marginal tax rate via ₹1 lakh delta on actual tax engine.
 * Accounts for standard deduction, rebate, marginal relief and cess.
 * @param {"new"|"old"} regime
 * @param {number} taxFunctionInput  Same value passed to calculateNewTax / calculateOldTax
 * @returns {number}  Rate as decimal (e.g. 0.312 for 31.2%)
 */
function computeMarginalRate(regime, taxFunctionInput) {
  const DELTA = 100000;
  const t1 = regime === "new" ? calculateNewTax(taxFunctionInput)         : calculateOldTax(taxFunctionInput);
  const t2 = regime === "new" ? calculateNewTax(taxFunctionInput + DELTA) : calculateOldTax(taxFunctionInput + DELTA);
  return Math.max(0, (t2 - t1) / DELTA);
}

/** Clamp to non-negative integer; returns 0 for invalid input. */
function clampNonNegative(val) {
  const n = Math.round(Number(val) || 0);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/** Professional Tax for state given gross monthly salary. */
function calculateProfessionalTax(state, grossMonthly) {
  const slabs = PROFESSIONAL_TAX_STATES[state] ?? PROFESSIONAL_TAX_STATES["Other"];
  for (const s of slabs) {
    if (grossMonthly <= s.max) return s.tax;
  }
  return 0;
}

// ─── Core Payroll Engine ───────────────────────────────────────────────────────
/**
 * Calculate complete salary breakdown, tax and net in-hand.
 *
 * CTC model: Total CTC = Gross Fixed + Variable Pay + Joining + Retention + Employer PF + Est. Gratuity
 * Net In-Hand = Total Employee Income - Income Tax - Employee PF - Professional Tax
 *   (Employer PF and Gratuity are employer costs; employee does not receive them as monthly cash)
 *
 * Donut chart segments sum exactly to Total CTC:
 *   Net In-Hand + Tax + Employee PF + Prof Tax + Employer PF + Gratuity = Total CTC
 *
 * @param {Object} p
 * @param {number}  p.grossSalaryAnnual
 * @param {number}  p.variablePayAnnual
 * @param {number}  p.joiningBonusAnnual
 * @param {number}  p.retentionBonusAnnual
 * @param {number}  p.basicSalaryPercent   35–50
 * @param {string}  p.profTaxState
 * @param {"new"|"old"} p.regime
 * @param {boolean} p.metro                true = Metro (50% HRA), false = Non-Metro (40% HRA)
 * @param {number}  p.monthlyRentPaid      actual rent; 0 = assume full HRA exempt (old regime)
 * @param {Object}  p.oldDedns             old regime deductions { d80C, d80D, homeLoanInterest, lta, nps80CCD }
 */
function calculateSalaryDetails({
  grossSalaryAnnual,
  variablePayAnnual,
  joiningBonusAnnual,
  retentionBonusAnnual,
  basicSalaryPercent,
  profTaxState,
  regime,
  metro        = true,
  monthlyRentPaid = 0,
  oldDedns     = {},
}) {
  // ── Salary structure ──────────────────────────────────────────────────────
  const basicAnnual  = (grossSalaryAnnual * basicSalaryPercent) / 100;
  const hraPct       = metro ? 0.50 : 0.40;
  const hraAnnual    = basicAnnual * hraPct;
  const specialAllowanceAnnual = Math.max(0, grossSalaryAnnual - basicAnnual - hraAnnual);

  // ── EPF (statutory EPF wage ceiling: ₹15,000/month) ──────────────────────
  const epfBase          = Math.min(basicAnnual / 12, EPF_WAGE_CEILING_MONTHLY) * 12;
  const employerPFAnnual = Math.round(epfBase * EPF_RATE);
  const employeePFAnnual = Math.round(epfBase * EPF_RATE);

  // ── Gratuity (estimated annual accrual per Payment of Gratuity Act) ───────
  const gratuityAnnual = Math.round((basicAnnual / 12) * GRATUITY_RATE * 12);

  // ── Professional Tax (Section 16(iii) — deductible in BOTH regimes) ───────
  const profTaxMonthly = calculateProfessionalTax(profTaxState, grossSalaryAnnual / 12);
  const profTaxAnnual  = profTaxMonthly * 12;

  // ── Income totals ─────────────────────────────────────────────────────────
  const totalEmployeeIncome = grossSalaryAnnual + variablePayAnnual + joiningBonusAnnual + retentionBonusAnnual;
  const totalCTC             = totalEmployeeIncome + employerPFAnnual + gratuityAnnual;

  // ── Taxable income ────────────────────────────────────────────────────────
  // PT is deductible under Section 16(iii) in both regimes
  const incomeAfterPT = Math.max(0, totalEmployeeIncome - profTaxAnnual);

  let taxFunctionInput;      // income passed to the tax engine (before standard deduction)
  let taxableIncomeDisplay;  // for display: after all deductions incl. standard deduction

  if (regime === "new") {
    // New Regime: only Professional Tax is deductible beyond the standard deduction.
    // Employee PF (80C) is NOT deductible; HRA exemption, 80D etc. are NOT available.
    taxFunctionInput     = incomeAfterPT;
    taxableIncomeDisplay = Math.max(0, taxFunctionInput - NEW_REGIME_STANDARD_DEDUCTION);
  } else {
    // Old Regime: PT + HRA exemption + 80C + 80D + Home Loan + LTA + NPS
    const rentAnnual = clampNonNegative(monthlyRentPaid) * 12;

    // Section 10(13A) HRA exemption: minimum of three limits
    const limit1HRA   = hraAnnual;                                         // actual HRA received
    const limit2Rent  = rentAnnual > 0
      ? Math.max(0, rentAnnual - basicAnnual * 0.10)                      // rent paid − 10% of basic
      : hraAnnual;                                                          // no rent entered: assume full HRA exempt
    const limit3Basic = basicAnnual * hraPct;                              // metro/non-metro % of basic
    const hraExempt   = Math.min(limit1HRA, limit2Rent, limit3Basic);

    // Section 80C: employee EPF auto-included + user's additional, capped at ₹1.5L
    const d80C    = clampNonNegative(oldDedns.d80C);
    const total80C = Math.min(employeePFAnnual + d80C, 150000);

    // Section 80D: health insurance premiums
    const total80D = Math.min(clampNonNegative(oldDedns.d80D), 100000);

    // Section 24(b): home loan interest on self-occupied property, cap ₹2L
    const homeLoanDedn = Math.min(clampNonNegative(oldDedns.homeLoanInterest), 200000);

    // LTA exemption
    const ltaDedn = clampNonNegative(oldDedns.lta);

    // Section 80CCD(1B): additional NPS (over 80C), cap ₹50K
    const npsDedn = Math.min(clampNonNegative(oldDedns.nps80CCD), 50000);

    const totalOldDeductions = hraExempt + total80C + total80D + homeLoanDedn + ltaDedn + npsDedn;
    taxFunctionInput         = Math.max(0, incomeAfterPT - totalOldDeductions);
    taxableIncomeDisplay     = Math.max(0, taxFunctionInput - OLD_REGIME_STANDARD_DEDUCTION);
  }

  const tax = regime === "new" ? calculateNewTax(taxFunctionInput) : calculateOldTax(taxFunctionInput);

  // ── Derived metrics ───────────────────────────────────────────────────────
  const effectiveTaxRate = totalEmployeeIncome > 0 ? tax / totalEmployeeIncome : 0;
  const marginalTaxRate  = computeMarginalRate(regime, taxFunctionInput);

  // Net in-hand: cash received by employee annually
  // Employer PF and Gratuity are employer-side costs not received as monthly salary
  const netInHandAnnual = totalEmployeeIncome - tax - employeePFAnnual - profTaxAnnual;

  return {
    basicAnnual, hraAnnual, specialAllowanceAnnual,
    employerPFAnnual, employeePFAnnual, gratuityAnnual,
    profTaxMonthly, profTaxAnnual,
    variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual,
    grossSalaryAnnual, totalEmployeeIncome, totalCTC,
    taxableIncome: taxableIncomeDisplay,
    tax, effectiveTaxRate, marginalTaxRate,
    netInHandAnnual,
  };
}

function fmtPct(val) {
  if (!Number.isFinite(val)) return "0.00%";
  return (val * 100).toFixed(2) + "%";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SalaryCalc() {
  // ── Existing input state (preserved) ──────────────────────────────────────
  const [grossSalaryInput,    setGrossSalaryInput]    = useState("");
  const [variablePayInput,    setVariablePayInput]    = useState("");
  const [joiningBonusInput,   setJoiningBonusInput]   = useState("");
  const [retentionBonusInput, setRetentionBonusInput] = useState("");
  const [basicSalaryPercent,  setBasicSalaryPercent]  = useState(40);
  const [regime,              setRegime]              = useState("new");
  const [period,              setPeriod]              = useState("annual");
  const [profTaxState,        setProfTaxState]        = useState("Karnataka");
  const [reverseMode,         setReverseMode]         = useState(false);
  const [reverseInput,        setReverseInput]        = useState("");
  const [offerComparisonMode, setOfferComparisonMode] = useState(false);

  // ── New state: HRA configuration, old regime deductions ───────────────────
  const [metro,          setMetro]          = useState(true);
  const [monthlyRentPaid, setMonthlyRentPaid] = useState("");
  const [showOldDedns,   setShowOldDedns]   = useState(false);
  const [oldDedns,       setOldDedns]       = useState({ d80C: 0, d80D: 0, homeLoanInterest: 0, lta: 0, nps80CCD: 0 });

  // ── Offer comparison (updated with metro field) ────────────────────────────
  const [offer1, setOffer1] = useState({ grossSalaryInput: "", variablePayInput: "", joiningBonusInput: "", retentionBonusInput: "", basicSalaryPercent: 40, regime: "new", profTaxState: "Karnataka", metro: true });
  const [offer2, setOffer2] = useState({ grossSalaryInput: "", variablePayInput: "", joiningBonusInput: "", retentionBonusInput: "", basicSalaryPercent: 40, regime: "new", profTaxState: "Karnataka", metro: true });

  function toAnnual(val)   { return period === "monthly" ? val * 12 : val; }
  function fromAnnual(val) { return period === "monthly" ? val / 12 : val; }

  const grossSalaryAnnual    = toAnnual(clampNonNegative(grossSalaryInput));
  const variablePayAnnual    = toAnnual(clampNonNegative(variablePayInput));
  const joiningBonusAnnual   = toAnnual(clampNonNegative(joiningBonusInput));
  const retentionBonusAnnual = toAnnual(clampNonNegative(retentionBonusInput));

  // ── Memoized calculations ──────────────────────────────────────────────────
  const salaryDetails = useMemo(() => {
    if (!grossSalaryAnnual && !variablePayAnnual && !joiningBonusAnnual && !retentionBonusAnnual) return null;
    return calculateSalaryDetails({ grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, regime, metro, monthlyRentPaid: clampNonNegative(monthlyRentPaid), oldDedns });
  }, [grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, regime, metro, monthlyRentPaid, oldDedns]);

  const comparisonDetails = useMemo(() => {
    if (!grossSalaryAnnual && !variablePayAnnual && !joiningBonusAnnual && !retentionBonusAnnual) return null;
    const newD = calculateSalaryDetails({ grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, regime: "new", metro, monthlyRentPaid: clampNonNegative(monthlyRentPaid), oldDedns });
    const oldD = calculateSalaryDetails({ grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, regime: "old", metro, monthlyRentPaid: clampNonNegative(monthlyRentPaid), oldDedns });
    const taxDiff = oldD.tax - newD.tax;
    return { newRegimeDetails: newD, oldRegimeDetails: oldD, taxDiff, savings: Math.abs(taxDiff) };
  }, [grossSalaryAnnual, variablePayAnnual, joiningBonusAnnual, retentionBonusAnnual, basicSalaryPercent, profTaxState, metro, monthlyRentPaid, oldDedns]);

  const reverseAnnualDesired = toAnnual(clampNonNegative(reverseInput));
  const reverseResult = useMemo(() => {
    if (!reverseMode || !reverseAnnualDesired) return null;
    let lo = 0, hi = 1e8, best = null;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const d = calculateSalaryDetails({ grossSalaryAnnual: mid, variablePayAnnual: 0, joiningBonusAnnual: 0, retentionBonusAnnual: 0, basicSalaryPercent, profTaxState, regime, metro, monthlyRentPaid: clampNonNegative(monthlyRentPaid), oldDedns });
      if (d.netInHandAnnual >= reverseAnnualDesired) { hi = mid; best = d; } else lo = mid;
    }
    return best;
  }, [reverseMode, reverseAnnualDesired, basicSalaryPercent, profTaxState, regime, metro, monthlyRentPaid, oldDedns]);

  const offer1Details = useMemo(() => {
    const g = toAnnual(clampNonNegative(offer1.grossSalaryInput)), v = toAnnual(clampNonNegative(offer1.variablePayInput));
    const j = toAnnual(clampNonNegative(offer1.joiningBonusInput)), r = toAnnual(clampNonNegative(offer1.retentionBonusInput));
    if (!g && !v && !j && !r) return null;
    return calculateSalaryDetails({ grossSalaryAnnual: g, variablePayAnnual: v, joiningBonusAnnual: j, retentionBonusAnnual: r, basicSalaryPercent: offer1.basicSalaryPercent, profTaxState: offer1.profTaxState, regime: offer1.regime, metro: offer1.metro, monthlyRentPaid: 0, oldDedns: {} });
  }, [offer1, period]);

  const offer2Details = useMemo(() => {
    const g = toAnnual(clampNonNegative(offer2.grossSalaryInput)), v = toAnnual(clampNonNegative(offer2.variablePayInput));
    const j = toAnnual(clampNonNegative(offer2.joiningBonusInput)), r = toAnnual(clampNonNegative(offer2.retentionBonusInput));
    if (!g && !v && !j && !r) return null;
    return calculateSalaryDetails({ grossSalaryAnnual: g, variablePayAnnual: v, joiningBonusAnnual: j, retentionBonusAnnual: r, basicSalaryPercent: offer2.basicSalaryPercent, profTaxState: offer2.profTaxState, regime: offer2.regime, metro: offer2.metro, monthlyRentPaid: 0, oldDedns: {} });
  }, [offer2, period]);

  // ── Copy / Share ───────────────────────────────────────────────────────────
  const activeDetails = reverseMode ? reverseResult : salaryDetails;
  const copyText = activeDetails
    ? `Regime: ${regime === "new" ? "New" : "Old"} | Net In-Hand: ${period === "monthly" ? `\u20B9${fmt(activeDetails.netInHandAnnual / 12)}/mo` : `\u20B9${fmt(activeDetails.netInHandAnnual)}/yr`} | Tax: \u20B9${fmt(activeDetails.tax)} | Employee PF: \u20B9${fmt(activeDetails.employeePFAnnual)} | Total CTC: \u20B9${fmt(activeDetails.totalCTC)}`
    : "";

  const handleShareResult = () => {
    if (!activeDetails) return;
    if (navigator.share) {
      navigator.share({ title: "Salary Calculator Result", text: copyText }).catch(() => { navigator.clipboard.writeText(copyText); });
    } else { navigator.clipboard.writeText(copyText); alert("Result copied to clipboard"); }
  };

  // ── PDF Export ─────────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    if (!jsPDF || !salaryDetails) return;
    const doc = new jsPDF();
    const fv  = v => `\u20B9${fromAnnual(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    let y = 14;
    const line = (lbl, val, indent = 0) => { doc.text(lbl, 14 + indent, y); doc.text(String(val), 195, y, { align: "right" }); y += 7; };
    const sep  = () => { doc.setDrawColor(200); doc.line(14, y - 1, 196, y - 1); y += 2; };

    doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("Salary Breakdown", 105, y, { align: "center" }); y += 10;
    doc.setFontSize(9);  doc.setFont("helvetica", "normal");
    doc.text(`Tax Regime: ${regime === "new" ? "New (FY 2025-26)" : "Old Regime"}  |  Period: ${period}  |  City: ${metro ? "Metro" : "Non-Metro"}  |  State (PT): ${profTaxState}  |  Basic: ${basicSalaryPercent}%`, 14, y); y += 9; sep();

    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("EARNINGS", 14, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    line("Gross Fixed Salary",           fv(salaryDetails.grossSalaryAnnual));
    line("  Basic Salary",               fv(salaryDetails.basicAnnual),              4);
    line("  HRA",                        fv(salaryDetails.hraAnnual),                4);
    line("  Special Allowance",          fv(salaryDetails.specialAllowanceAnnual),   4);
    if (salaryDetails.variablePayAnnual)    line("Variable Pay",    fv(salaryDetails.variablePayAnnual));
    if (salaryDetails.joiningBonusAnnual)   line("Joining Bonus",   fv(salaryDetails.joiningBonusAnnual));
    if (salaryDetails.retentionBonusAnnual) line("Retention Bonus", fv(salaryDetails.retentionBonusAnnual));
    y += 2; sep();

    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("EMPLOYER CONTRIBUTIONS", 14, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    line("Employer PF",     fv(salaryDetails.employerPFAnnual));
    line("Est. Gratuity",   fv(salaryDetails.gratuityAnnual));
    y += 2; sep();

    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("DEDUCTIONS", 14, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    line("Employee PF",                  fv(salaryDetails.employeePFAnnual));
    if (salaryDetails.profTaxAnnual > 0) line("Professional Tax", fv(salaryDetails.profTaxAnnual));
    line("Income Tax (incl. 4% cess)",   fv(salaryDetails.tax));
    y += 2; sep();

    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text("SUMMARY", 14, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    line("Taxable Income",               fv(salaryDetails.taxableIncome));
    line("Total CTC",                    fv(salaryDetails.totalCTC));
    line("Net In-Hand (Annual)",         fv(salaryDetails.netInHandAnnual));
    line("Net In-Hand (Monthly)",        `\u20B9${(salaryDetails.netInHandAnnual / 12).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
    line("Effective Tax Rate",           fmtPct(salaryDetails.effectiveTaxRate));
    line("Marginal Tax Rate",            fmtPct(salaryDetails.marginalTaxRate));
    y += 6;
    doc.setFontSize(8); doc.setFont("helvetica", "italic");
    doc.text("Gratuity is estimated (~4.81% of basic, per Payment of Gratuity Act). PT slabs are approximate. FY 2025-26 tax rules applied. Consult a CA for official computation.", 14, y, { maxWidth: 182 });
    doc.save("salary_breakdown.pdf");
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  function handleReset() {
    setGrossSalaryInput(""); setVariablePayInput(""); setJoiningBonusInput(""); setRetentionBonusInput("");
    setBasicSalaryPercent(40); setProfTaxState("Karnataka"); setMetro(true);
    setMonthlyRentPaid(""); setOldDedns({ d80C: 0, d80D: 0, homeLoanInterest: 0, lta: 0, nps80CCD: 0 });
    setShowOldDedns(false); setReverseInput(""); setReverseMode(false); setRegime("new");
  }

  function handleOfferReset() {
    const blank = { grossSalaryInput: "", variablePayInput: "", joiningBonusInput: "", retentionBonusInput: "", basicSalaryPercent: 40, regime: "new", profTaxState: "Karnataka", metro: true };
    setOffer1(blank); setOffer2(blank);
  }

  // ── Render helpers ─────────────────────────────────────────────────────────
  const fixedCardStyle = { minHeight: "120px" };

  function renderSalaryBreakup(details) {
    if (!details) return null;
    const greenBg   = { background: "rgba(34,197,94,0.08)",  border: "1px solid rgba(34,197,94,0.15)",  ...fixedCardStyle };
    const blueBg    = { background: "rgba(33,150,243,0.08)", border: "1px solid rgba(33,150,243,0.15)", ...fixedCardStyle };
    const redBg     = { background: "rgba(244,67,54,0.08)",  border: "1px solid rgba(244,67,54,0.15)",  ...fixedCardStyle };
    const summaryBg = { background: "linear-gradient(90deg, #166534 80%, #22c55e 100%)", color: "#fff", borderRadius: "12px", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "1.15rem", boxShadow: "0 2px 8px 0 rgba(34,197,94,0.12)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...fixedCardStyle };
    const fv = v => `\u20B9${fmt(fromAnnual(v))}`;
    const hraPctLabel = metro ? "50%" : "40%";
    const cityLabel   = metro ? "Metro" : "Non-Metro";

    return (
      <div style={{ marginTop: "1rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Salary Breakup</h3>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>&#x1F4BC; Earnings</div>
          <div className="result-grid">
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.grossSalaryAnnual)}</span>
              <span className="result-label">Gross Fixed Salary</span>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.basicAnnual)}</span>
              <span className="result-label">Basic Salary</span>
              <small style={{ color: "#666" }}>{basicSalaryPercent}% of Gross</small>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.hraAnnual)}</span>
              <span className="result-label">HRA</span>
              <small style={{ color: "#666" }}>{hraPctLabel} of Basic ({cityLabel})</small>
            </div>
            <div className="result-card" style={greenBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.specialAllowanceAnnual)}</span>
              <span className="result-label">Special Allowance</span>
              <small style={{ color: "#666" }}>Gross &minus; Basic &minus; HRA</small>
            </div>
            {details.variablePayAnnual > 0 && (
              <div className="result-card" style={greenBg}>
                <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.variablePayAnnual)}</span>
                <span className="result-label">Variable Pay</span>
              </div>
            )}
            {details.joiningBonusAnnual > 0 && (
              <div className="result-card" style={greenBg}>
                <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.joiningBonusAnnual)}</span>
                <span className="result-label">Joining Bonus</span>
              </div>
            )}
            {details.retentionBonusAnnual > 0 && (
              <div className="result-card" style={greenBg}>
                <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.retentionBonusAnnual)}</span>
                <span className="result-label">Retention Bonus</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>&#x1F9FE; Employer Contributions</div>
          <div className="result-grid">
            <div className="result-card" style={blueBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.employerPFAnnual)}</span>
              <span className="result-label">Employer PF</span>
              <small style={{ color: "#666" }}>12% of Basic (EPF ceiling &#x20B9;15K/mo)</small>
            </div>
            <div className="result-card" style={blueBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.gratuityAnnual)}</span>
              <span className="result-label">Est. Gratuity</span>
              <small style={{ color: "#666" }}>~4.81% of Basic (accrued, paid at exit)</small>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>&#x2796; Deductions</div>
          <div className="result-grid">
            <div className="result-card" style={redBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.employeePFAnnual)}</span>
              <span className="result-label">Employee PF</span>
              <small style={{ color: "#666" }}>12% of Basic (EPF ceiling applied)</small>
            </div>
            {details.profTaxAnnual > 0 && (
              <div className="result-card" style={redBg}>
                <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.profTaxAnnual)}</span>
                <span className="result-label">Professional Tax</span>
                <small style={{ color: "#666" }}>Section 16(iii) &mdash; state levy</small>
              </div>
            )}
            <div className="result-card" style={redBg}>
              <span className="result-value" style={{ fontSize: "1.2rem" }}>{fv(details.tax)}</span>
              <span className="result-label">Income Tax</span>
              <small style={{ color: "#666" }}>Incl. 4% cess</small>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>&#x1F4B0; Final Summary</div>
          <div className="result-grid">
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>{fv(details.totalCTC)}</span>
              <span style={{ marginTop: "0.4rem" }}>Total CTC</span>
            </div>
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>{fv(details.netInHandAnnual)}</span>
              <span style={{ marginTop: "0.4rem" }}>Annual In-Hand</span>
            </div>
            <div className="result-card" style={summaryBg}>
              <span style={{ fontSize: "1.35rem" }}>\u20B9{fmt(details.netInHandAnnual / 12)}</span>
              <span style={{ marginTop: "0.4rem" }}>Monthly In-Hand</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Donut chart — segments sum exactly to Total CTC ────────────────────────
  // Proof: Net + Tax + EmpPF + PT + EmployerPF + Gratuity
  //      = (TotalIncome - Tax - EmpPF - PT) + Tax + EmpPF + PT + EmployerPF + Gratuity
  //      = TotalIncome + EmployerPF + Gratuity = Total CTC
  function renderDonutChart(details) {
    if (!details) return null;
    const data = [
      { name: "Net In-Hand",   value: Math.max(0, details.netInHandAnnual), color: COLORS.netPay     },
      { name: "Income Tax",    value: details.tax,                          color: COLORS.tax        },
      { name: "Employee PF",   value: details.employeePFAnnual,             color: COLORS.empPF      },
      { name: "Employer PF",   value: details.employerPFAnnual,             color: COLORS.employerPF },
      { name: "Est. Gratuity", value: details.gratuityAnnual,               color: COLORS.gratuity   },
      ...(details.profTaxAnnual > 0 ? [{ name: "Prof. Tax", value: details.profTaxAnnual, color: COLORS.profTax }] : []),
    ].filter(d => d.value > 0);
    if (!data.length) return null;
    return (
      <div style={{ width: "100%", height: 320, marginTop: "1rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 0.5rem", textAlign: "center" }}>
          All segments sum to Total CTC (\u20B9{fmt(fromAnnual(details.totalCTC))})
        </p>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%" paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip formatter={v => `\u20B9${fmt(fromAnnual(v))}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ── Offer comparison ───────────────────────────────────────────────────────
  function renderOfferComparisonForm() {
    const periodLabel = period === "monthly" ? "\u20B9/month" : "\u20B9/year";
    const stateOpts   = Object.keys(PROFESSIONAL_TAX_STATES);

    function offerFields(offer, setOffer, title) {
      return (
        <div>
          <h4>{title}</h4>
          {[["Gross Salary", "grossSalaryInput"], ["Variable Pay", "variablePayInput"], ["Joining Bonus", "joiningBonusInput"], ["Retention Bonus", "retentionBonusInput"]].map(([lbl, key]) => (
            <div className="form-field" key={key}>
              <label className="form-label">{lbl} ({periodLabel})</label>
              <input className="form-input" type="number" min="0" value={offer[key]}
                onChange={e => setOffer(p => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 0" />
            </div>
          ))}
          <div className="form-field">
            <label className="form-label">Basic Salary % ({offer.basicSalaryPercent}%)</label>
            <input type="range" min="35" max="50" value={offer.basicSalaryPercent}
              onChange={e => setOffer(p => ({ ...p, basicSalaryPercent: Number(e.target.value) }))} />
          </div>
          <div className="form-field">
            <label className="form-label">Tax Regime</label>
            <select className="form-input" value={offer.regime} onChange={e => setOffer(p => ({ ...p, regime: e.target.value }))}>
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">City Type (HRA)</label>
            <select className="form-input" value={offer.metro ? "metro" : "nonmetro"} onChange={e => setOffer(p => ({ ...p, metro: e.target.value === "metro" }))}>
              <option value="metro">Metro (50% HRA)</option>
              <option value="nonmetro">Non-Metro (40% HRA)</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Professional Tax State</label>
            <select className="form-input" value={offer.profTaxState} onChange={e => setOffer(p => ({ ...p, profTaxState: e.target.value }))}>
              {stateOpts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3>Offer Comparison</h3>
        <div className="form-grid">
          {offerFields(offer1, setOffer1, "Offer 1")}
          {offerFields(offer2, setOffer2, "Offer 2")}
        </div>
        {offer1Details && offer2Details && (() => {
          const d1 = offer1Details, d2 = offer2Details;
          const rows = [
            { label: "Net In-Hand",    v1: d1.netInHandAnnual,  v2: d2.netInHandAnnual,  higherBetter: true  },
            { label: "Income Tax",     v1: d1.tax,              v2: d2.tax,              higherBetter: false },
            { label: "Total CTC",      v1: d1.totalCTC,         v2: d2.totalCTC,         higherBetter: true  },
            { label: "Effective Rate", v1: d1.effectiveTaxRate, v2: d2.effectiveTaxRate, higherBetter: false, pct: true },
          ];
          const winner = d1.netInHandAnnual >= d2.netInHandAnnual ? "Offer 1" : "Offer 2";
          const diff   = Math.abs(d1.netInHandAnnual - d2.netInHandAnnual);
          return (
            <>
              <div className="result-grid" style={{ marginTop: "1rem" }}>
                {rows.map((row, i) => {
                  const o1better = row.higherBetter ? row.v1 >= row.v2 : row.v1 <= row.v2;
                  return (
                    <div key={i} className="result-card" style={{ minHeight: "80px" }}>
                      <strong>{row.label}</strong>
                      <div style={{ marginTop: 6 }}>
                        <span style={{ color: o1better ? "var(--success)" : undefined, marginRight: 8 }}>
                          O1: {row.pct ? fmtPct(row.v1) : `\u20B9${fmt(fromAnnual(row.v1))}`}
                        </span>
                        <span style={{ color: !o1better ? "var(--success)" : undefined }}>
                          O2: {row.pct ? fmtPct(row.v2) : `\u20B9${fmt(fromAnnual(row.v2))}`}
                        </span>
                      </div>
                      <small>{o1better ? "Offer 1 better" : "Offer 2 better"}</small>
                    </div>
                  );
                })}
              </div>
              <div className="result-card" style={{ marginTop: "1rem", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)" }}>
                <div style={{ color: "var(--success)", fontWeight: 700, fontSize: "1.1rem" }}>
                  &#x1F3C6; {winner} gives \u20B9{fmt(fromAnnual(diff))} higher net in-hand
                </div>
              </div>
            </>
          );
        })()}
        <div className="tool-actions" style={{ marginTop: "1rem" }}>
          <button className="btn-tool btn-reset" onClick={handleOfferReset}>&#x21BA; Reset Offers</button>
        </div>
      </div>
    );
  }

  // ── Tax Regime Comparison Table ────────────────────────────────────────────
  // Used in Old vs New Tax Regime comparison
  const TAX_REGIME_TABLE = [
    { feature: "Tax Slabs", old: "Same slabs across India (Old Regime)", newR: "Same slabs across India (New Regime)" },
    { feature: "Professional Tax", old: "Varies by state", newR: "Varies by state" },
    {
      feature: "PF Calculation",
      old: "12% of Basic Salary (EPF wage ceiling ₹15,000/month applies)",
      newR: "12% of Basic Salary (EPF wage ceiling ₹15,000/month applies)"
    },
    { feature: "Best suited for", old: "High deductions (>₹3.5L)", newR: "Simple structure / fewer deductions" },
    // ... (add more rows as needed)
  ];

  const periodLabel  = period === "monthly" ? "\u20B9/month" : "\u20B9/year";
  const stateOptions = Object.keys(PROFESSIONAL_TAX_STATES);

  return (
    <section className="tool-section" id="salary">
      <div className="tool-header">
        <div className="tool-tag">&#x1F4B0; Finance</div>
        <h2 className="tool-title">Salary Calculator</h2>
        <p className="tool-desc">Accurate Indian salary calculator &mdash; CTC breakdown, Old vs New Regime, HRA, professional tax, PF &amp; more (FY 2025-26).</p>
      </div>

      {/* Mode + Period Row */}
      <div className="form-grid" style={{ marginBottom: "1rem" }}>
        <div className="form-field">
          <label className="form-label">Input Period</label>
          <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="annual">Annual (\u20B9/year)</option>
            <option value="monthly">Monthly (\u20B9/month)</option>
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Reverse Calculator</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input type="checkbox" checked={reverseMode} onChange={e => setReverseMode(e.target.checked)} style={{ width: "1.2rem", height: "1.2rem" }} />
            <span style={{ fontSize: "0.9rem" }}>Estimate gross salary from desired net in-hand</span>
          </label>
        </div>
        <div className="form-field">
          <label className="form-label">Offer Comparison Mode</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
            <input type="checkbox" checked={offerComparisonMode} onChange={e => setOfferComparisonMode(e.target.checked)} style={{ width: "1.2rem", height: "1.2rem" }} />
            <span style={{ fontSize: "0.9rem" }}>Compare two salary offers side-by-side</span>
          </label>
        </div>
      </div>

      {/* Main Calculator */}
      {!offerComparisonMode && !reverseMode && (
        <>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Gross Fixed Salary ({periodLabel})</label>
              <input className="form-input" type="number" min="0"
                placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 720000"}
                value={grossSalaryInput} onChange={e => setGrossSalaryInput(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Variable Pay ({periodLabel})</label>
              <input className="form-input" type="number" min="0"
                placeholder="e.g. 100000" value={variablePayInput} onChange={e => setVariablePayInput(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Joining Bonus ({periodLabel})</label>
              <input className="form-input" type="number" min="0"
                placeholder="e.g. 50000" value={joiningBonusInput} onChange={e => setJoiningBonusInput(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Retention Bonus ({periodLabel})</label>
              <input className="form-input" type="number" min="0"
                placeholder="e.g. 40000" value={retentionBonusInput} onChange={e => setRetentionBonusInput(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Basic Salary % ({basicSalaryPercent}%)</label>
              <input type="range" min="35" max="50" value={basicSalaryPercent}
                onChange={e => setBasicSalaryPercent(Number(e.target.value))} />
            </div>
            <div className="form-field">
              <label className="form-label">Tax Regime</label>
              <select className="form-input" value={regime} onChange={e => setRegime(e.target.value)}>
                <option value="new">New Regime (FY 2025-26)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">City Type (HRA)</label>
              <select className="form-input" value={metro ? "metro" : "nonmetro"} onChange={e => setMetro(e.target.value === "metro")}>
                <option value="metro">Metro City (50% HRA)</option>
                <option value="nonmetro">Non-Metro City (40% HRA)</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Professional Tax State</label>
              <select className="form-input" value={profTaxState} onChange={e => setProfTaxState(e.target.value)}>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Old Regime Deductions */}
          {regime === "old" && (
            <div style={{ marginTop: "0.75rem" }}>
              <button onClick={() => setShowOldDedns(v => !v)}
                style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", padding: "5px 12px" }}>
                {showOldDedns ? "\u25B2 Hide" : "\u25BC Show"} Old Regime Deductions (80C, 80D, HRA, Home Loan, LTA, NPS)
              </button>
              {showOldDedns && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem", marginTop: "0.5rem" }}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label">Monthly Rent Paid (\u20B9) &mdash; for HRA exemption</label>
                      <input className="form-input" type="number" min="0" placeholder="e.g. 25000 (blank = full HRA exempt)"
                        value={monthlyRentPaid} onChange={e => setMonthlyRentPaid(e.target.value)} />
                      <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Leave blank to assume full HRA exemption. Enter actual rent for Section 10(13A) calculation.</small>
                    </div>
                    <div className="form-field">
                      <label className="form-label">80C Investments (\u20B9) &mdash; max \u20B91,50,000</label>
                      <input className="form-input" type="number" min="0" max="150000"
                        placeholder="e.g. 100000 (PPF, ELSS, LIC — EPF auto-included)"
                        value={oldDedns.d80C || ""}
                        onChange={e => setOldDedns(d => ({ ...d, d80C: clampNonNegative(e.target.value) }))} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">80D Medical Insurance (\u20B9)</label>
                      <input className="form-input" type="number" min="0"
                        placeholder="e.g. 25000 (self) + 50000 (senior parents)"
                        value={oldDedns.d80D || ""}
                        onChange={e => setOldDedns(d => ({ ...d, d80D: clampNonNegative(e.target.value) }))} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Home Loan Interest/yr (\u20B9) &mdash; max \u20B92,00,000</label>
                      <input className="form-input" type="number" min="0"
                        placeholder="e.g. 200000 (Section 24b, self-occupied)"
                        value={oldDedns.homeLoanInterest || ""}
                        onChange={e => setOldDedns(d => ({ ...d, homeLoanInterest: clampNonNegative(e.target.value) }))} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">LTA (Leave Travel Allowance) (\u20B9)</label>
                      <input className="form-input" type="number" min="0"
                        placeholder="e.g. 40000 (annual equivalent)"
                        value={oldDedns.lta || ""}
                        onChange={e => setOldDedns(d => ({ ...d, lta: clampNonNegative(e.target.value) }))} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">NPS 80CCD(1B) (\u20B9) &mdash; max \u20B950,000</label>
                      <input className="form-input" type="number" min="0" max="50000"
                        placeholder="e.g. 50000 (over and above 80C)"
                        value={oldDedns.nps80CCD || ""}
                        onChange={e => setOldDedns(d => ({ ...d, nps80CCD: clampNonNegative(e.target.value) }))} />
                    </div>
                  </div>
                  <p className="info-text">Employee PF auto-included in 80C (total capped at \u20B91.5L). Standard deduction \u20B950,000 applied automatically.</p>
                </div>
              )}
            </div>
          )}

          {salaryDetails && (
            <>
              <div className="result-main" style={{ marginTop: "1rem" }}>
                <div>
                  <div className="result-main-value">\u20B9{fmt(fromAnnual(salaryDetails.netInHandAnnual))}</div>
                  <div className="result-main-label">{period === "monthly" ? "Monthly" : "Annual"} Net In-Hand</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>
                    \u20B9{fmt(fromAnnual(salaryDetails.totalCTC))}
                  </div>
                  <div className="result-main-label">Total CTC</div>
                </div>
              </div>

              {renderSalaryBreakup(salaryDetails)}

              <div className="result-grid" style={{ marginTop: "1rem" }}>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value text-danger" style={{ fontSize: "1.2rem" }}>\u20B9{fmt(fromAnnual(salaryDetails.tax))}</span>
                  <span className="result-label">Income Tax</span>
                  <small style={{ color: "#666" }}>Incl. 4% cess</small>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">{fmtPct(salaryDetails.effectiveTaxRate)}</span>
                  <span className="result-label">Effective Tax Rate</span>
                  <small style={{ color: "#666" }}>Tax &divide; Total Income</small>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">{fmtPct(salaryDetails.marginalTaxRate)}</span>
                  <span className="result-label">Marginal Tax Rate</span>
                  <small style={{ color: "#666" }}>On next \u20B91 lakh</small>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">\u20B9{fmt(fromAnnual(salaryDetails.taxableIncome))}</span>
                  <span className="result-label">Taxable Income</span>
                  <small style={{ color: "#666" }}>After all deductions</small>
                </div>
              </div>

              {renderDonutChart(salaryDetails)}

              <p className="info-text" style={{ marginTop: "1rem" }}>
                {regime === "new"
                  ? "New Regime (FY 2025-26): Std. deduction \u20B975,000. Zero tax for taxable income \u226412L (Sec. 87A). Slabs: 5%/10%/15%/20%/25%/30%."
                  : "Old Regime: Std. deduction \u20B950,000. 87A rebate up to \u20B912,500 for taxable \u22645L. HRA, 80C, 80D and other deductions applied."
                }{" "}EPF capped at \u20B915K/mo basic wage ceiling. Gratuity is estimated (4.81% of annual basic, accrued, paid at exit after 5 years). PT: {profTaxState} (\u20B9{salaryDetails.profTaxMonthly}/month).
              </p>

              <div className="tool-actions">
                <CopyBtn text={copyText} />
                <button className="btn-tool btn-reset" onClick={handleReset}>&#x21BA; Reset</button>
                <button className="btn-tool" onClick={handleDownloadPDF} disabled={!jsPDF}>&#x2B07; Download PDF</button>
                <button className="btn-tool" onClick={handleShareResult}>&#x1F4E4; Share Result</button>
              </div>

              {comparisonDetails && (
                <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  <h3>Tax Regime Comparison</h3>
                  <div className="result-grid">
                    <div className="result-card">
                      <strong>New Regime Tax</strong>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "8px" }}>
                        \u20B9{fmt(fromAnnual(comparisonDetails.newRegimeDetails.tax))}
                      </div>
                      <small>Net in-hand: \u20B9{fmt(fromAnnual(comparisonDetails.newRegimeDetails.netInHandAnnual))}</small>
                    </div>
                    <div className="result-card">
                      <strong>Old Regime Tax</strong>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "8px" }}>
                        \u20B9{fmt(fromAnnual(comparisonDetails.oldRegimeDetails.tax))}
                      </div>
                      <small>Net in-hand: \u20B9{fmt(fromAnnual(comparisonDetails.oldRegimeDetails.netInHandAnnual))}</small>
                    </div>
                  </div>
                  <div style={{ marginTop: "24px" }}>
                    <table className="regime-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.98rem", marginBottom: "1rem" }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "6px 8px" }}>Feature</th>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "6px 8px" }}>Old Regime</th>
                          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "6px 8px" }}>New Regime</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TAX_REGIME_TABLE.map((row, i) => (
                          <tr key={i}>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #eee" }}>{row.feature}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #eee" }}>{row.old}</td>
                            <td style={{ padding: "5px 8px", borderBottom: "1px solid #eee" }}>{row.newR}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="info-text" style={{ marginBottom: "0.5rem" }}>
                      Income tax slabs are the same across India. Professional Tax and salary structure can vary by state and employer.
                    </div>
                  </div>
                  <div className="result-card" style={{ marginTop: "16px", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)" }}>
                    <div style={{ color: "var(--success)", fontWeight: 700, fontSize: "1.1rem" }}>
                      {comparisonDetails.taxDiff > 0 ? (
                        <>\u2705 Save \u20B9{fmt(fromAnnual(comparisonDetails.savings))} with <strong>New Regime</strong></>
                      ) : comparisonDetails.taxDiff < 0 ? (
                        <>\u2705 Save \u20B9{fmt(fromAnnual(comparisonDetails.savings))} with <strong>Old Regime</strong></>
                      ) : (
                        <>\u2705 Both regimes result in equal tax.</>
                      )}
                    </div>
                    {regime === "old" && Object.values(oldDedns).some(v => v > 0) && (
                      <small style={{ color: "var(--text-muted)", marginTop: "0.3rem", display: "block" }}>
                        Old Regime comparison uses your entered deductions.
                      </small>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Reverse Mode */}
      {reverseMode && (
        <>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Desired Net In-Hand ({periodLabel})</label>
              <input className="form-input" type="number" min="0"
                placeholder={period === "monthly" ? "e.g. 60000" : "e.g. 720000"}
                value={reverseInput} onChange={e => setReverseInput(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Basic Salary % ({basicSalaryPercent}%)</label>
              <input type="range" min="35" max="50" value={basicSalaryPercent}
                onChange={e => setBasicSalaryPercent(Number(e.target.value))} />
            </div>
            <div className="form-field">
              <label className="form-label">Tax Regime</label>
              <select className="form-input" value={regime} onChange={e => setRegime(e.target.value)}>
                <option value="new">New Regime (FY 2025-26)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">City Type (HRA)</label>
              <select className="form-input" value={metro ? "metro" : "nonmetro"} onChange={e => setMetro(e.target.value === "metro")}>
                <option value="metro">Metro City (50% HRA)</option>
                <option value="nonmetro">Non-Metro City (40% HRA)</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Professional Tax State</label>
              <select className="form-input" value={profTaxState} onChange={e => setProfTaxState(e.target.value)}>
                {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {reverseResult && (
            <>
              <div className="result-main" style={{ marginTop: "1rem" }}>
                <div>
                  <div className="result-main-value">\u20B9{fmt(fromAnnual(reverseResult.netInHandAnnual))}</div>
                  <div className="result-main-label">{period === "monthly" ? "Monthly" : "Annual"} Net In-Hand</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--success)" }}>
                    \u20B9{fmt(fromAnnual(reverseResult.grossSalaryAnnual))}
                  </div>
                  <div className="result-main-label">Required Gross Salary</div>
                </div>
              </div>
              {renderSalaryBreakup(reverseResult)}
              <div className="result-grid" style={{ marginTop: "1rem" }}>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value text-danger" style={{ fontSize: "1.2rem" }}>\u20B9{fmt(fromAnnual(reverseResult.tax))}</span>
                  <span className="result-label">Income Tax</span>
                </div>
                <div className="result-card" style={fixedCardStyle}>
                  <span className="result-value">\u20B9{fmt(fromAnnual(reverseResult.employeePFAnnual))}</span>
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
              {renderDonutChart(reverseResult)}
              <p className="info-text" style={{ marginTop: "1rem" }}>
                Required gross salary estimated via binary search (60 iterations). Accounts for PF, gratuity, professional tax and {regime === "new" ? "New" : "Old"} Regime income tax.
              </p>
              <div className="tool-actions">
                <CopyBtn text={copyText} />
                <button className="btn-tool btn-reset" onClick={handleReset}>&#x21BA; Reset</button>
                <button className="btn-tool" onClick={handleDownloadPDF} disabled={!jsPDF}>&#x2B07; Download PDF</button>
                <button className="btn-tool" onClick={handleShareResult}>&#x1F4E4; Share Result</button>
              </div>
            </>
          )}
        </>
      )}

      {offerComparisonMode && renderOfferComparisonForm()}
    </section>
  );
}