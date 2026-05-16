import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import EMICalc from "./EMICalc";

const tool = TOOLS.find(t => t.id === "emi");

export default function EMIPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <EMICalc />
    </ToolPageLayout>
  );
}
