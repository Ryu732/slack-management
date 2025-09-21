'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/app/lib/fetchProject';

type HeaderProps = {
    projects: Project[];
    onProjectChange: (projectId: string) => void;
    onAddProject: (projectName: string) => Promise<void>;
};

const Header: React.FC<HeaderProps> = ({ projects, onProjectChange, onAddProject }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // projects 配列が親コンポーネントから渡されたときに、最初の有効なプロジェクトを選択状態にする
    useEffect(() => {
        if (!selectedProjectId && projects && projects.length > 0) {
            const firstActiveProject = projects.find(p => p.is_active);
            if (firstActiveProject) {
                setSelectedProjectId(firstActiveProject.id);
                onProjectChange(firstActiveProject.id);
            }
        }
    }, [projects, selectedProjectId, onProjectChange]);
    
    // projectsが外部要因（例：追加）で更新された場合、選択肢も追従させる
    useEffect(() => {
        if (projects.length > 0 && !projects.find(p => p.id === selectedProjectId)) {
            const firstActive = projects.find(p => p.is_active);
            if (firstActive) {
                setSelectedProjectId(firstActive.id);
                onProjectChange(firstActive.id);
            }
        }
    }, [projects, selectedProjectId, onProjectChange]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);
        onProjectChange(projectId);
    };

    const handleAddClick = async () => {
        if (!newProjectName.trim()) return;
        
        setIsSubmitting(true);
        try {
            await onAddProject(newProjectName);
            setNewProjectName('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 sticky top-0 z-20">
            <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* --- プロジェクト選択 --- */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                    <label htmlFor="project-select" className="font-medium text-gray-700 flex-shrink-0 text-sm">
                        プロジェクト選択
                    </label>
                    <select
                        id="project-select"
                        value={selectedProjectId}
                        onChange={handleChange}
                        className="w-full sm:w-auto border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                        {projects && projects
                            .filter(project => project.is_active)
                            .map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* --- プロジェクト追加 --- */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                    <label htmlFor='add-project' className="font-medium text-gray-700 flex-shrink-0 text-sm md:hidden">
                        プロジェクト追加
                    </label>
                    <div className="flex items-center gap-2 w-full">
                        <input 
                            value={newProjectName} 
                            onChange={(e) => setNewProjectName(e.target.value)} 
                            type='text' 
                            id='add-project' 
                            placeholder="新規プロジェクト名..."
                            className='w-full border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm' 
                        />
                        <button 
                            onClick={handleAddClick} 
                            disabled={isSubmitting || !newProjectName.trim()}
                            className='flex-shrink-0 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {isSubmitting ? '...' : '追加'}
                        </button>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;
