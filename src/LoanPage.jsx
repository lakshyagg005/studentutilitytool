import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import LoanCalc from "./LoanCalc";

const tool = TOOLS.find(t => t.id === "loan");

export default function LoanPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <LoanCalc />
    </ToolPageLayout>
  );
}
