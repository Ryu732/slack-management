export type post_project = {
  name: string;
  description?: string;
};

export default async function postProject(data: post_project) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/projects`, {
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