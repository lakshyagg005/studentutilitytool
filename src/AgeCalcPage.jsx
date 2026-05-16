import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import AgeCalc from "./AgeCalc";

const tool = TOOLS.find(t => t.id === "age");

export default function AgeCalcPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <AgeCalc />
    </ToolPageLayout>
  );
}
