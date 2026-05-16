import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import WordCounter from "./WordCounter";

const tool = TOOLS.find(t => t.id === "wordcounter");

export default function WordCounterPage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <WordCounter />
    </ToolPageLayout>
  );
}
