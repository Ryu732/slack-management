'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/app/lib/fetchProject';

type HeaderProps = {
    projects: Project[];
    onProjectChange: (projectId: string) => void;
    // 親コンポーネントからプロジェクト追加のロジックを受け取る
    onAddProject: (projectName: string) => Promise<void>;
};

const Header: React.FC<HeaderProps> = ({ projects, onProjectChange, onAddProject }) => {
    // 最初のプロジェクトIDを初期値に設定
    const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
    const [newProjectName, setNewProjectName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // projectsが外部要因（例：追加）で更新された場合、選択肢も追従させる
    useEffect(() => {
        if (projects.length > 0 && !projects.find(p => p.id === selectedProjectId)) {
            setSelectedProjectId(projects[0].id);
            onProjectChange(projects[0].id);
        }
    }, [projects, selectedProjectId]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);
        onProjectChange(projectId);
    };

    const handleAddClick = async () => {
        if (!newProjectName.trim()) return; // 空の文字列は追加しない
        
        setIsSubmitting(true);
        try {
            await onAddProject(newProjectName);
            setNewProjectName(''); // 入力欄をクリア
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <header className="p-4 bg-gray-100 flex items-center gap-4">
            <div>
                <label htmlFor="project-select" className="mr-2 font-medium">プロジェクト選択:</label>
                <select
                    id="project-select"
                    value={selectedProjectId}
                    onChange={handleChange}
                    className="border-2 border-gray-200 rounded-lg px-3 py-2"
                >
                    {projects
                        .filter(project => project.is_active)
                        .map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                </select>
            </div>
            <div className="flex items-center">
                <label htmlFor='add-project' className="mr-2 font-medium">プロジェクト追加:</label>
                <input 
                    value={newProjectName} 
                    onChange={(e) => setNewProjectName(e.target.value)} 
                    type='text' 
                    id='add-project' 
                    className='border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                />
                <button 
                    onClick={handleAddClick} 
                    disabled={isSubmitting}
                    className='ml-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-300 disabled:bg-gray-400'
                >
                    {isSubmitting ? '追加中...' : '追加'}
                </button>
            </div>
        </header>
    );
};

export default Header;