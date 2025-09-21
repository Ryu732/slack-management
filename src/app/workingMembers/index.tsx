import type { UUID } from "node:crypto"; // UUIDの型をインポート
import { Box, Paper, Typography } from "@mui/material";
import Status from "./components/status";

// --- データ構造とモックデータ ---
interface WorkLog {
	id: UUID;
	user_name: string;
	planned_task: string;
	actual_task?: string;
	status: "working" | "completed" | "paused";
	started_at: string;
	ended_at?: string;
	duration_minutes?: number;
	tags: string[];
}

const mockWorkLogs: WorkLog[] = [
	{
		id: "a1b2c3d4-e5f6-7890-1234-567890abcdef" as UUID,
		user_name: "山田 太郎",
		planned_task: "コンポーネントAの設計",
		status: "working",
		started_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
		tags: ["設計", "フロントエンド"],
	},
	{
		id: "b2c3d4e5-f6a7-8901-2345-67890abcdef0" as UUID,
		user_name: "鈴木 花子",
		planned_task: "APIのドキュメント作成",
		status: "working",
		started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		tags: ["ドキュメント", "API"],
	},
	{
		id: "c3d4e5f6-a7b8-9012-3456-7890abcdef01" as UUID,
		user_name: "佐藤 次郎",
		planned_task: "E2Eテストの実装",
		status: "working",
		started_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
		tags: ["テスト", "QA"],
	},
	// --- データを追加してスクロールを確認 ---
	{
		id: "d4e5f6a7-b8c9-0123-4567-890abcdef012" as UUID,
		user_name: "伊藤 さくら",
		planned_task: "データベースのバックアップ設定",
		status: "working",
		started_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		tags: ["インフラ", "DB"],
	},
	{
		id: "e5f6a7b8-c9d0-1234-5678-90abcdef0123" as UUID,
		user_name: "渡辺 健太",
		planned_task: "UIデザインのレビュー",
		status: "working",
		started_at: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
		tags: ["デザイン", "レビュー"],
	},
];

// --- メインコンポーネント ---
export default function WorkingMembers() {
	return (
		<Box sx={{ p: 2 }}>
			<Paper
				elevation={0}
				sx={{
					p: 3,
					borderRadius: "16px",
					backgroundColor: "#f7f9fc",
					border: "1px solid #e0e0e0",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
					<Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
						現在作業中のメンバー
					</Typography>
					<Box
						sx={{
							width: 8,
							height: 8,
							bgcolor: "success.main",
							borderRadius: "50%",
							ml: 1,
						}}
					/>
				</Box>

				<Box
					sx={{
						height: "400px",
						overflowY: "auto",
						pr: 1,
					}}
				>
					{mockWorkLogs.map((log) => (
						<Status key={log.id} workLog={log} />
					))}
				</Box>
			</Paper>
		</Box>
	);
}
