import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import BoardPredictor from "./BoardPredictor";

const tool = TOOLS.find(t => t.id === "board");

export default function BoardPredictorPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <BoardPredictor />
    </ToolPageLayout>
  );
}
