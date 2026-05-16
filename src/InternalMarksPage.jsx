import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import InternalMarksCalc from "./InternalMarksCalc";
const tool = TOOLS.find(t => t.id === "internal");

export default function InternalMarksPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <InternalMarksCalc />
    </ToolPageLayout>
  );
}
