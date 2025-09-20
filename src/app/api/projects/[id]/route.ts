import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // プロジェクトを取得（関連データも含む）
    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    // プロジェクトが存在しない場合
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // レスポンス形式に変換
    return NextResponse.json({
      id: project.id,
      name: project.name,
      description: project.description,
      is_active: project.is_active,
      created_at: project.created_at.toISOString(),
      tags: project.tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
      slack_integration: {
        workspace_name: "DummyDate_name", // 仮の値（将来的にはDBから取得）
        channel_name: "DummyDate_channel", // 仮の値（将来的にはDBから取得）
        is_active: true, // 仮の値（将来的にはDBから取得）
      },
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
