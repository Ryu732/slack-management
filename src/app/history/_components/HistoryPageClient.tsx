'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "@/app/components/header";
import WorkLogHistory from "@/app/history/_components/WorkLogHistory";
import { WorkLog } from "@/app/history/_types/workLog";
import { Member } from "@/app/history/_types/member";
import { Project } from "@/app/lib/fetchProject";
import { Tag } from "@/app/start/_types/tag";
import postProject, { post_project } from '@/app/lib/postProject';
import { fetchTags } from "@/app/start/_lib/fetchTags";
import { fetchWorkLogs } from "@/app/history/_lib/fetchWorkLogs";

type Props = {
    initialProjects: Project[];
};

export default function HistoryPageClient({ initialProjects }: Props) {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0]?.id || "");
    const [tags, setTags] = useState<Tag[]>([]);
    const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!selectedProjectId) {
            setIsLoading(false);
            return;
        }

        const loadProjectData = async () => {
            setIsLoading(true);
            try {
                // タグ一覧と作業履歴を並行して取得
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
            <main className="p-4 md:p-8">
                {selectedProjectId && !isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            {/* WorkLogHistory に allTags としてタグ情報を渡す */}
                            <WorkLogHistory workLogs={workLogs} allTags={tags} members={members} />
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