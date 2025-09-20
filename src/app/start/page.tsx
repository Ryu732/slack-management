'use client';

import React, { useState } from "react";
import StartTask from "@/app/start/_components/startTask";
import Header from "@/app/components/header";

type Project = {
    id: string;
    name: string;
};

export default function Home() {
    const [selectedProjectId, setSelectedProjectId] = useState<`${string}-${string}-${string}-${string}-${string}` | "">("");

    // サンプルのプロジェクト一覧（実際にはサーバーから取得するなど）
    const projects: Project[] = [
        { id: "", name: "プロジェクトを選択" },
        { id: "11111111-1111-1111-1111-111111111111", name: "プロジェクトA" },
        { id: "22222222-2222-2222-2222-222222222222", name: "プロジェクトB" },
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
