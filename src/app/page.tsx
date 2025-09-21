import { Box, Grid } from "@mui/material";
import Finish from "./finish";
import StartTask from "./start/_components/startTask";
import WorkingMembers from "./workingMembers";

export default function Home() {
	return (
		// 1. ページ全体を覆うBoxコンテナを追加
		// これがページ全体のレイアウトの基準となり、中身を中央に配置します
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
			{/* 2. コンポーネント群を配置するGridコンテナ
          最大幅を設定し、画面が広すぎても間延びしないようにする */}
			<Grid container spacing={4} sx={{ maxWidth: "1800px" }}>
				{/* --- 上の段 --- */}
				<Grid item xs={12} lg={6}>
					<StartTask />
					<WorkingMembers />
				</Grid>
				<Grid item xs={12} lg={6}>
					<Finish />
				</Grid>

				{/* --- 下の段 --- */}

				{/* 右下は空けておく */}
			</Grid>
		</Box>
	);
}
