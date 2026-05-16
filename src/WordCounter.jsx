import { useState } from "react";
import CopyBtn from "./CopyBtn";

export default function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\n+/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <section className="tool-section" id="wordcounter">
      <div className="tool-header">
        <div className="tool-tag">📄 Writing</div>
        <h2 className="tool-title">Word Counter</h2>
        <p className="tool-desc">Paste your text and get live word, character, sentence, and reading time stats.</p>
      </div>
      <div className="form-field">
        <label className="form-label">Your Text</label>
        <textarea
          className="form-textarea"
          placeholder="Paste or type your text here…"
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ minHeight: 160 }}
        />
      </div>
      <div className="wc-stats">
        <div className="wc-stat"><span className="wc-stat-num">{words}</span><span className="wc-stat-label">Words</span></div>
        <div className="wc-stat"><span className="wc-stat-num">{chars}</span><span className="wc-stat-label">Characters</span></div>
        <div className="wc-stat"><span className="wc-stat-num">{charsNoSpace}</span><span className="wc-stat-label">No Spaces</span></div>
        <div className="wc-stat"><span className="wc-stat-num">{sentences}</span><span className="wc-stat-label">Sentences</span></div>
        <div className="wc-stat"><span className="wc-stat-num">{paragraphs}</span><span className="wc-stat-label">Paragraphs</span></div>
        <div className="wc-stat"><span className="wc-stat-num">{readTime} min</span><span className="wc-stat-label">Read Time</span></div>
      </div>
      <div className="tool-actions">
        <CopyBtn text={`Words: ${words} | Chars: ${chars} | Sentences: ${sentences} | Read: ${readTime} min`} />
        <button className="btn-tool btn-reset" onClick={() => setText("")}>↺ Clear</button>
      </div>
    </section>
  );
}
