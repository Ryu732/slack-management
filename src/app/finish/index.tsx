"use client";

import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
} from "@mui/material";
import { useState } from "react";

export default function Finish() {
	const _damyData = ["寝る", "起きる", "昼寝する"];
	const [activity, setActivity] = useState("");

	const handleActivityChange = (event) => {
		setActivity(event.target.value);
	};

	const finishTodo = () => {
		//ここにDBから消すロジックとしてAPIたたく処理書く
		console.log(`作業終了ボタンが押されました`);
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Paper
				elevation={3}
				sx={{ padding: "2rem", width: "100%", maxWidth: "400px" }}
			>
				<FormControl fullWidth>
					<InputLabel id="activity-select-label">作業を選択</InputLabel>
					<Select
						labelId="activity-select-label"
						id="activity-select"
						value={activity}
						label="作業を選択"
						onChange={handleActivityChange}
						sx={{ marginBottom: "1.5rem" }}
					>
						{_damyData.map((item) => (
							<MenuItem key={item} value={item}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					color="primary"
					onClick={finishTodo}
					fullWidth
				>
					作業を終了する
				</Button>
			</Paper>
		</Box>
	);
}
