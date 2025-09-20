import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  try {
    const { id, tagId } = await params;

    // プロジェクトが存在するかチェック
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // タグが存在し、指定されたプロジェクトに属するかチェック
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        project_id: id,
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found in this project" },
        { status: 404 }
      );
    }

    // タグを削除
    await prisma.tag.delete({
      where: {
        id: tagId,
      },
    });

    // 成功レスポンス（204 No Content）
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting tag:", error);

    // Prisma固有のエラーハンドリング
    if ((error as any).code === "P2025") {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
