import { useState, useEffect } from "react";
import CopyBtn from "./CopyBtn";

const unitData = {
  Length: {
    units: ["Meter", "Kilometer", "Mile", "Foot", "Inch", "Centimeter"],
    toBase: { Meter: 1, Kilometer: 1000, Mile: 1609.34, Foot: 0.3048, Inch: 0.0254, Centimeter: 0.01 },
  },
  Weight: {
    units: ["Kilogram", "Gram", "Pound", "Ounce", "Ton"],
    toBase: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495, Ton: 1000 },
  },
  Temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    toBase: null,
  },
};

function convertTemp(val, from, to) {
  let celsius;
  if (from === "Celsius") celsius = val;
  else if (from === "Fahrenheit") celsius = (val - 32) * 5 / 9;
  else celsius = val - 273.15;
  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [value, setValue] = useState("");

  const cat = unitData[category];

  useEffect(() => {
    setFromUnit(cat.units[0]);
    setToUnit(cat.units[1]);
    setValue("");
  }, [category]);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return "—";
    if (category === "Temperature") return convertTemp(v, fromUnit, toUnit).toFixed(4);
    const base = v * cat.toBase[fromUnit];
    return (base / cat.toBase[toUnit]).toFixed(6).replace(/\.?0+$/, "");
  };

  const result = value ? convert() : "—";

  return (
    <section className="tool-section" id="converter">
      <div className="tool-header">
        <div className="tool-tag">📐 Utility</div>
        <h2 className="tool-title">Unit Converter</h2>
        <p className="tool-desc">Convert length, weight, and temperature between common units instantly.</p>
      </div>
      <div className="form-grid" style={{ marginBottom: "1rem" }}>
        <div className="form-field">
          <label className="form-label">Category</label>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            {Object.keys(unitData).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "end", marginBottom: "1.5rem" }}>
        <div className="form-field">
          <label className="form-label">From</label>
          <select className="form-select" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
            {cat.units.map(u => <option key={u}>{u}</option>)}
          </select>
          <input className="form-input" style={{ marginTop: "0.5rem" }} type="number" placeholder="Enter value" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div style={{ textAlign: "center", color: "var(--accent)", fontSize: "1.5rem", paddingBottom: "0.5rem" }}>→</div>
        <div className="form-field">
          <label className="form-label">To</label>
          <select className="form-select" value={toUnit} onChange={e => setToUnit(e.target.value)}>
            {cat.units.map(u => <option key={u}>{u}</option>)}
          </select>
          <div className="form-input" style={{ marginTop: "0.5rem", color: result !== "—" ? "var(--accent)" : "var(--text-muted)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            {result}
          </div>
        </div>
      </div>
      {value && result !== "—" && (
        <div className="tool-actions">
          <CopyBtn text={`${value} ${fromUnit} = ${result} ${toUnit}`} />
          <button className="btn-tool btn-reset" onClick={() => setValue("")}>↺ Clear</button>
        </div>
      )}
    </section>
  );
}
