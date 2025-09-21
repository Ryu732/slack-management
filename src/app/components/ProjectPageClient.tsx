'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

// --- コンポーネントのインポート ---
import Header from "@/app/components/header";
import StartTask from "@/app/start/_components/startTask";
import WorkLogHistory from "@/app/history/_components/WorkLogHistory";
import Finish from '@/app/finish/index';
import WorkingMembers from '@/app/workingMembers/index';

// --- 型定義のインポート ---
import { Project } from "@/app/lib/fetchProject";
import postProject, { post_project } from '@/app/lib/postProject';
import { Tag } from "@/app/start/_types/tag";
import { WorkLog } from "@/app/history/_types/workLog";
import { Member } from "@/app/history/_types/member";

// --- API関数のインポート ---
import { fetchTags } from "@/app/start/_lib/fetchTags";
import { fetchWorkLogs } from "@/app/history/_lib/fetchWorkLogs";


type Props = {
    initialProjects: Project[];
};

export default function ProjectPageClient({ initialProjects }: Props) {
    // --- 必要な State をすべて定義 ---
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0]?.id || "");
    const [tags, setTags] = useState<Tag[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true); // ローディング状態を1つに統一
    const router = useRouter();

    // --- データ取得ロジックを統合 ---
    useEffect(() => {
        if (!selectedProjectId) {
            setIsLoading(false);
            return;
        }

        const loadProjectData = async () => {
            setIsLoading(true);
            try {
                // タグ一覧と作業履歴を並行して効率的に取得
                const [tagsData, workLogsData] = await Promise.all([
                    fetchTags(selectedProjectId as `${string}-${string}-${string}-${string}-${string}`),
                    fetchWorkLogs(selectedProjectId)
                ]);
                
                setTags(tagsData);
                setWorkLogs(workLogsData);

                // 作業履歴からユニークなメンバーのリストを生成
                const uniqueMemberNames = [...new Set(workLogsData.map(log => log.user_name))];
                const memberList = uniqueMemberNames.map(name => ({ id: name, name: name }));
                setMembers(memberList);

            } catch (error) {
                console.error("Failed to load project data:", error);
                // エラー時もstateを初期化
                setTags([]);
                setWorkLogs([]);
                setMembers([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjectData();
    }, [selectedProjectId]);

    // プロジェクト追加のロジック (変更なし)
    const handleAddProject = async (projectName: string) => {
        const newProject: post_project = {
            name: projectName,
            description: '',
        };

        try {
            await postProject(newProject);
            router.refresh(); 
        } catch (error) {
            console.error("Failed to add project:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                projects={initialProjects}
                onProjectChange={setSelectedProjectId}
                onAddProject={handleAddProject}
            />
            {/* --- 統合されたメインコンテンツ --- */}
            <main className="p-4 md:p-8">
                {selectedProjectId && !isLoading ? (
                    // 2カラムレイアウトで表示
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 左カラム: 作業開始フォームなど */}
                        <div className="space-y-8">
                            <StartTask tags={tags} project_id={selectedProjectId as `${string}-${string}-${string}-${string}-${string}`} />
                            <Finish />
                        </div>
                        {/* 右カラム: 作業履歴 */}
                        <div>
                            <WorkLogHistory workLogs={workLogs} allTags={tags} members={members} />
                        </div>
                        {/* ページ下部: 作業中メンバー (広い画面では2カラムにまたがる) */}
                        <div className="lg:col-span-2">
                            <WorkingMembers />
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-16 text-gray-500">
                        { selectedProjectId ? 'プロジェクトデータを読み込み中...' : 'プロジェクトを選択してください。'}
                    </div>
                )}
            </main>
        </div>
    );
}

