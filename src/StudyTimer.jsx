import { useState, useEffect, useRef } from "react";
import CopyBtn from "./CopyBtn";
import { pad } from "./helpers";

export default function StudyTimer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;

  return (
    <section className="tool-section" id="studytimer">
      <div className="tool-header">
        <div className="tool-tag">⏱ Productivity</div>
        <h2 className="tool-title">Study Timer</h2>
        <p className="tool-desc">Track how long you've been studying in a clean, distraction-free timer.</p>
      </div>
      <div className="timer-label">{running ? "Session Active" : elapsed > 0 ? "Paused" : "Ready"}</div>
      <span className="timer-display">{h > 0 ? `${pad(h)}:` : ""}{pad(m)}:{pad(s)}</span>
      <div className="tool-actions" style={{ justifyContent: "center" }}>
        {!running ? (
          <button className="btn-tool btn-timer-start" onClick={() => setRunning(true)}>▶ {elapsed > 0 ? "Resume" : "Start"}</button>
        ) : (
          <button className="btn-tool btn-timer-pause" onClick={() => setRunning(false)}>⏸ Pause</button>
        )}
        <button className="btn-tool btn-timer-reset" onClick={() => { setRunning(false); setElapsed(0); }}>↺ Reset</button>
        <CopyBtn text={`Study time: ${h > 0 ? `${pad(h)}h ` : ""}${pad(m)}m ${pad(s)}s`} />
      </div>
    </section>
  );
}
