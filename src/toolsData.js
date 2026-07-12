export const TOOLS = [
  {
    id: "attendance",
    path: "/attendance-calculator",
    icon: "📅",
    name: "Attendance Calculator",
    shortName: "Attendance",
    desc: "Stay above 75%",
    tag: "📅 Academic",
    subtitle: "Instantly check if you're safe — or how many classes you can still bunk.",
    seo: {
      title: "Attendance Calculator – Check Bunk Limit & 75% Status | Filtero",
      description:
        "Free online attendance calculator for students. Find your attendance percentage, how many classes you can bunk, and how many you need to reach 75%. Instant results.",
      canonical: "https://tools.filterero.in/attendance-calculator",
    },
    faqs: [
      {
        q: "How is attendance percentage calculated?",
        a: "Attendance % = (Classes Attended ÷ Total Classes Held) × 100. For example, attending 90 out of 120 classes gives 75%.",
      },
      {
        q: "How many classes can I bunk and stay at 75%?",
        a: "The formula is: max(0, floor(Attended − 0.75 × Total)). If you've attended more than 75% of all classes, the surplus is your safe bunk count.",
      },
      {
        q: "How many classes do I need to attend to reach 75%?",
        a: "If you're below 75%, the formula is ceil((0.75 × Total − Attended) ÷ 0.25). This tells you the minimum additional classes needed.",
      },
      {
        q: "What is the minimum attendance required in college?",
        a: "Most Indian universities require a minimum of 75% attendance to be eligible to sit for exams. Some institutions allow 65% with medical grounds.",
      },
    ],
  },
  {
    id: "cgpa",
    path: "/cgpa-calculator",
    icon: "🎓",
    name: "CGPA Calculator",
    shortName: "CGPA",
    desc: "Weighted GPA calc",
    tag: "🎓 Academic",
    subtitle: "Add your subjects, pick your grade, and get your weighted CGPA instantly.",
    seo: {
      title: "CGPA Calculator – Weighted GPA & Percentage Converter | Filtero",
      description:
        "Calculate your CGPA online with subject-wise grade and credit inputs. Instantly get your weighted GPA and equivalent percentage. Free student tool.",
      canonical: "https://tools.filterero.in/cgpa-calculator",
    },
    faqs: [
      {
        q: "How is CGPA calculated?",
        a: "CGPA = Σ(Grade Points × Credits) ÷ Σ(Credits). Each subject's grade point is multiplied by its credit hours, summed up, then divided by total credits.",
      },
      {
        q: "How do I convert CGPA to percentage?",
        a: "The common formula used by Indian universities is: Percentage = CGPA × 9.5. So a CGPA of 8.0 equals 76%.",
      },
      {
        q: "What are the grade points for each grade?",
        a: "O=10, A+=9, A=8, B+=7, B=6, C=5, F=0. These are standard 10-point scale values used by most Indian universities.",
      },
      {
        q: "What is the difference between GPA and CGPA?",
        a: "GPA (Grade Point Average) is calculated for a single semester, while CGPA (Cumulative GPA) is the weighted average across all semesters completed.",
      },
    ],
  },
  {
    id: "percentage",
    path: "/percentage-calculator",
    icon: "📊",
    name: "Percentage Calculator",
    shortName: "Percentage",
    desc: "Marks to %",
    tag: "📊 Academic",
    subtitle: "Convert your raw marks into a clean percentage in seconds.",
    seo: {
      title: "Percentage Calculator – Marks to Percentage Converter | Filtero",
      description:
        "Convert obtained marks to percentage instantly. Free online percentage calculator for students with pass/fail status. Enter your marks and total to get your result.",
      canonical: "https://tools.filterero.in/percentage-calculator",
    },
    faqs: [
      {
        q: "How do I calculate percentage from marks?",
        a: "Percentage = (Obtained Marks ÷ Total Marks) × 100. For example, 450 out of 600 gives 75%.",
      },
      {
        q: "What percentage is considered a pass?",
        a: "Most boards and universities consider 35% as the minimum passing percentage, though some require 40% or 50% depending on the institution.",
      },
      {
        q: "How do I calculate percentage for multiple subjects?",
        a: "Add all obtained marks together and divide by the sum of all total marks, then multiply by 100. This gives the overall percentage across subjects.",
      },
      {
        q: "What is the difference between percentage and percentile?",
        a: "Percentage is your score out of total marks. Percentile shows your rank relative to other students — e.g., 90th percentile means you scored better than 90% of test-takers.",
      },
    ],
  },
  {
    id: "internal",
    path: "/internal-marks-calculator",
    icon: "📝",
    name: "Internal Marks Calculator",
    shortName: "Internal Marks",
    desc: "Score predictor",
    tag: "📝 Academic",
    subtitle: "Predict your internal score from assignments, attendance, and practicals.",
    seo: {
      title: "Internal Marks Calculator – Predict Your Internal Score | Filtero",
      description:
        "Calculate your predicted internal marks from assignments, attendance marks, and practical scores. Instant internal score estimator for college students.",
      canonical: "https://tools.filterero.in/internal-marks-calculator",
    },
    faqs: [
      {
        q: "How are internal marks calculated?",
        a: "Internal marks are typically the sum of assignment marks, attendance marks, and practical/lab marks, scaled to the internal maximum (usually 30 or 50 marks).",
      },
      {
        q: "How much do internal marks matter?",
        a: "Internal marks usually contribute 20–30% to the final grade. Scoring well in internals can make a significant difference to your final result.",
      },
      {
        q: "Can I improve my internal marks before exams?",
        a: "Yes. Submit pending assignments, attend remaining classes (which boosts attendance marks), and perform well in any remaining practicals or viva.",
      },
      {
        q: "What is the typical internal marks distribution?",
        a: "Common distributions include: Assignments (20), Attendance (10), Practicals (20) — scaled to 30 internal marks. This varies by university and subject.",
      },
    ],
  },
  {
    id: "board",
    path: "/board-result-predictor",
    icon: "🎯",
    name: "Board Result Predictor",
    shortName: "Board Predictor",
    desc: "Final % estimate",
    tag: "🎯 Academic",
    subtitle: "Estimate your final board percentage based on mock tests and internals.",
    seo: {
      title: "Board Result Predictor – Estimate Your Final Exam Score | Filtero",
      description:
        "Predict your board exam result using mock test scores and internal marks. Free online board result estimator for Class 10, Class 12 and college students.",
      canonical: "https://tools.filterero.in/board-result-predictor",
    },
    faqs: [
      {
        q: "How does the board result predictor work?",
        a: "It uses a weighted average: Mock exam scores contribute 70% and internal marks (scaled to 100) contribute 30% to the predicted final percentage.",
      },
      {
        q: "How accurate is the board result prediction?",
        a: "The prediction is an estimate based on your preparation level. Actual board results can vary due to exam difficulty, paper setting, and grace marks.",
      },
      {
        q: "What grade corresponds to which percentage in boards?",
        a: "O=90%+, A+=80–89%, A=70–79%, B+=60–69%, B=50–59%, C=40–49%, F=below 40%. These are standard Indian grading benchmarks.",
      },
      {
        q: "Should I take more mock tests before boards?",
        a: "Yes. Mock tests simulate exam conditions and improve time management. At least 3–5 full mock tests per subject is recommended before board exams.",
      },
    ],
  },
  {
    id: "emi",
    path: "/emi-calculator",
    icon: "💳",
    name: "EMI Calculator",
    shortName: "EMI",
    desc: "Monthly instalment",
    tag: "💳 Finance",
    subtitle: "Know your monthly instalment, total interest, and total repayment instantly.",
    seo: {
      title: "EMI Calculator – Monthly Loan Instalment Calculator | Filtero",
      description:
        "Calculate your EMI (Equated Monthly Instalment) instantly. Enter loan amount, interest rate, and tenure to get monthly EMI, total interest, and total payment.",
      canonical: "https://tools.filterero.in/emi-calculator",
    },
    faqs: [
      {
        q: "How is EMI calculated?",
        a: "EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P = principal, r = monthly interest rate (annual rate ÷ 12 ÷ 100), n = tenure in months.",
      },
      {
        q: "Does a higher interest rate always mean higher EMI?",
        a: "Yes. For the same loan amount and tenure, a higher interest rate results in a higher EMI and significantly more total interest paid over time.",
      },
      {
        q: "What happens if I increase my loan tenure?",
        a: "Longer tenure reduces your monthly EMI but increases the total interest you pay. Shorter tenure means higher EMI but less total interest.",
      },
      {
        q: "Can I prepay my loan to reduce EMI?",
        a: "Most lenders allow prepayment. This reduces your outstanding principal, which lowers subsequent EMIs or shortens your tenure depending on your loan terms.",
      },
    ],
  },
  {
    id: "salary",
    path: "/salary-calculator",
    icon: "💰",
    name: "Salary Calculator",
    shortName: "Salary",
    desc: "Take-home pay",
    tag: "💰 Finance",
    subtitle: "Estimate your take-home salary after taxes (New Tax Regime, FY 2025-26).",
    seo: {
      title: "Salary Calculator India – In-Hand Salary After Tax | Filtero",
      description:
        "Calculate your monthly in-hand salary after income tax (New Tax Regime FY 2025-26), PF deduction, and cess. Free Indian salary take-home calculator.",
      canonical: "https://tools.filterero.in/salary-calculator",
    },
    faqs: [
      {
        q: "How is in-hand salary calculated from CTC?",
        a: "In-hand salary = CTC − Income Tax − PF Contribution − other deductions. Tax is calculated on taxable income using the applicable slab rates.",
      },
      {
        q: "What is the New Tax Regime for FY 2025-26?",
        a: "New regime slabs: 0% up to ₹3L, 5% (₹3L–6L), 10% (₹6L–9L), 15% (₹9L–12L), 20% (₹12L–15L), 30% above ₹15L. Plus 4% health & education cess.",
      },
      {
        q: "What is PF deduction?",
        a: "Employee PF = 12% of basic salary. Our calculator caps this at ₹21,600/year (₹1,800/month) in line with EPF wage ceiling. Employer contribution is separate.",
      },
      {
        q: "Old vs New Tax Regime — which is better?",
        a: "The New Regime offers lower rates but no deductions (80C, HRA, etc.). Old Regime is better if your total deductions exceed ₹1.5L. Use both to compare.",
      },
    ],
  },
  {
    id: "loan",
    path: "/loan-calculator",
    icon: "🏦",
    name: "Loan Calculator",
    shortName: "Loan",
    desc: "Repayment calc",
    tag: "🏦 Finance",
    subtitle: "Calculate simple and compound interest repayments on any loan.",
    seo: {
      title: "Loan Calculator – Simple & Compound Interest Repayment | Filtero",
      description:
        "Calculate total loan repayment with both simple and compound interest. Enter principal, interest rate, and duration to instantly see your repayment amount.",
      canonical: "https://tools.filterero.in/loan-calculator",
    },
    faqs: [
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is calculated only on the principal: SI = P × R × T. Compound interest is calculated on principal plus accumulated interest, growing faster over time.",
      },
      {
        q: "Which type of interest do most loans use?",
        a: "Most bank loans (home, personal, education) use compound interest. Fixed deposits and some government schemes use simple interest.",
      },
      {
        q: "How do I calculate total loan repayment?",
        a: "For simple interest: Total = P + (P × R × T). For compound interest: Total = P × (1 + R)^T. Where P=principal, R=annual rate as decimal, T=years.",
      },
      {
        q: "Is compound interest always worse for borrowers?",
        a: "Yes, as a borrower. But as an investor or saver, compound interest works in your favour — your savings grow faster. It's the same principle working both ways.",
      },
    ],
  },
  {
    id: "wordcounter",
    path: "/word-counter",
    icon: "📄",
    name: "Word Counter",
    shortName: "Word Counter",
    desc: "Live text stats",
    tag: "📄 Writing",
    subtitle: "Paste your text and get live word, character, sentence, and reading time stats.",
    seo: {
      title: "Word Counter – Live Word, Character & Reading Time Counter | Filtero",
      description:
        "Free online word counter for students and writers. Get instant word count, character count, sentence count, paragraph count, and estimated reading time.",
      canonical: "https://tools.filterero.in/word-counter",
    },
    faqs: [
      {
        q: "How is reading time calculated?",
        a: "Reading time = Words ÷ 200 (rounded up). The average adult reads around 200 words per minute. So a 1000-word essay takes about 5 minutes to read.",
      },
      {
        q: "Does the word counter count hyphenated words as one or two?",
        a: "Hyphenated words like 'self-study' are counted as one word since they're joined without spaces. The counter splits on whitespace.",
      },
      {
        q: "What counts as a sentence?",
        a: "Sentences are split on full stops, exclamation marks, and question marks (.!?). Multiple consecutive punctuation marks are treated as one sentence end.",
      },
      {
        q: "How are paragraphs counted?",
        a: "Paragraphs are separated by double line breaks. Single line breaks within a block of text are not counted as paragraph separators.",
      },
    ],
  },
  {
    id: "studytimer",
    path: "/study-timer",
    icon: "⏱",
    name: "Study Timer",
    shortName: "Study Timer",
    desc: "Stopwatch focus",
    tag: "⏱ Productivity",
    subtitle: "Track how long you've been studying in a clean, distraction-free timer.",
    seo: {
      title: "Study Timer – Online Stopwatch for Students | Filtero",
      description:
        "Free online study timer and stopwatch for students. Track your study sessions with a clean, distraction-free interface. Start, pause, and reset with one click.",
      canonical: "https://tools.filterero.in/study-timer",
    },
    faqs: [
      {
        q: "How long should a study session be?",
        a: "Research suggests 45–90 minute focused study sessions work best. After that, take a 10–15 minute break before starting another session.",
      },
      {
        q: "What is the best way to track study time?",
        a: "Use a timer to measure active study time (not including breaks). Aim for 4–6 focused hours of study per day rather than long unfocused sessions.",
      },
      {
        q: "Should I study in one long session or multiple short ones?",
        a: "Multiple shorter sessions (spaced practice) are scientifically proven to be more effective for retention than one long cramming session.",
      },
      {
        q: "How many hours should a student study per day?",
        a: "It depends on your goals. For competitive exams, 6–10 focused hours is common. For regular college, 3–5 hours of focused study is typically sufficient.",
      },
    ],
  },
  {
    id: "pomodoro",
    path: "/pomodoro",
    icon: "🍅",
    name: "Pomodoro Timer",
    shortName: "Pomodoro",
    desc: "25-min focus",
    tag: "🍅 Productivity",
    subtitle: "Stay focused with timed work and break cycles using the Pomodoro technique.",
    seo: {
      title: "Pomodoro Timer – 25-Minute Focus Timer for Students | Filtero",
      description:
        "Free online Pomodoro timer for students. Work in 25-minute focus sessions with 5-minute breaks. Includes session tracking and long break reminders.",
      canonical: "https://tools.filterero.in/pomodoro",
    },
    faqs: [
      {
        q: "What is the Pomodoro technique?",
        a: "The Pomodoro technique is a time management method: work for 25 minutes, take a 5-minute break, repeat. After 4 sessions, take a longer 15–30 minute break.",
      },
      {
        q: "Why does the Pomodoro technique work?",
        a: "It breaks work into manageable intervals, prevents mental fatigue, creates urgency with a countdown, and builds in regular recovery to maintain focus over longer periods.",
      },
      {
        q: "Can I change the Pomodoro timer duration?",
        a: "Our timer follows the classic 25/5/15 minute structure. Research shows this specific interval is optimal for most people's attention spans.",
      },
      {
        q: "How many Pomodoro sessions should I do per day?",
        a: "Most practitioners do 8–12 Pomodoros per day (4–6 hours of focused work). Quality over quantity — fewer focused Pomodoros beat many distracted ones.",
      },
    ],
  },
  {
    id: "converter",
    path: "/unit-converter",
    icon: "📐",
    name: "Unit Converter",
    shortName: "Unit Converter",
    desc: "Length/weight/temp",
    tag: "📐 Utility",
    subtitle: "Convert length, weight, and temperature between common units instantly.",
    seo: {
      title: "Unit Converter – Length, Weight & Temperature | Filtero",
      description:
        "Free online unit converter for students. Convert length (meters, miles, feet), weight (kg, pounds, grams), and temperature (Celsius, Fahrenheit, Kelvin) instantly.",
      canonical: "https://tools.filterero.in/unit-converter",
    },
    faqs: [
      {
        q: "How do I convert Celsius to Fahrenheit?",
        a: "Formula: °F = (°C × 9/5) + 32. For example, 100°C = 212°F. To go the other way: °C = (°F − 32) × 5/9.",
      },
      {
        q: "How many kilometers are in a mile?",
        a: "1 mile = 1.60934 kilometers. So 10 miles ≈ 16.09 km. Conversely, 1 km = 0.62137 miles.",
      },
      {
        q: "How do I convert kg to pounds?",
        a: "1 kilogram = 2.20462 pounds. Multiply your kg value by 2.20462 to get pounds. To convert pounds to kg, divide by 2.20462.",
      },
      {
        q: "What is Kelvin and how does it relate to Celsius?",
        a: "Kelvin is the SI unit of temperature. K = °C + 273.15. 0 K (absolute zero) = −273.15°C, and 0°C = 273.15 K. Kelvin has no negative values.",
      },
    ],
  },
  {
    id: "age",
    path: "/age-calculator",
    icon: "🎂",
    name: "Age Calculator",
    shortName: "Age",
    desc: "Exact age & birthday",
    tag: "🎂 Utility",
    subtitle: "Find your exact age in years, months, and days — plus when your next birthday is.",
    seo: {
      title: "Age Calculator – Find Your Exact Age in Years, Months & Days | Filtero",
      description:
        "Free online age calculator. Enter your date of birth to instantly find your exact age in years, months, and days, plus how many days until your next birthday.",
      canonical: "https://tools.filterero.in/age-calculator",
    },
    faqs: [
      {
        q: "How is exact age calculated?",
        a: "Exact age subtracts your birth date from today, accounting for month and day boundaries. It gives years, remaining months, and remaining days separately.",
      },
      {
        q: "How many days until my next birthday?",
        a: "The calculator finds your next birthday (either this year or next) and counts the exact number of days from today. If today is your birthday, it shows 0.",
      },
      {
        q: "What day of the week was I born on?",
        a: "The age calculator shows the day of the week for your date of birth — Sunday through Saturday — using JavaScript's native Date object.",
      },
      {
        q: "Can I calculate age for any past date?",
        a: "Yes. Enter any historical date of birth and the calculator will compute the age relative to today's date. Future dates are not allowed.",
      },
    ],
  },
];

// Quick lookup by path
export const TOOL_BY_PATH = Object.fromEntries(TOOLS.map((t) => [t.path, t]));
