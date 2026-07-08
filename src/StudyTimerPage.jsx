import { Link } from "react-router-dom";
import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import StudyTimer from "./StudyTimer";

const tool = TOOLS.find(t => t.id === "studytimer");

const RELATED_IDS = ["pomodoro", "attendance", "cgpa", "percentage", "board", "age", "salary", "emi", "loan", "wordcounter"];

const HOW_STEPS = [
  { n: "1", title: "Open the study timer", body: "The timer starts in a ready state showing 00:00. It works as a stopwatch, so there is no need to set a duration in advance. Just sit down, open your subject, and prepare to begin." },
  { n: "2", title: "Press Start when you begin studying", body: "Hit the Start button the moment you open your book or sit at your desk. The timer counts upward continuously so you can see exactly how long your current session has been running." },
  { n: "3", title: "Stay focused — let the timer run", body: "Resist the urge to check your phone or switch tasks. The timer running in the background creates a psychological commitment to the session. Most students find they study better simply because they know they are being timed." },
  { n: "4", title: "Pause when you take a break", body: "Press Pause before you step away. This ensures your recorded study time reflects actual focused study, not time spent getting water or checking notifications. Resume with the Resume button when you return." },
  { n: "5", title: "Copy and track your session time", body: "Use the Copy button to save your session duration as text. Track daily totals in a notebook or spreadsheet. Reviewing weekly totals is one of the most powerful motivators for building a consistent study habit." },
];

const TECHNIQUES_TABLE = [
  { technique: "Pomodoro Method", focus: "25 min", breakT: "5 min", longBreak: "15–30 min (every 4 sessions)", bestFor: "General study, revision, assignments" },
  { technique: "50-10 Method",    focus: "50 min", breakT: "10 min", longBreak: "30 min (every 3 sessions)",  bestFor: "College subjects, problem-solving" },
  { technique: "90-20 Method",    focus: "90 min", breakT: "20 min", longBreak: "60 min (every 2 sessions)",  bestFor: "Deep work, reading-heavy topics" },
  { technique: "45-15 Method",    focus: "45 min", breakT: "15 min", longBreak: "30 min (every 3 sessions)",  bestFor: "Creative work, writing, design" },
  { technique: "Ultradian Rhythm", focus: "90 min", breakT: "20 min", longBreak: "Natural cycle",            bestFor: "Peak mental performance, research" },
];

const WORKED_EXAMPLES = [
  {
    label: "Example 1 — Pomodoro (25-5)",
    sessions: 8, focus: 25, breakT: 5,
    lines: [
      "8 Pomodoro sessions × 25 min focus   = 200 min of study",
      "8 breaks × 5 min                     = 40 min break time",
      "1 long break after session 4          = 20 min",
      "Total time block                      = 260 min (4 hr 20 min)",
      "Net focused study                     = 200 min (3 hr 20 min)",
    ],
    result: "Ideal for: Revision, MCQ practice, covering multiple subjects",
  },
  {
    label: "Example 2 — 50-10 Method",
    sessions: 5, focus: 50, breakT: 10,
    lines: [
      "5 sessions × 50 min focus            = 250 min of study",
      "5 breaks × 10 min                    = 50 min break time",
      "1 long break after session 3          = 30 min",
      "Total time block                      = 330 min (5 hr 30 min)",
      "Net focused study                     = 250 min (4 hr 10 min)",
    ],
    result: "Ideal for: Engineering subjects, numerical practice, college students",
  },
  {
    label: "Example 3 — Deep Work (90-20)",
    sessions: 3, focus: 90, breakT: 20,
    lines: [
      "3 sessions × 90 min focus            = 270 min of study",
      "2 breaks × 20 min                    = 40 min break time",
      "1 long break after session 2          = 60 min",
      "Total time block                      = 370 min (6 hr 10 min)",
      "Net focused study                     = 270 min (4 hr 30 min)",
    ],
    result: "Ideal for: UPSC reading, law students, thesis writing, CA preparation",
  },
];

