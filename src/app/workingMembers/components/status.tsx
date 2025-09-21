import { Box, Paper, Typography } from "@mui/material";
export default function Status({ session }) {
	/**
	 * 経過分を「〇分前から」「〇時間前から」の形式に変換します
	 * @param minutes - 経過分
	 */
	const _formatElapsedTime = (minutes: number): string => {
		if (minutes < 60) {
			return `${minutes}分前から`;
		}
		const hours = Math.floor(minutes / 60);
		return `${hours}時間前から`;
	};
	return (
		<Box>
			<Paper>
				<div
					key={session.id}
					className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-3 rounded-xl transition-colors duration-200"
				>
					{/* 1個目の子要素。flexで一個目と二個目は横並びになります。 */}
					<div>
						<Typography variant="h7" component="p" gutterBottom>
							{session.user_name}
						</Typography>
						<Typography
							variant="h8"
							component="p"
							gutterBottom
							color="textSecondary"
						>
							{session.planned_task}
						</Typography>
					</div>

					{/* 経過時間 */}
					<Typography variant="h7" component="p" gutterBottom>
						{_formatElapsedTime(session.elapsed_minutes)}
					</Typography>
				</div>
			</Paper>
		</Box>
	);
}
