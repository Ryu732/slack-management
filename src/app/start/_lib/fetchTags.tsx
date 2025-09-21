import { UUID } from "crypto";
import { FetchTagsResponse } from "../_types/tag";

// タグ一覧を取得するAPI呼び出し
export async function fetchTags(project_id: UUID): Promise<FetchTagsResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/projects/${project_id}/tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tags');
    }
    return response.json();
}