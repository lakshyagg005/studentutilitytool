import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Pages
import HomePage from "./HomePage";
import AttendancePage from "./AttendancePage";
import CGPAPage from "./CGPAPage";
import PercentagePage from "./PercentagePage";
import InternalMarksPage from "./InternalMarksPage";
import BoardPredictorPage from "./BoardPredictorPage";
import EMIPage from "./EMIPage";
import SalaryPage from "./SalaryPage";
import LoanPage from "./LoanPage";
import WordCounterPage from "./WordCounterPage";
import StudyTimerPage from "./StudyTimerPage";
import PomodoroPage from "./PomodoroPage";
import UnitConverterPage from "./UnitConverterPage";
import AgeCalcPage from "./AgeCalcPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── HOME ─── */}
        <Route path="/" element={<HomePage />} />

        {/* ─── ACADEMIC ─── */}
        <Route path="/attendance-calculator" element={<AttendancePage />} />
        <Route path="/cgpa-calculator" element={<CGPAPage />} />
        <Route path="/percentage-calculator" element={<PercentagePage />} />
        <Route path="/internal-marks-calculator" element={<InternalMarksPage />} />
        <Route path="/board-result-predictor" element={<BoardPredictorPage />} />

        {/* ─── FINANCE ─── */}
        <Route path="/emi-calculator" element={<EMIPage />} />
        <Route path="/salary-calculator" element={<SalaryPage />} />
        <Route path="/loan-calculator" element={<LoanPage />} />

        {/* ─── PRODUCTIVITY ─── */}
        <Route path="/word-counter" element={<WordCounterPage />} />
        <Route path="/study-timer" element={<StudyTimerPage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />

        {/* ─── UTILITY ─── */}
        <Route path="/unit-converter" element={<UnitConverterPage />} />
        <Route path="/age-calculator" element={<AgeCalcPage />} />

        {/* ─── 404 FALLBACK ─── */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
