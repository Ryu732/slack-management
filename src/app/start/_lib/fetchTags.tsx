import { UUID } from "crypto";
import { FetchTagsResponse, Tag } from "../_types/tag";

// タグ一覧を取得するAPI呼び出し
export async function fetchTags(project_id: UUID): Promise<Tag[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
  }
    const response = await fetch(`${baseUrl}/api/projects/${project_id}/tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tags');
    }
    const data: FetchTagsResponse = await response.json();
    return data.tags;
}