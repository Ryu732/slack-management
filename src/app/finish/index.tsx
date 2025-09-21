"use client";

import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// APIから返されるセッションの型定義
interface Session {
	id: string;
	user_name: string;
	planned_task: string;
	started_at: string;
	elapsed_minutes: number;
	tags: string[];
}

// モックデータ
const _mockSessions: Session[] = [
	{
		id: "session-001",
		user_name: "山田太郎",
		planned_task: "フロントエンドの改修",
		started_at: "2024-01-20T10:00:00Z",
		elapsed_minutes: 60,
		tags: ["フロントエンド", "React"],
	},
	{
		id: "session-002",
		user_name: "佐藤花子",
		planned_task: "APIエンドポイントの実装",
		started_at: "2024-01-20T11:00:00Z",
		elapsed_minutes: 30,
		tags: ["バックエンド", "API"],
	},
	{
		id: "session-003",
		user_name: "鈴木次郎",
		planned_task: "データベース設計",
		started_at: "2024-01-20T09:30:00Z",
		elapsed_minutes: 120,
		tags: ["バックエンド", "データベース"],
	},
];

// データフェッチをここに書きたい。今はモックでーたをかえす
const fetchActiveSessions = async (_projectId: string) => {
	console.log("APIの代わりにモックデータを返します。");
	return _mockSessions;
};

// 指定されたセッションを終了する関数
const endSession = async (sessionId: string) => {
	// ... (この関数の中身は変更なし)
	console.log(`Ending session with ID: ${sessionId}`);
	return { success: true };
};

export default function Finish() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [selectedSessionId, setSelectedSessionId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [submitting, setSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const loadSessions = async () => {
			setLoading(true);
			const activeSessions = await fetchActiveSessions("project-123");
			setSessions(activeSessions);
			setLoading(false);
		};
		loadSessions();
	}, []);

	const handleSessionChange = (event: any) => {
		setSelectedSessionId(event.target.value as string);
	};

	const handleFinishSession = async () => {
		if (!selectedSessionId) {
			alert("終了するセッションを選択してください。");
			return;
		}
		setSubmitting(true);
		const result = await endSession(selectedSessionId);
		if (result.success) {
			alert(`セッション (ID: ${selectedSessionId}) を終了しました。`);
			setSessions(sessions.filter((s) => s.id !== selectedSessionId));
			setSelectedSessionId("");
		} else {
			alert("セッションの終了に失敗しました。");
		}
		setSubmitting(false);
	};

	return (
		// 修正点1: 親のBoxからレイアウトを壊すスタイルを削除
		<Box>
			<Paper
				elevation={3}
				sx={{
					padding: "2rem",
					width: "100%",

					height: "100%",
					textAlign: "center",
				}}
			>
				<Typography variant="h5" component="h1" gutterBottom>
					作業セッションの終了
				</Typography>
				{loading ? (
					<Box sx={{ my: 4 }}>
						<CircularProgress />
						<Typography>アクティブなセッションを取得中...</Typography>
					</Box>
				) : (
					<FormControl fullWidth sx={{ my: 3 }}>
						<InputLabel id="session-select-label">
							終了するセッションを選択
						</InputLabel>
						<Select
							labelId="session-select-label"
							value={selectedSessionId}
							label="終了するセッションを選択"
							onChange={handleSessionChange}
							disabled={sessions.length === 0}
						>
							{sessions.map((session) => (
								<MenuItem key={session.id} value={session.id}>
									{`${session.user_name} - ${session.planned_task}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				<Button
					variant="contained"
					color="primary"
					onClick={handleFinishSession}
					disabled={!selectedSessionId || submitting || loading}
					fullWidth
					sx={{ position: "relative" }}
				>
					{submitting && (
						<CircularProgress
							size={24}
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								marginTop: "-12px",
								marginLeft: "-12px",
							}}
						/>
					)}
					{submitting ? "終了処理中..." : "作業を終了する"}
				</Button>
			</Paper>
		</Box>
	);
}
