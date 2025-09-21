import { start } from '@/app/start/_types/startTask';
import { UUID } from 'crypto';

// 作業開始のAPI呼び出し
export default async function postWork(data: start, project_id: UUID) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/projects/${project_id}/sessions/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
}
