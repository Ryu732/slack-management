'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/app/components/header";
import StartTask from "@/app/start/_components/startTask";
import { Project } from "@/app/lib/fetchProject";
import postProject, { post_project } from '@/app/lib/postProject';

type Props = {
    initialProjects: Project[];
};

export default function ProjectPageClient({ initialProjects }: Props) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0]?.id || "");
    const router = useRouter();

    // プロジェクトが追加された後にUIを更新する処理
    const handleAddProject = async (projectName: string) => {
        const newProject: post_project = {
            name: projectName,
            description: '', // 必要に応じて
        };

        try {
            await postProject(newProject);
            // サーバーのデータを再取得してUIを更新
            router.refresh(); 
        } catch (error) {
            console.error("Failed to add project:", error);
            // ここでユーザーにエラーを通知することもできます
        }
    };

    return (
        <>
            <Header
                projects={initialProjects}
                onProjectChange={(projectId) => setSelectedProjectId(projectId)}
                onAddProject={handleAddProject}
            />
            {selectedProjectId && (
                <StartTask project_id={selectedProjectId as `${string}-${string}-${string}-${string}-${string}`} />
            )}
        </>
    );
}