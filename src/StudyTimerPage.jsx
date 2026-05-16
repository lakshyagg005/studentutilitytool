import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import StudyTimer from "./StudyTimer";

const tool = TOOLS.find(t => t.id === "studytimer");

export default function StudyTimerPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <StudyTimer />
    </ToolPageLayout>
  );
}
