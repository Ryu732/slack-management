import { Box } from "@mui/material";
import Finish from "./finish";
import WorkingMembers from "./workingMembers";

export default function Home() {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center", // 水平方向の中央揃え
				alignItems: "center", // 垂直方向の中央揃え
				minHeight: "100vh", // 画面の高さいっぱいに広げる
				width: "100%", // 画面の幅いっぱいに広げる
				p: 4, // コンテンツの周りに余白を設定
			}}
		>
			<WorkingMembers />

			<Finish />
		</Box>
	);
}
