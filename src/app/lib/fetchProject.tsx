import { UUID } from "crypto";

export type Project = {
    id: UUID;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    member_count: number;
    active_session_count: number;
};

export type FetchProjectsResponse = {
    projects: Project[];
};

export async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch projects');
    }
    const data: FetchProjectsResponse = await res.json();
    return data.projects;
}