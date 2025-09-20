import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 作業履歴取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // クエリパラメータの取得
    const status = searchParams.get("status");
    const user_name = searchParams.get("user_name");
    const tag_ids = searchParams.get("tag_ids");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true, is_active: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 基本フィルター条件
    const whereConditions: any = {
      project_id: id,
    };

    // ステータスフィルター
    if (status) {
      const statusMap: { [key: string]: string } = {
        working: "WORKING",
        completed: "COMPLETED",
        paused: "PAUSED",
      };

      if (statusMap[status.toLowerCase()]) {
        whereConditions.status = statusMap[status.toLowerCase()];
      }
    }

    // ユーザー名フィルター（SQLite用に修正）
    if (user_name) {
      whereConditions.user_name = {
        contains: user_name,
        // SQLiteでは mode: "insensitive" を削除
      };
    }

    // 全セッション取得（タグフィルター用）
    const allSessions = await prisma.work.findMany({
      where: whereConditions,
      orderBy: {
        started_at: "desc",
      },
    });

    // ユーザー名フィルター（大文字小文字を区別しない検索をアプリケーション側で実装）
    let filteredSessions = allSessions;
    if (user_name) {
      filteredSessions = allSessions.filter((session: any) =>
        session.user_name.toLowerCase().includes(user_name.toLowerCase())
      );
    } else {
      filteredSessions = allSessions;
    }

    // タグIDフィルター
    const targetTagIds = tag_ids
      ? tag_ids.split(",").map((id) => id.trim())
      : null;

    if (targetTagIds) {
      filteredSessions = filteredSessions.filter((session: any) => {
        const sessionTagIds = Array.isArray(session.tag_ids)
          ? (session.tag_ids as string[])
          : [];
        return targetTagIds.some((tagId) => sessionTagIds.includes(tagId));
      });
    }

    // ページング処理
    const total = filteredSessions.length;
    const hasMore = filteredSessions.length > limit;
    const sessions = filteredSessions.slice(0, limit);

    // レスポンス形式に変換
    const formattedSessions = await Promise.all(
      sessions.map(async (session: any) => {
        // 経過時間または作業時間を計算
        let durationMinutes = null;
        if (session.ended_at) {
          durationMinutes = Math.round(
            (session.ended_at.getTime() - session.started_at.getTime()) /
              (1000 * 60)
          );
        }

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
                  name: true,
                },
              })
            : [];

        // スプレッド演算子で条件付きプロパティを追加
        const response = {
          id: session.id,
          user_name: session.user_name,
          planned_task: session.planned_task,
          ...(session.actual_task && {
            actual_task: session.actual_task,
          }),
          ...(session.remaining_task && {
            remaining_task: session.remaining_task,
          }),
          status: session.status.toLowerCase(),
          started_at: session.started_at.toISOString(),
          ...(session.ended_at && {
            ended_at: session.ended_at.toISOString(),
            duration_minutes: durationMinutes,
          }),
          tags: tags.map((tag: any) => tag.name),
        };

        return response;
      })
    );

    return NextResponse.json({
      sessions: formattedSessions,
      total,
      has_more: hasMore,
    });
  } catch (error) {
    console.error("Error fetching work sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch work sessions" },
      { status: 500 }
    );
  }
}
