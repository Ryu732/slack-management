import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 作業終了
export async function POST(
  request: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await params;
    const body = await request.json();
    const { actual_task, remaining_task } = body;

    // セッションが存在し、作業中であることを確認
    const existingSession = await prisma.work.findUnique({
      where: { id: session_id },
      include: {
        project: {
          select: { id: true, project_name: true, is_active: true },
        },
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Work session not found" },
        { status: 404 }
      );
    }

    if (existingSession.status !== "WORKING") {
      return NextResponse.json(
        { error: "Session is not in working status" },
        { status: 400 }
      );
    }

    // 作業セッション終了
    const endedAt = new Date();
    const durationMinutes = Math.round(
      (endedAt.getTime() - existingSession.started_at.getTime()) / (1000 * 60)
    );

    const updatedSession = await prisma.work.update({
      where: { id: session_id },
      data: {
        status: "COMPLETED",
        actual_task: actual_task?.trim() || null,
        remaining_task: remaining_task?.trim() || null,
        ended_at: endedAt,
      },
    });

    // タグ情報を取得（レスポンス用）
    const tagIdsArray = Array.isArray(updatedSession.tag_ids)
      ? (updatedSession.tag_ids as string[])
      : [];
    const tags =
      tagIdsArray.length > 0
        ? await prisma.tag.findMany({
            where: {
              id: { in: tagIdsArray },
              project_id: existingSession.project_id,
            },
          })
        : [];

    // Slack通知（仮の実装）
    const slackNotification = {
      sent: true,
      message_ts: Date.now().toString() + ".000200",
    };

    // レスポンス形式に変換（?を使ったオプショナルプロパティ）
    const response = {
      id: updatedSession.id,
      user_name: updatedSession.user_name,
      planned_task: updatedSession.planned_task,
      actual_task: updatedSession.actual_task ?? undefined,
      remaining_task: updatedSession.remaining_task ?? undefined,
      status: updatedSession.status.toLowerCase(),
      started_at: updatedSession.started_at.toISOString(),
      ended_at: updatedSession.ended_at?.toISOString(),
      duration_minutes: durationMinutes,
      tag_ids: tagIdsArray,
      tags: tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
      slack_notification: slackNotification,
    };

    // JSON.stringifyはundefinedを自動的に除外してくれる
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error ending work session:", error);
    return NextResponse.json(
      { error: "Failed to end work session" },
      { status: 500 }
    );
  }
}
