import { useState, useEffect, useRef } from "react";
import { pad } from "./helpers";

const MODES = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
const MODE_LABELS = { focus: "Focus", shortBreak: "Short Break", longBreak: "Long Break" };

export default function PomodoroTimer() {
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "focus") setSessions(s => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = m => { setMode(m); setTimeLeft(MODES[m]); setRunning(false); };
  const total = MODES[mode];
  const progress = ((total - timeLeft) / total) * 100;

  return (
    <section className="tool-section" id="pomodoro">
      <div className="tool-header">
        <div className="tool-tag">🍅 Productivity</div>
        <h2 className="tool-title">Pomodoro Timer</h2>
        <p className="tool-desc">Stay focused with timed work and break cycles using the Pomodoro technique.</p>
      </div>
      <div className="pomodoro-mode-btns">
        {Object.keys(MODES).map(m => (
          <button key={m} className={`mode-btn ${mode === m ? "active" : ""}`} onClick={() => switchMode(m)}>
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <div
        className={`timer-ring ${running ? (mode === "focus" ? "timer-ring-active" : "timer-ring-break") : ""}`}
        style={{ position: "relative" }}
      >
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="90" cy="90" r="86" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="90" cy="90" r="86" fill="none"
            stroke={mode === "focus" ? "var(--accent)" : "var(--success)"}
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 86}
            strokeDashoffset={2 * Math.PI * 86 * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {pad(Math.floor(timeLeft / 60))}:{pad(timeLeft % 60)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{MODE_LABELS[mode]}</div>
        </div>
      </div>
      <div className="tool-actions" style={{ justifyContent: "center" }}>
        {!running ? (
          <button className="btn-tool btn-timer-start" onClick={() => setRunning(true)}>▶ Start</button>
        ) : (
          <button className="btn-tool btn-timer-pause" onClick={() => setRunning(false)}>⏸ Pause</button>
        )}
        <button className="btn-tool btn-timer-reset" onClick={() => { setRunning(false); setTimeLeft(MODES[mode]); }}>↺ Reset</button>
      </div>
      <div className="pomodoro-sessions">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`session-dot ${i < sessions % 4 ? "done" : ""}`} />
        ))}
      </div>
      <p className="info-text" style={{ textAlign: "center", marginTop: "0.5rem" }}>
        Sessions completed: {sessions} · Every 4 sessions, take a long break
      </p>
    </section>
  );
}
