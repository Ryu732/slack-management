// app/api/health/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // データベースへの接続と単純なクエリを実行して、接続を確認
    await prisma.$queryRaw`SELECT 1`;

    // 接続が成功したら、200 OKを返す
    return NextResponse.json(
      { status: "ok", message: "Database connection is healthy." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection failed:", error);

    // 接続に失敗したら、500 Internal Server Errorを返す
    return NextResponse.json(
      { status: "error", message: "Database connection failed." },
      { status: 500 }
    );
  } finally {
    // 処理が終わったら接続を閉じる（SQLiteの場合は不要な場合が多いが、ベストプラクティスとして推奨）
    await prisma.$disconnect();
  }
}
