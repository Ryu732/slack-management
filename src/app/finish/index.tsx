"use client";
import type { UUID } from "node:crypto";
export const dynamic = "force-dynamic";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // アイコンをインポート
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

// APIから返されるworkの型定義
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

// モックデータ
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
];

const endWork = async (_sessionId: string): Promise<{ success: boolean }> => {
	return { success: true };
};

export default function Finish() {
	const [works, setWorks] = useState<WorkLog[]>([]);
	const [selectedWorkId, setSelectedWorkId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [submitting, setSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const loadWorks = () => {
			setLoading(true);

			setWorks(mockWorkLogs);
			setLoading(false);
		};
		loadWorks();
	}, []);

	const handleWorkChange = (event: any) => {
		setSelectedWorkId(event.target.value as string);
	};

	const handleFinishWork = async () => {
		if (!selectedWorkId) {
			alert("終了する作業を選択してください。");
			return;
		}
		setSubmitting(true);
		const result = await endWork(selectedWorkId);
		if (result.success) {
			alert(`作業 (ID: ${selectedWorkId}) を終了しました。`);
			setWorks(works.filter((w) => w.id !== selectedWorkId));
			setSelectedWorkId("");
		} else {
			alert("作業の終了に失敗しました。");
		}
		setSubmitting(false);
	};

	return (
		// 全体を中央に配置するためのBox
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2, // パディング
			}}
		>
			<Paper
				elevation={0} // 影をなくし、代わりに枠線をつける
				sx={{
					p: 4, // 内側のパディングを増やす
					borderRadius: "16px", // 角を丸くする
					width: "100%",
					maxWidth: "600px", // 最大幅を設定
					border: "1px solid #e0e0e0", // 枠線を追加
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: "12px",
							background: "linear-gradient(45deg, #4d7cff 30%, #ffc107 90%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							mr: 2,
							flexShrink: 0,
						}}
					>
						<Box
							sx={{
								width: 20,
								height: 20,
								bgcolor: "white",
								borderRadius: "4px",
							}}
						/>
					</Box>

					<Box>
						<Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
							作業を終了
						</Typography>
						<Typography variant="body2" color="text.secondary">
							進捗をチームに共有します
						</Typography>
					</Box>
				</Box>

				{/* === コンテンツ部分 === */}
				{loading ? (
					<Box sx={{ my: 4, textAlign: "center" }}>
						<CircularProgress />
						<Typography sx={{ mt: 1 }}>アクティブな作業を取得中...</Typography>
					</Box>
				) : (
					<FormControl fullWidth sx={{ my: 2 }}>
						<InputLabel id="work-select-label">終了する作業を選択</InputLabel>
						<Select
							labelId="work-select-label"
							value={selectedWorkId}
							label="終了する作業を選択"
							onChange={handleWorkChange}
							disabled={works.length === 0}
						>
							{works.length > 0 ? (
								works.map((work) => (
									<MenuItem key={work.id} value={work.id}>
										{`${work.user_name} - ${work.planned_task}`}
									</MenuItem>
								))
							) : (
								<MenuItem disabled>終了できる作業がありません</MenuItem>
							)}
						</Select>
					</FormControl>
				)}

				{/* === フッター（ボタン） === */}
				<Button
					variant="contained"
					onClick={handleFinishWork}
					disabled={!selectedWorkId || submitting || loading}
					fullWidth
					startIcon={!submitting && <CheckCircleOutlineIcon />}
					sx={{
						mt: 4,
						py: 1.5,
						color: "#333", // 文字色
						fontWeight: "bold",
						fontSize: "1rem",
						borderRadius: "8px",
						// グラデーション背景
						background: "linear-gradient(90deg, #ffb74d 0%, #ffd54f 100%)",
						transition: "opacity 0.3s",
						"&:hover": {
							opacity: 0.9,
							background: "linear-gradient(90deg, #ffb74d 0%, #ffd54f 100%)",
						},
						// disabled時のスタイル
						"&.Mui-disabled": {
							background: "#e0e0e0",
							color: "#bdbdbd",
						},
						position: "relative", // ローディング表示のため
					}}
				>
					{submitting ? "終了処理中..." : "作業を終了する"}
					{submitting && (
						<CircularProgress
							size={24}
							sx={{
								color: "#333",
								position: "absolute",
								top: "50%",
								left: "50%",
								marginTop: "-12px",
								marginLeft: "-12px",
							}}
						/>
					)}
				</Button>
			</Paper>
		</Box>
	);
}
