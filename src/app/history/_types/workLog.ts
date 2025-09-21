import { UUID } from "crypto";

export type WorkLog = {
    id: UUID;
    user_name: string;
    planned_task: string;
    actual_task?: string; // 無い場合もある
    status: "working" | "completed" | "paused";
    started_at: string; // ISO 8601形式の文字列
    ended_at?: string; // 無い場合もある
    duration_minutes?: number;
    tags: string[]; // タグ名の配列
};