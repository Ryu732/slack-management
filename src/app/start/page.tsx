import { fetchProjects } from "@/app/lib/fetchProject";
import ProjectPageClient from "@/app/components/ProjectPageClient";
import { fetchTags } from "./_lib/fetchTags";


export default async function Home() {
    // サーバーサイドでプロジェクト一覧を非同期に取得
    const projects = await fetchProjects();
    // 取得したデータをクライアントコンポーネントに渡してレンダリング
    return <ProjectPageClient initialProjects={projects} />;
}