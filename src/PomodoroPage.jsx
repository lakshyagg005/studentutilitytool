import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import PomodoroTimer from "./PomodoroTimer";

const tool = TOOLS.find(t => t.id === "pomodoro");

export default function PomodoroPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <PomodoroTimer />
    </ToolPageLayout>
  );
}
