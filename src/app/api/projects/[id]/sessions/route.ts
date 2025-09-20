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
      select: { id: true, project_name: true, is_active: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // フィルター条件を構築
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

    // ユーザー名フィルター
    if (user_name) {
      whereConditions.user_name = {
        contains: user_name,
        mode: "insensitive", // 大文字小文字を区別しない
      };
    }

    // タグIDフィルター用の変数を準備
    const targetTagIds = tag_ids
      ? tag_ids.split(",").map((id) => id.trim())
      : null;

    // セッション取得（全データを取得後にフィルター）
    const allSessions = await prisma.work.findMany({
      where: whereConditions,
      orderBy: {
        started_at: "desc", // 開始時刻の新しい順
      },
    });

    // タグIDフィルター（アプリケーション側で実行）
    let filteredSessions = allSessions;
    if (targetTagIds) {
      filteredSessions = allSessions.filter((session: any) => {
        const sessionTagIds = Array.isArray(session.tag_ids)
          ? (session.tag_ids as string[])
          : [];
        return targetTagIds.some((tagId) => sessionTagIds.includes(tagId));
      });
    }

    // 総件数（フィルター後）
    const total = filteredSessions.length;

    // ページング処理
    const hasMore = filteredSessions.length > limit;
    const sessions = filteredSessions.slice(0, limit);

    // レスポンス形式に変換
    const formattedSessions = await Promise.all(
      sessions.map(async (session: any) => {
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
                  tag_name: true,
                },
              })
            : [];

        // 作業時間を計算
        let durationMinutes = null;
        if (session.ended_at && session.started_at) {
          durationMinutes = Math.round(
            (session.ended_at.getTime() - session.started_at.getTime()) /
              (1000 * 60)
          );
        }

        // レスポンスオブジェクトを構築
        const response: any = {
          id: session.id,
          user_name: session.user_name,
          planned_task: session.planned_task,
          status: session.status.toLowerCase(),
          started_at: session.started_at.toISOString(),
          tags: tags.map((tag: any) => tag.tag_name),
        };

        // 条件付きフィールドの追加
        if (session.actual_task) {
          response.actual_task = session.actual_task;
        }

        if (session.remaining_task) {
          response.remaining_task = session.remaining_task;
        }

        if (session.ended_at) {
          response.ended_at = session.ended_at.toISOString();
        }

        if (durationMinutes !== null) {
          response.duration_minutes = durationMinutes;
        }

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