const FAQS = [
  { q: "What is a study timer and why should students use one?", a: "A study timer is a tool that tracks how long you study in a single session. It creates awareness, builds accountability, and helps you understand your actual productive hours versus time merely spent at a desk. Research consistently shows that students who track study time outperform those who study without time awareness — because tracking creates intentionality. Even a simple stopwatch converts passive sitting into active, goal-directed studying." },
  { q: "How long should a single study session be?", a: "The optimal study session length depends on your goal and subject type. For most students, 25–50 minutes with a 5–10 minute break is the most sustainable rhythm. Sessions shorter than 20 minutes rarely allow deep engagement with a topic. Sessions longer than 90 minutes without a break cause cognitive fatigue that sharply reduces retention. Start with 25-minute sessions if you struggle with focus and work up to longer blocks as your concentration improves." },
  { q: "What is the Pomodoro Technique and does it actually work?", a: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It involves working in 25-minute focused intervals (Pomodoros) separated by 5-minute breaks, with a longer 15–30 minute break every 4 sessions. It works because it makes large tasks feel less overwhelming (you only commit to 25 minutes at a time), it prevents mental fatigue through forced breaks, and it creates urgency that reduces procrastination. Multiple peer-reviewed studies support interval-based study over marathon sessions." },
  { q: "Is it better to study for 2 hours straight or use breaks?", a: "Breaks win, consistently. Human attention begins degrading significantly after 45–60 minutes of continuous focus. By the 90-minute mark, most people are effectively just reading words without processing them. Two 45-minute sessions with a 10-minute break will produce far better retention than one 90-minute session. The break allows your hippocampus to consolidate the material you have just reviewed — which is why students who take breaks during study often recall more in exams than those who cram without stopping." },
  { q: "What is Deep Work and how does a study timer help?", a: "Deep Work, popularised by Cal Newport's book of the same name, refers to the ability to focus without distraction on cognitively demanding tasks. It is the mental state required to truly understand difficult concepts in mathematics, science, law, and competitive exam preparation. A study timer helps achieve Deep Work by creating a defined time block with a clear start and end, reducing the temptation to check your phone mid-session, and building the habit of sustained concentration over weeks and months." },
  { q: "How many study hours do I need for JEE, NEET, or UPSC?", a: "For JEE/NEET: Serious aspirants typically aim for 6–8 hours of effective daily study, with at least 4–5 hours being uninterrupted focused sessions. For UPSC: 8–10 hours is often cited, though many toppers emphasise quality over quantity — 6 hours of genuine focus beats 10 hours of distracted reading. For SSC/Banking exams: 4–5 daily focused hours is typically sufficient if the strategy is sharp. In all cases, tracked hours matter more than approximate guesses — use this timer to know your actual numbers." },
  { q: "Should I use background music while studying?", a: "It depends on the task and the person. For routine tasks (writing, making notes, solving familiar problem types), instrumental music at low volume can improve focus for many students. For tasks requiring high cognitive load (learning new concepts, solving unfamiliar problems), silence typically produces better results. Avoid music with lyrics when studying language-based subjects or anything requiring reading comprehension — the language processing overlap disrupts retention." },
  { q: "What are ultradian rhythms and how do they affect study sessions?", a: "Ultradian rhythms are natural biological cycles of approximately 90–120 minutes that alternate between higher and lower brain alertness throughout the day. During the high phase, concentration is sharper and learning is faster. During the low phase, the brain signals a need for rest — you may notice yawning, difficulty concentrating, or mental fogginess. Structuring study blocks around 90-minute cycles and taking genuine breaks during the low phase is physiologically optimal for sustained daily productivity." },
  { q: "How do I build a consistent daily study habit using a timer?", a: "Consistency comes from pairing the timer with a fixed daily trigger. Sit down at the same time and location every day, start the timer immediately, and study until it shows at least 25 minutes. The act of starting is the hardest part — the timer removes the decision-making overhead. After 21–30 days of this pattern, the behaviour becomes automatic. Track your weekly totals and set a minimum floor (e.g., 3 hours every day) rather than a maximum ceiling. Progress over perfection." },
  { q: "Can studying with a timer improve exam results?", a: "Indirectly, yes. Timers do not directly improve knowledge — the content you study does. But timers significantly increase the total volume of deliberate practice, reduce procrastination, improve time awareness, build study habits, and prevent the illusion of productivity (reading for 4 hours while actually absorbing 30 minutes worth of material). Students who track study time consistently tend to accumulate more quality study hours over a semester, which correlates strongly with better exam performance." },
  { q: "How many Pomodoro sessions should I do in a day?", a: "For a full study day, 8–12 Pomodoro sessions (25 min each) is a realistic and sustainable target. That is 200–300 minutes of net study time (3.3–5 hours). Very few students can do more than 12 genuine Pomodoros in a single day — beyond that, the quality of focus degrades sharply. Starting students should target 4–6 Pomodoros daily and build up gradually over 2–3 weeks." },
  { q: "Is it okay to study late at night?", a: "Night studying can work for some people whose circadian rhythm makes them more alert in the evening (chronotypes). However, studying late at the expense of sleep is counterproductive. Sleep is when memory consolidation happens — the material studied before adequate sleep is poorly retained. If you must study late, prioritise review and recall practice (which consolidates existing learning) over learning new material (which requires maximum cognitive capacity)." },
  { q: "What should I do during study breaks?", a: "The most effective breaks involve physical movement and zero screen time. Take a short walk, do light stretching, drink water, or practice 2–3 minutes of deep breathing. Avoid checking social media or YouTube during breaks — these activate reward pathways that make returning to study significantly harder. Brief mindfulness exercises during breaks have been shown to improve subsequent focus quality in multiple studies." },
  { q: "How is this Study Timer different from a Pomodoro timer?", a: "This Study Timer is a freeform stopwatch — it counts upward from zero without a preset duration. This makes it ideal for tracking total session length across any study method. The Pomodoro Timer on Filtero is a countdown timer that enforces the 25/5/15 cycle automatically. Use the Study Timer when you want to track your total focused hours without constraints. Use the Pomodoro Timer when you want the 25-minute cycle to guide your work rhythm." },
  { q: "What is cognitive fatigue and how does a study timer help prevent it?", a: "Cognitive fatigue is the mental exhaustion that sets in after sustained focused effort. It manifests as difficulty concentrating, slower thinking, increased error rates, and reduced motivation. It is caused by the depletion of mental glucose and the accumulation of adenosine (a sleep-promoting compound) in the brain. Timers help prevent it by enforcing break intervals before fatigue peaks, ensuring the brain gets recovery time before cognitive performance degrades below an effective threshold." },
  { q: "Should students track study time or just study until they understand the topic?", a: "Both matter, and they are not mutually exclusive. Understanding the topic should always be the primary goal. Time tracking adds a layer of self-awareness and habit building on top of that goal. Students who only track time without checking comprehension risk passive reading. Students who only check comprehension without tracking time often underestimate how few hours they actually studied. The best approach: study until you understand, use the timer to know how long that took, and build weekly consistency from the data." },
];

const sectionStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem 2.5rem", marginTop: "1.25rem" };
const h2Style = { fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" };
const h3Style = { fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" };
const bodyStyle = { color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.75, margin: 0 };
const labelStyle = { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", margin: "0 0 0.5rem" };
const codeBlockStyle = { display: "block", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)", fontFamily: "monospace", marginBottom: "0.5rem", wordBreak: "break-word" };
const thStyle = { padding: "0.6rem 1rem", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" };

export default function StudyTimerPage() {
  useSEO(tool.seo);
  const relatedTools = TOOLS.filter(t => RELATED_IDS.includes(t.id));

  return (
    <ToolPageLayout tool={{ ...tool, faqs: [] }}>
      <StudyTimer />

      {/* 1 — Introduction */}
      <section aria-label="About the Study Timer" style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={h2Style}>Free Online Study Timer for Students — Track Every Focused Minute</h2>
        <p style={bodyStyle}>
          Most students overestimate how much they study. They sit at their desk for four hours and feel
          exhausted — but when asked how many hours they actually studied, they say four. In reality, a
          large chunk of that time was spent checking their phone, getting distracted, staring blankly,
          or slowly shifting from one task to another. A study timer solves this by recording only the
          time you are actually focused and working. When you see the real number — maybe 90 minutes out
          of four hours — it changes how you approach the next session.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          The Filtero Study Timer is a clean, distraction-free online stopwatch designed specifically for
          students. It starts at zero, counts upward, and records your total focused study time in a single
          session. You can pause it when you step away for a break and resume it when you return. At the end
          of your session, the timer shows your exact focused hours and minutes, which you can copy and log.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          This is not a Pomodoro timer with enforced intervals — it is a freeform focus tracker. That means
          it works with any study technique: Pomodoro, 50-10, 90-minute deep work blocks, or simply
          "study until I finish this chapter." The timer adapts to your style, not the other way around.
        </p>
        <h3 style={{ ...h3Style, marginTop: "1.5rem" }}>Why Students Lose Focus — And How a Timer Fixes It</h3>
        <p style={bodyStyle}>
          The human brain was not designed for hours of continuous abstract thinking. Research from the
          Cognitive Neuroscience Society shows that sustained attention begins degrading after approximately
          45–60 minutes of focused effort. After 90 minutes without a break, cognitive performance drops
          sharply. Most students push through this wall, not realising that they are reading words without
          processing them.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          A timer creates what psychologists call a "time pressure effect" — the knowledge that a clock is
          running reduces procrastination, increases focus, and makes study feel more purposeful. Students
          who time their sessions consistently report higher motivation, better time management, and fewer
          late-night panic sessions before exams.
        </p>
        <h3 style={{ ...h3Style, marginTop: "1.5rem" }}>Which Students Benefit Most from a Study Timer?</h3>
        <p style={bodyStyle}>
          Every student benefits from tracking study time, but it is especially valuable for competitive
          exam aspirants. JEE and NEET preparation requires 6–8 hours of daily focused study over 1–2 years.
          Without tracking, it is impossible to know whether you are genuinely hitting those targets or just
          feeling tired at the end of the day. UPSC aspirants use study timers to maintain the long daily
          reading hours required for GS preparation. CA students use them to manage the vast syllabus
          across Foundation, Intermediate, and Final levels. SSC CGL and banking aspirants benefit from
          tracking mock test sessions and subject-wise revision hours.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          For school students preparing for Class 10 and Class 12 boards, a study timer creates structured
          daily habits that compound over weeks into a measurable advantage. College students managing
          multiple subjects and deadlines use timers to allocate time proportionally across subjects
          based on exam weightage and personal difficulty.
        </p>
        <p style={{ ...bodyStyle, marginTop: "0.85rem" }}>
          No installation, no account, no subscription. Open the timer, press Start, and begin.
        </p>
      </section>

      {/* 2 — How to Use */}
      <section aria-label="How to use the study timer" style={sectionStyle}>
        <h2 style={h2Style}>How to Use This Study Timer — Step by Step</h2>
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

      {/* 3 — Study Timer Formula / Methods */}
      <section aria-label="Study timer methods and techniques" style={sectionStyle}>
        <h2 style={h2Style}>Study Timer Methods — Choosing the Right Interval</h2>

        <p style={labelStyle}>The Pomodoro Technique</p>
        <code style={codeBlockStyle}>25 min focus → 5 min break → repeat 4× → 15–30 min long break</code>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Developed by Francesco Cirillo, the Pomodoro Technique is the most widely used time-boxing method
          for students. The 25-minute sessions are short enough to feel unthreatening, which makes starting
          easy. The mandatory breaks prevent cognitive fatigue from accumulating. The long break every 4
          sessions gives the brain time for memory consolidation.
        </p>

        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>The 50-10 Method</p>
        <code style={codeBlockStyle}>50 min focus → 10 min break → repeat 3× → 30 min long break</code>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Better suited for college students and competitive exam aspirants who need longer immersion in
          complex topics. Fifty minutes allows enough time to work through a full chapter section, solve
          a set of problems, or complete one mock test section. The 10-minute break is slightly longer,
          giving the brain more recovery time per session.
        </p>

        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>The 90-20 Deep Work Method</p>
        <code style={codeBlockStyle}>90 min focus → 20 min break → repeat 2–3× → full recovery break</code>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Based on ultradian rhythm research, 90-minute blocks align with the brain's natural high-alertness
          cycles. This method is used by high-performance students and professionals for cognitively demanding
          work — reading dense legal or medical texts, solving advanced mathematics, writing dissertations, or
          preparing for UPSC Mains essay writing. The 20-minute break must be a genuine rest — no screens,
          preferably with movement.
        </p>

        <p style={{ ...labelStyle, borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>Flow State Study</p>
        <code style={codeBlockStyle}>No fixed interval → study until natural stopping point → log total time</code>
        <p style={{ ...bodyStyle }}>
          When you reach a Flow State — complete absorption in a task with no awareness of time — interrupting
          it with a forced timer break is counterproductive. The Filtero Study Timer works well here because
          it tracks upward without interrupting. Simply let it run during your flow state and pause it when
          you naturally surface. Flow states typically last 60–120 minutes when conditions are right.
        </p>
      </section>

      {/* 4 — Worked Examples */}
      <section aria-label="Study session worked examples" style={sectionStyle}>
        <h2 style={h2Style}>Study Session Examples — Planning Your Day</h2>
        {WORKED_EXAMPLES.map((ex, idx) => (
          <div key={ex.label} style={{ marginBottom: idx < WORKED_EXAMPLES.length - 1 ? "1.5rem" : 0, paddingBottom: idx < WORKED_EXAMPLES.length - 1 ? "1.5rem" : 0, borderBottom: idx < WORKED_EXAMPLES.length - 1 ? "1px solid var(--border)" : "none" }}>
            <p style={labelStyle}>{ex.label}</p>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0.85rem 1rem", marginBottom: "0.5rem" }}>
              {ex.lines.map((line, j) => (
                <code key={j} style={{ display: "block", fontSize: "0.85rem", fontFamily: "monospace", color: j === ex.lines.length - 1 ? "var(--accent)" : "var(--text-primary)", lineHeight: 1.85 }}>{line}</code>
              ))}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
              Best for: <strong style={{ color: "var(--text-secondary)" }}>{ex.result}</strong>
            </p>
          </div>
        ))}
      </section>

      {/* 5 — Techniques Comparison Table */}
      <section aria-label="Study timer technique comparison table" style={sectionStyle}>
        <h2 style={h2Style}>Study Timer Techniques — Full Comparison</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          Different techniques suit different students and subject types. Use this table to find the interval
          that matches your attention span, subject difficulty, and study goals.
        </p>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr 2fr", background: "var(--bg-input)", borderBottom: "1px solid var(--border)", minWidth: 540 }}>
            {["Technique", "Focus", "Break", "Long Break", "Best For"].map(h => <span key={h} style={thStyle}>{h}</span>)}
          </div>
          {TECHNIQUES_TABLE.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr 2fr", borderBottom: i < TECHNIQUES_TABLE.length - 1 ? "1px solid var(--border)" : "none", minWidth: 540, alignItems: "center" }}>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>{row.technique}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600 }}>{row.focus}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{row.breakT}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>{row.longBreak}</span>
              <span style={{ padding: "0.55rem 1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>{row.bestFor}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6 — Interpret Sessions */}
      <section aria-label="How to interpret your daily study hours" style={sectionStyle}>
        <h2 style={h2Style}>How to Interpret Your Daily Study Hours</h2>
        {[
          { range: "Less than 1 hour of focused study", label: "Needs Improvement", color: "var(--danger)", body: "One hour or less of tracked focused study in a day is a signal that something is blocking your study habit — whether it is procrastination, phone distraction, mental fatigue, or a poor study environment. Focus first on building a consistent 2-hour daily baseline before attempting to scale up. Small consistent wins beat occasional long sessions." },
          { range: "1–3 hours of focused study", label: "Building Momentum", color: "var(--warning)", body: "This is the study range of most school students balancing classes, activities, and rest. It is sufficient for maintaining academic performance in regular semesters. For competitive exams, 2–3 tracked hours daily is a foundation to build from, not an end target. Gradually extend by 30 minutes per week." },
          { range: "3–5 hours of focused study", label: "Good", color: "#34d399", body: "Three to five genuine, tracked focused hours per day is the sweet spot for most competitive exam aspirants and students preparing for important exams. At this level, consistency over 90–120 days produces a significant knowledge advantage. Pair this with active recall (self-testing) after each session for best retention." },
          { range: "5–8 hours of focused study", label: "Excellent", color: "var(--success)", body: "Five or more tracked hours is the standard for serious JEE, NEET, UPSC, and CA aspirants in peak preparation mode. At this intensity, managing cognitive fatigue becomes critical. Ensure sleep is not being compromised — sleep is when memory consolidation occurs. Use multiple breaks and vary subjects to maintain quality across the full day." },
          { range: "Above 8 hours of focused study", label: "Elite — With Caution", color: "var(--accent)", body: "Eight-plus hours of genuinely focused study in a single day is achievable but requires exceptional discipline, an optimised environment, and a well-planned schedule. Most people who report this level of study are counting total time rather than focused time. If your timer genuinely shows 8+ hours, ensure you are not sacrificing sleep or physical health — both are essential for memory and mental stamina." },
        ].map((item, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: `3px solid ${item.color}`, borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", marginBottom: i < 4 ? "0.75rem" : 0 }}>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.875rem", margin: "0 0 0.35rem" }}>{item.range} — <span style={{ color: item.color }}>{item.label}</span></p>
            <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
          </div>
        ))}
      </section>

      {/* 7 — Common Mistakes */}
      <section aria-label="Common study mistakes students make" style={sectionStyle}>
        <h2 style={h2Style}>Common Study Mistakes — And How to Fix Them</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { title: "Skipping breaks and powering through fatigue", body: "Many students believe stopping means wasting time. In reality, studying through cognitive fatigue produces diminishing returns — you are reading but not retaining. Mandatory breaks are not a reward; they are a performance tool. A 10-minute break after 50 minutes of focus produces better retention than 60 continuous minutes of fatigued reading." },
            { title: "Using the phone during study breaks", body: "Social media and YouTube activate the brain's dopamine reward system, making it significantly harder to return to the low-stimulation activity of studying. If you use your phone during a break, your focus for the next session takes 15–20 minutes to fully restore. Use breaks for movement, water, or brief rest — not screens." },
            { title: "Measuring study by time at the desk, not focused minutes", body: "Sitting at a desk for 6 hours feels productive but may yield 2 hours of actual focus. The study timer removes this illusion. When students first start tracking their real focused time, they are often surprised how little it is — and that awareness drives genuine improvement." },
            { title: "Starting every session without a plan", body: "Sitting down without knowing what you will study in this session wastes the first 10–15 minutes to decision-making. Before you start the timer, write down one specific goal for the session: 'Finish Chapter 5 problems 1–20' or 'Read and summarise pages 80–120'. A session with a goal produces 40–60% more output than an open-ended 'I'll study Chemistry'." },
            { title: "Multitasking across subjects in a single session", body: "Switching between subjects every 10–15 minutes feels productive because it breaks monotony, but it prevents the deep engagement required to understand difficult concepts. Dedicate each focused session to a single subject or topic. If a subject is boring, use the Pomodoro 25-minute block as a commitment device — 25 minutes of any subject is manageable." },
            { title: "No revision of earlier material", body: "Learning a topic once and moving on means forgetting 60–70% of it within a week (the forgetting curve). Build a 20–30 minute daily revision block into your schedule, separate from new learning. Review yesterday's notes before starting today's session. The study timer tracks this time too — log it separately if possible." },
            { title: "Inconsistent scheduling", body: "Studying 10 hours on Saturday and zero on Sunday produces worse retention than 2 hours every day of the week. The brain consolidates learning during sleep and the gaps between sessions. Daily consistency — even a modest 2–3 hours — beats weekend cramming sessions in both retention and stress management." },
          ].map((item, i) => (
            <article key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>{i + 1}. {item.title}</h3>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 8 — Tips */}
      <section aria-label="Tips to maximise study focus and productivity" style={sectionStyle}>
        <h2 style={h2Style}>Tips to Maximise Your Focus Every Study Session</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {[
            "Place your phone in another room or a closed drawer before starting the timer — out of sight genuinely means out of mind.",
            "Start each session by writing one specific goal on paper. A concrete target removes decision fatigue mid-session.",
            "Drink a glass of water before you begin. Even mild dehydration (1–2%) measurably reduces concentration and short-term memory.",
            "Clear your desk of everything not related to the current subject. Visual clutter divides attention even when you are not actively looking at it.",
            "Use noise-cancelling headphones or earplugs in noisy environments. Background noise at unpredictable volumes degrades focus more than consistent ambient sound.",
            "Study at the same time and in the same location every day. The brain associates environment and time with behaviour — consistency makes starting easier.",
            "Disable all notifications on your laptop and phone before starting. Every notification, even unread, shifts your attention and takes 5–10 minutes to fully recover from.",
            "Set a daily minimum study target (e.g., 3 hours) instead of a maximum. Minimums build habits; maximums create pressure that leads to avoidance.",
            "After each session, spend 3–5 minutes writing down what you covered and any questions that arose. This acts as a retrieval practice that strengthens memory.",
            "Vary your subjects across sessions in a day. After a session on a quantitative subject (mathematics, physics), switching to a reading-heavy one (history, biology theory) gives a partial cognitive reset.",
            "Use full-screen mode for your notes or PDF — minimising the browser reduces tab-switching temptation.",
            "Exercise for at least 20–30 minutes before your most important study session of the day. Physical activity increases BDNF (brain-derived neurotrophic factor), which enhances memory formation and focus.",
            "Track your weekly total study hours at the end of each week. Seeing progress (or regression) creates accountability that a single session timer cannot provide.",
            "If you cannot focus, start with the easiest task or the subject you enjoy most. Momentum from completing something small makes transitioning to harder material easier.",
            "Plan your most cognitively demanding work during your peak alertness window — typically 2–4 hours after waking for most people.",
          ].map((tip, i) => (
            <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>→</span>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 9 — Scientific Benefits */}
      <section aria-label="Scientific benefits of using a study timer" style={sectionStyle}>
        <h2 style={h2Style}>Scientific Benefits of Using a Study Timer</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem" }}>
          The benefits of timed study sessions are grounded in cognitive science, not motivational advice.
          Here is what the research says:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { title: "Attention Restoration Theory", body: "Research by Kaplan and Berman shows that directed attention is a finite resource that depletes with use. Timed breaks allow involuntary attention to restore directed attention capacity, producing better focus in subsequent work periods." },
            { title: "The Spacing Effect", body: "Distributing study across multiple sessions with breaks — rather than cramming in one continuous block — significantly improves long-term retention. Ebbinghaus's original memory research and hundreds of subsequent studies confirm that spaced practice beats massed practice for recall during exams." },
            { title: "Active Recall Amplification", body: "When you end a timed session and pause before moving on, the slight cognitive distance created makes retrieval practice more effective. Students who take breaks and then test themselves on the material they just covered show 25–30% better retention than those who immediately continue studying new content." },
            { title: "The Zeigarnik Effect", body: "The brain tends to remember incomplete tasks better than completed ones. Ending a session mid-topic (rather than at a clean completion point) can prime the brain to continue processing the material during the break — a phenomenon that helps consolidation when combined with adequate sleep." },
            { title: "Habit Loop Formation", body: "James Clear's research on habit formation shows that consistent environmental and time cues (cue → routine → reward) build automatic behaviours. A study timer strengthens the routine component — starting the timer is the cue, studying is the routine, and seeing the total time is a small but meaningful reward that reinforces the behaviour." },
            { title: "Decision Fatigue Reduction", body: "Every decision — even small ones — depletes willpower. By committing to a fixed study session the moment you start the timer, you eliminate the repeated micro-decisions of 'should I study now? for how long? what next?' This decision fatigue reduction means more mental energy is available for actual studying." },
          ].map((item, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.35rem" }}>{item.title}</h3>
              <p style={{ ...bodyStyle, fontSize: "0.865rem" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 — FAQ */}
      <section aria-label="Study timer frequently asked questions" style={sectionStyle} itemScope itemType="https://schema.org/FAQPage">
        <h2 style={h2Style}>Frequently Asked Questions about Study Timers</h2>
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
      <section aria-label="Related student productivity tools" style={{ ...sectionStyle, marginBottom: "1rem" }}>
        <h2 style={h2Style}>Related Tools</h2>
        <p style={{ ...bodyStyle, marginBottom: "1.25rem", fontSize: "0.865rem" }}>
          Other tools students use to track progress, plan study, and stay productive.
        </p>
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