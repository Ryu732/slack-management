'use client';

import React, { useState, useEffect } from "react"; // useEffect をインポート
import { useRouter } from 'next/navigation';
import Header from "@/app/components/header";
import StartTask from "@/app/start/_components/startTask";
import { Project } from "@/app/lib/fetchProject";
import { Tag } from "@/app/start/_types/tag";
import postProject, { post_project } from '@/app/lib/postProject';

type Props = {
    initialProjects: Project[];
};

export default function ProjectPageClient({ initialProjects }: Props) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0]?.id || "");
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // プロジェクトIDが選択されている場合のみ、タグの取得処理を実行
        if (selectedProjectId) {
            const fetchTagsForProject = async () => {
                setIsLoadingTags(true);
                try {
                    const response = await fetch(`/api/projects/${selectedProjectId}/tags`);
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    const data = await response.json();

                    // ★★★ ここが最も重要な修正点です ★★★
                    // APIから返される { tags: [...] } というオブジェクトの中から、
                    // .tags プロパティ（タグの配列）を取り出してセットします。
                    // data.tags が存在しない場合に備え、|| [] で空の配列を保証します。
                    setTags(data.tags || []);
                    
                    // デバッグ用: ブラウザのコンソール（F12）で何がセットされたか確認できます

                } catch (error) {
                    console.error("Failed to fetch tags:", error);
                    setTags([]); // エラーが発生した場合は安全のためにタグを空にする
                } finally {
                    setIsLoadingTags(false);
                }
            };
            fetchTagsForProject();
        } else {
            // プロジェクトIDが選択されていない場合はタグを空にする
            setTags([]);
            setIsLoadingTags(false);
        }
    }, [selectedProjectId]);

    // プロジェクト追加のロジック（変更なし）
    const handleAddProject = async (projectName: string) => {
        const newProject: post_project = {
            name: projectName,
            description: '', // 必要に応じて
        };

        try {
            await postProject(newProject);
            router.refresh(); 
        } catch (error) {
            console.error("Failed to add project:", error);
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
                isLoadingTags ? (
                    <p className="p-8 text-center text-gray-500">タグを読み込み中...</p>
                ) : (
                    <StartTask tags={tags} project_id={selectedProjectId as `${string}-${string}-${string}-${string}-${string}`} />
                )
            )}
        </>
    );
}