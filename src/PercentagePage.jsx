import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import PercentageCalc from "./PercentageCalc";

const tool = TOOLS.find(t => t.id === "percentage");

export default function PercentagePage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <PercentageCalc />
    </ToolPageLayout>
  );
}
