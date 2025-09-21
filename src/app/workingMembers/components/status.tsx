
"use client"; // ← これを追加

import type { UUID } from "node:crypto";
import { Box, Typography } from "@mui/material";

// WorkLogの型定義
interface WorkLog {
	id: UUID;
	user_name: string;
	planned_task: string;
	status: "working" | "completed" | "paused";
	started_at: string;
	tags: string[];
}

// Propsの型定義
interface StatusProps {
	workLog: WorkLog;
}

export default function Status({ workLog }: StatusProps) {
	// レンダリング時に一度だけ経過時間を計算してフォーマットする関数
	const formatElapsedTime = (): string => {
		const startTime = new Date(workLog.started_at);
		const now = new Date();
		const diffMinutes = Math.floor(
			(now.getTime() - startTime.getTime()) / (1000 * 60),
		);

		if (diffMinutes < 1) {
			return "たった今";
		}
		if (diffMinutes < 60) {
			return `${diffMinutes}分前から`;
		}
		const hours = Math.floor(diffMinutes / 60);
		return `${hours}時間前から`;
	};

	// 関数を呼び出して表示するテキストを取得
	const elapsedText = formatElapsedTime();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				p: 2,
				mb: 1.5,
				backgroundColor: "white",
				borderRadius: "12px",
				boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
				transition: "transform 0.2s ease-in-out",
				"&:hover": {
					transform: "scale(1.02)",
				},
			}}
		>
			<Box sx={{ textAlign: "left" }}>
				<Typography variant="body1" sx={{ fontWeight: "bold" }}>
					{workLog.user_name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{workLog.planned_task}
				</Typography>
			</Box>

			<Box
				sx={{
					backgroundColor: "#e3f2fd",
					color: "#1e88e5",
					borderRadius: "20px",
					px: 1.5,
					py: 0.5,
					flexShrink: 0,
					ml: 2,
				}}
			>
				<Typography variant="caption" sx={{ fontWeight: "bold" }}>
					{elapsedText}
				</Typography>
			</Box>
		</Box>
	);

