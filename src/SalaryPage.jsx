import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import SalaryCalc from "./SalaryCalc";

const tool = TOOLS.find(t => t.id === "salary");

export default function SalaryPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <SalaryCalc />
    </ToolPageLayout>
  );
}
