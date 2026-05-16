import { useSEO } from "./useSEO";
import { TOOLS } from "./toolsData";
import ToolPageLayout from "./ToolPageLayout";
import AttendanceCalc from "./AttendanceCalc";

const tool = TOOLS.find(t => t.id === "attendance");

export default function AttendancePage() {
  useSEO(tool.seo);
  return (
    <ToolPageLayout tool={tool}>
      <AttendanceCalc />
    </ToolPageLayout>
  );
}
