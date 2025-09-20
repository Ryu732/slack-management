import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // プロジェクトが存在するかチェック
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // プロジェクトのタグ一覧を取得
    const tags = await prisma.tag.findMany({
      where: {
        project_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // レスポンス形式に変換
    const formattedTags = tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }));

    return NextResponse.json({
      tags: formattedTags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color } = body;

    // バリデーション
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // プロジェクトが存在するかチェック
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const trimmedName = name.trim();

    // 同じプロジェクト内でタグ名の重複チェック
    const existingTag = await prisma.tag.findFirst({
      where: {
        project_id: id,
        name: trimmedName,
      },
    });

    if (existingTag) {
      return NextResponse.json(
        {
          error: "Tag with this name already exists in this project",
          message: `タグ名「${trimmedName}」は既にこのプロジェクトで使用されています`,
        },
        { status: 409 }
      );
    }

    // タグ作成
    const tag = await prisma.tag.create({
      data: {
        project_id: id,
        name: trimmedName,
        color: color || "#667eea", // デフォルトカラー
      },
    });

    // レスポンス形式に変換
    return NextResponse.json(
      {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        created_at: tag.created_at.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
