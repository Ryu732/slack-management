import { WorkLog } from "@/app/history/_types/workLog";
import { UUID } from "crypto";

// APIからのレスポンス全体の型 (API Endpoint #11)
type WorkLogResponse = {
    sessions: WorkLog[];
    total: number;
    has_more: boolean;
};

export async function fetchWorkLogs(projectId: string | UUID): Promise<WorkLog[]> {
    // API仕様に合わせてエンドポイントを修正
    const response = await fetch(`/api/projects/${projectId}/sessions`);

    if (!response.ok) {
        throw new Error("Failed to fetch work logs");
    }

    const data: WorkLogResponse = await response.json();

    // sessions 配列を返す
    return data.sessions || [];
}