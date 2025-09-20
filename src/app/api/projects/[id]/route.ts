import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, is_active } = body;

    // バリデーション
    if (name !== undefined && (!name || name.trim() === "")) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      );
    }

    // 名前の重複チェック（名前が更新される場合のみ）
    if (name !== undefined) {
      const trimmedName = name.trim();

      // 同じ名前の他のプロジェクトが存在するかチェック
      const existingProject = await prisma.project.findFirst({
        where: {
          name: trimmedName,
          is_active: true,
          NOT: { id }, // 自分自身は除外
        },
      });

      if (existingProject) {
        return NextResponse.json(
          {
            error: "Project with this name already exists",
            message: `プロジェクト名「${trimmedName}」は既に使用されています`,
          },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // 更新用のデータを準備
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;

    // プロジェクト更新
    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    // レスポンス形式に変換
    return NextResponse.json({
      id: project.id,
      name: project.name,
      description: project.description,
      is_active: project.is_active,
      created_at: project.created_at.toISOString(),
      updated_at: project.updated_at.toISOString(),
    });
  } catch (error) {
    console.error("Error updating project:", error);

    // Prisma固有のエラーハンドリング(値が見つからないとき)
    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
