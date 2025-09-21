import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Slack連携設定の作成・更新
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { webhook_url } = await request.json();

    // バリデーション
    if (!webhook_url) {
      return NextResponse.json(
        { error: "webhook_url is required" },
        { status: 400 }
      );
    }

    // Slack Webhook URLの形式チェック
    const slackWebhookPattern =
      /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+$/;
    if (!slackWebhookPattern.test(webhook_url)) {
      return NextResponse.json(
        { error: "Invalid Slack webhook URL format" },
        { status: 400 }
      );
    }

    const projectId = params.id;

    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Slack連携設定の作成または更新（upsert）
    const slackIntegration = await prisma.slackIntegration.upsert({
      where: { project_id: projectId },
      update: {
        webhook_url: webhook_url,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        project_id: projectId,
        webhook_url: webhook_url,
        is_active: true,
      },
    });

    return NextResponse.json({
      id: slackIntegration.id,
      project_id: slackIntegration.project_id,
      webhook_url: slackIntegration.webhook_url,
      is_active: slackIntegration.is_active,
      created_at: slackIntegration.created_at,
      updated_at: slackIntegration.updated_at,
    });
  } catch (error) {
    console.error("Slack integration error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Foreign key constraint")
    ) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Slack連携設定の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Slack連携設定の存在確認
    const slackIntegration = await prisma.slackIntegration.findUnique({
      where: { project_id: projectId },
    });

    if (!slackIntegration) {
      return NextResponse.json(
        { error: "Slack integration not found for this project" },
        { status: 404 }
      );
    }

    // Slack連携設定を削除
    await prisma.slackIntegration.delete({
      where: { project_id: projectId },
    });

    return NextResponse.json({
      message: "Slack integration deleted successfully",
    });
  } catch (error) {
    console.error("Delete Slack integration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
