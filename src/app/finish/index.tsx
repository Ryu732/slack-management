"use client";

export const dynamic = "force-dynamic";

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
interface Work {
	id: string;
	project_id: string;
	user_name: string;
	planned_task: string;
	actual_task: string | null;
	remaining_task: string | null;
	status: string;
	started_at: string;
	ended_at: string | null;
	created_at: string;
}

// 活動中の作業を取得する関数
const fetchActiveWorks = async (projectId: string): Promise<Work[]> => {
	// workテーブルからデータを取得するAPIエンドポイントを想定
	console.log("受け取ったprojectIDです：", projectId);
	const endpoint = `/projects/{project_id}/sessions/active`;
	console.log(`Fetching active works from: ${endpoint}`);

	try {
		const response = await fetch(endpoint);
		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		const data: { works: Work[] } = await response.json();
		// ended_atがnullのものを活動中の作業としてフィルタリング
		return data.works.filter((work) => work.ended_at === null);
	} catch (error) {
		console.error("Failed to fetch active works:", error);
		return [];
	}
};

// 指定された作業を終了する（ended_atを更新する）関数
const endWork = async (workId: string): Promise<{ success: boolean }> => {
	const endpoint = `/api/work/${workId}`; // 特定のworkを更新するAPIエンドポイントを想定
	console.log(`Ending work with ID: ${workId}`);
	try {
		const response = await fetch(endpoint, {
			method: "PATCH", // 部分的な更新なのでPATCHを使用
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ended_at: new Date().toISOString(), // 終了時刻に現在時刻を設定
			}),
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}
		return { success: true };
	} catch (error) {
		console.error(`Failed to end work (ID: ${workId}):`, error);
		return { success: false };
	}
};

export default function Finish() {
	const [works, setWorks] = useState<Work[]>([]);
	const [selectedWorkId, setSelectedWorkId] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);
	const [submitting, setSubmitting] = useState<boolean>(false);

	useEffect(() => {
		const loadWorks = async () => {
			setLoading(true);
			const activeWorks = await fetchActiveWorks("project-123");
			setWorks(activeWorks);
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
			// 画面上から終了した作業を削除
			setWorks(works.filter((w) => w.id !== selectedWorkId));
			setSelectedWorkId("");
		} else {
			alert("作業の終了に失敗しました。");
		}
		setSubmitting(false);
	};

	return (
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
					作業の終了
				</Typography>
				{loading ? (
					<Box sx={{ my: 4 }}>
						<CircularProgress />
						<Typography>アクティブな作業を取得中...</Typography>
					</Box>
				) : (
					<FormControl fullWidth sx={{ my: 3 }}>
						<InputLabel id="work-select-label">終了する作業を選択</InputLabel>
						<Select
							labelId="work-select-label"
							value={selectedWorkId}
							label="終了する作業を選択"
							onChange={handleWorkChange}
							disabled={works.length === 0}
						>
							{works.map((work) => (
								<MenuItem key={work.id} value={work.id}>
									{`${work.user_name} - ${work.planned_task}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				<Button
					variant="contained"
					color="primary"
					onClick={handleFinishWork}
					disabled={!selectedWorkId || submitting || loading}
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
