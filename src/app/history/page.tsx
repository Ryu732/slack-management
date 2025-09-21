export const dynamic = "force-dynamic";

import { fetchProjects } from "@/app/lib/fetchProject";
import HistoryPageClient from "@/app/history/_components/HistoryPageClient";

export default async function Home() {
  // サーバーサイドでプロジェクト一覧のみ取得
  const projects = await fetchProjects();

  return <HistoryPageClient initialProjects={projects} />;
}
