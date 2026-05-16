import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import CGPACalc from "./CGPACalc";

const tool = TOOLS.find(t => t.id === "cgpa");

export default function CGPAPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <CGPACalc />
    </ToolPageLayout>
  );
}
