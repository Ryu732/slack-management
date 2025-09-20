import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { user_name, planned_task, tag_ids } = body;

    // バリデーション
    if (!user_name || user_name.trim() === "") {
      return NextResponse.json(
        { error: "User name is required" },
        { status: 400 }
      );
    }

    // プロジェクトが存在するかチェック
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, is_active: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.is_active) {
      return NextResponse.json(
        { error: "Project is not active" },
        { status: 400 }
      );
    }

    // tag_idsが指定されている場合、タグの存在確認
    if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
      const tags = await prisma.tag.findMany({
        where: {
          id: { in: tag_ids },
          project_id: id, // 同じプロジェクトのタグのみ
        },
      });

      if (tags.length !== tag_ids.length) {
        return NextResponse.json(
          { error: "Some tags not found or not belong to this project" },
          { status: 400 }
        );
      }
    }

    // 作業セッション開始
    const workSession = await prisma.work.create({
      data: {
        project_id: id,
        user_name: user_name.trim(),
        planned_task: planned_task?.trim() || null,
        status: "WORKING",
        tag_ids: tag_ids && Array.isArray(tag_ids) ? tag_ids : [], // PrismaのJsonフィールドに配列を保存
      },
    });

    // タグ情報を取得（レスポンス用）
    // workSession.tag_idsはJsonフィールドなので、配列として扱う
    const tagIdsArray = Array.isArray(workSession.tag_ids)
      ? (workSession.tag_ids as string[])
      : [];
    const tags =
      tagIdsArray.length > 0
        ? await prisma.tag.findMany({
            where: {
              id: { in: tagIdsArray as string[] },
              project_id: id,
            },
          })
        : [];

    // TODO:
    // Slack通知を送信する処理を実装
    // Slack通知（仮の実装）
    const slackNotification = {
      sent: true,
      message_ts: Date.now().toString() + ".000100",
    };

    // レスポンス形式に変換
    return NextResponse.json(
      {
        id: workSession.id,
        project_id: workSession.project_id,
        user_name: workSession.user_name,
        planned_task: workSession.planned_task,
        status: workSession.status.toLowerCase(),
        started_at: workSession.started_at.toISOString(),
        tag_ids: tagIdsArray,
        tags: tags.map((tag: any) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
        slack_notification: slackNotification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting work session:", error);
    return NextResponse.json(
      { error: "Failed to start work session" },
      { status: 500 }
    );
  }
}
