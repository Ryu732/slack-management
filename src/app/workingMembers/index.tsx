import { Box, Paper, Typography } from "@mui/material";
import Status from "./components/status";

// モックデータ
const mockData = {
	sessions: [
		{
			id: "session-001",
			user_name: "佐藤 太郎",
			planned_task: "APIエンドポイントの実装",
			elapsed_minutes: 30,
		},
		{
			id: "session-002",
			user_name: "鈴木 花子",
			planned_task: "データベース設計の見直し",
			elapsed_minutes: 60, // 1時間
		},
		{
			id: "session-003",
			user_name: "田中 優",
			planned_task: "UIコンポーネントの作成",
			elapsed_minutes: 15,
		},
		{
			id: "session-004",
			user_name: "佐藤 太郎",
			planned_task: "APIエンドポイントの実装",
			elapsed_minutes: 30,
		},
		{
			id: "session-005",
			user_name: "鈴木 花子",
			planned_task: "データベース設計の見直し",
			elapsed_minutes: 60, // 1時間
		},
		{
			id: "session-006",
			user_name: "田中 優",
			planned_task: "UIコンポーネントの作成",
			elapsed_minutes: 15,
		},
	],
};

// --- メインコンポーネント ---

export default function WorkingMembers() {
	const { sessions } = mockData;

	return (
		<Box>
			<Paper
				elevation={3}
				sx={{
					padding: "2rem",
					textAlign: "center",
				}}
			>
				<Typography variant="h5" component="h1" gutterBottom>
					現在作業中のメンバー
				</Typography>

				{/* このBoxがスクロールコンテナになります */}
				<Box
					sx={{
						maxHeight: "70vh", // コンポーネントの最大高を画面の70%に制限
						overflowY: "auto", // 縦方向のコンテンツがはみ出たらスクロールバーを表示
					}}
				>
					{sessions.map((session) => (
						<Status key={session.id} session={session} />
					))}
				</Box>
			</Paper>
		</Box>
	);
}
