import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import UnitConverter from "./UnitConverter";

const tool = TOOLS.find(t => t.id === "converter");

export default function UnitConverterPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <UnitConverter />
    </ToolPageLayout>
  );
}
