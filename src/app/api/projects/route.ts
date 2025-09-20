import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
