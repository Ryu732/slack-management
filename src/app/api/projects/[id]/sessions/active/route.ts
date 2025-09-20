import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 現在作業中のセッション取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true, is_active: true }, // project_name → name
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 現在作業中のセッションを取得
    const activeSessions = await prisma.work.findMany({
      where: {
        project_id: id,
        status: "WORKING",
      },
      orderBy: {
        started_at: "asc", // 開始時刻の古い順
      },
    });

    // レスポンス形式に変換
    const now = new Date();
    const sessions = await Promise.all(
      activeSessions.map(async (session: any) => {
        // 経過時間を計算（分）
        const elapsedMinutes = Math.round(
          (now.getTime() - session.started_at.getTime()) / (1000 * 60)
        );

        // タグ情報を取得
        const tagIdsArray = Array.isArray(session.tag_ids)
          ? (session.tag_ids as string[])
          : [];

        const tags =
          tagIdsArray.length > 0
            ? await prisma.tag.findMany({
                where: {
                  id: { in: tagIdsArray },
                  project_id: id,
                },
                select: {
                  name: true, // tag_name → name
                },
              })
            : [];

        return {
          id: session.id,
          user_name: session.user_name,
          planned_task: session.planned_task,
          started_at: session.started_at.toISOString(),
          elapsed_minutes: elapsedMinutes,
          tags: tags.map((tag: any) => tag.name), // tag_name → name
        };
      })
    );

    return NextResponse.json({
      sessions,
    });
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch active sessions" },
      { status: 500 }
    );
  }
}
