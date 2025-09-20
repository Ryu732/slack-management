/*
  Warnings:

  - You are about to drop the column `createdAt` on the `HealthCheck` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HealthCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_HealthCheck" ("id") SELECT "id" FROM "HealthCheck";
DROP TABLE "HealthCheck";
ALTER TABLE "new_HealthCheck" RENAME TO "HealthCheck";
CREATE TABLE "new_work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "planned_task" TEXT,
    "finish_task" TEXT,
    "remind_task" TEXT,
    "status" TEXT NOT NULL DEFAULT 'WORKING',
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_work" ("created_at", "ended_at", "finish_task", "id", "planned_task", "project_id", "remind_task", "started_at", "status", "user_name") SELECT "created_at", "ended_at", "finish_task", "id", "planned_task", "project_id", "remind_task", "started_at", "status", "user_name" FROM "work";
DROP TABLE "work";
ALTER TABLE "new_work" RENAME TO "work";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
