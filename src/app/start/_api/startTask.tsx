import { start } from '@/app/start/_types/startTask';
import { UUID } from 'crypto';

// 作業開始のAPI呼び出し
export default async function startTask(data: start, project_id: UUID) {
  const response = await fetch(`/api/projects/${project_id}/sessions/start`, {
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
