'use client';

import React, { useState } from 'react';

type Project = {
    id: string;
    name: string;
};

type HeaderProps = {
    projects: Project[];
    onProjectChange: (projectId: string) => void;
};

const Header: React.FC<HeaderProps> = ({ projects, onProjectChange }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);
        onProjectChange(projectId);
    };

    return (
        <header>
            <label htmlFor="project-select">プロジェクト選択: </label>
            <select
                id="project-select"
                value={selectedProjectId}
                onChange={handleChange}
            >
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
        </header>
    );
};

export default Header;