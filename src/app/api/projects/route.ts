import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 一覧取得
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        is_active: true,
      },
      include: {
        works: {
          select: {
            id: true,
            status: true,
            user_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // レスポンス形式に変換
    const formattedProjects = projects.map((project: any) => {
      // アクティブなセッション数を取得（WORKING状態の作業）
      const activeSessionCount = project.works.filter(
        (work: any) => work.status === "WORKING"
      ).length;

      // メンバー数を取得（ユニークなユーザー数）
      const uniqueUsers = new Set(
        project.works.map((work: any) => work.user_name) // スネークケース
      );
      const memberCount = uniqueUsers.size;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        is_active: project.is_active,
        created_at: project.created_at.toISOString(),
        member_count: memberCount,
        active_session_count: activeSessionCount,
      };
    });

    return NextResponse.json({
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// 作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // バリデーション
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // プロジェクト作成
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    // レスポンス形式に変換
    return NextResponse.json({
      id: project.id,
      name: project.name,
      description: project.description,
      is_active: project.is_active,
      created_at: project.created_at.toISOString(),
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
