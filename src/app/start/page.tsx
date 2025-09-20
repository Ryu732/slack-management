'use client';

import React, { useState } from "react";
import StartTask from "@/app/start/_components/startTask";
import Header from "@/app/components/header";
import { Project } from "@/app/lib/fetchProject";
// import fetchProject from "@/app/lib/fetchProject"


export default function Home() {
    const [selectedProjectId, setSelectedProjectId] = useState<`${string}-${string}-${string}-${string}-${string}` | "">("");

    // サンプルのプロジェクト一覧（実際にはサーバーから取得する）
    // const projects: Project[] = await fetchProject();
    const projects: Project[] = [
        {
            id: "11111111-1111-1111-1111-111111111111", name: "プロジェクトA",
            description: "",
            is_active: true,
            created_at: "",
            member_count: 0,
            active_session_count: 0
        },
        {
            id: "22222222-2222-2222-2222-222222222222", name: "プロジェクトB",
            description: "",
            is_active: true,
            created_at: "",
            member_count: 0,
            active_session_count: 0
        },
    ];

    return (
        <>
            <Header
                projects={projects}
                onProjectChange={(projectId) => setSelectedProjectId(projectId as `${string}-${string}-${string}-${string}-${string}`)}
            />
            {selectedProjectId && (
                <StartTask project_id={selectedProjectId} />
            )}
        </>
    );
}
