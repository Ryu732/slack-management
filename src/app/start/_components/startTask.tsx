'use client';

import { useState } from "react";
import startTask from "../_api/startTask";
import { UUID } from "crypto";
import { start } from "../_types/startTask";

export default function StartTask({ project_id }: { project_id: UUID }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [plannedTask, setPlannedTask] = useState('');
  const [userName, setUserName] = useState('');
  type Tag = { id: string; name: string; };
  // タグのサンプルデータ
  const tags: Tag[] = [
    { id: 'frontend', name: 'フロントエンド' },
    { id: 'backend', name: 'バックエンド' },
    { id: 'design', name: 'デザイン' },
    { id: 'documentation', name: 'ドキュメント' },
    { id: 'bugfix', name: 'バグ修正' },
    { id: 'other', name: 'その他' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  const handleStartTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const task: start = {
      user_name: userName,
      planned_task: plannedTask,
      tag_ids: selectedTags
    };
    startTask(task, project_id);
    console.log("作業を開始:", task);

  };

  return (

    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        {/* 作業開始カード */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-2xl">
              ▶️
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">作業を開始</h3>
              <p className="text-gray-500 text-sm">Slackに自動通知されます</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                作業者名
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
              />
              <label className="block text-sm font-medium text-gray-600 mb-2">
                これから行う作業
              </label>
              <input
                type="text"
                value={plannedTask}
                onChange={(e) => setPlannedTask(e.target.value)}
                placeholder="例: ログイン機能の実装"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tags) => (
                  <button
                    key={tags.id}
                    onClick={() => toggleTag(tags.id)}
                    className={`px-3 py-1 text-xs rounded-full border-2 transition-all duration-300 hover:scale-105 ${selectedTags.includes(tags.id)
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-500'
                      }`}
                  >
                    {tags.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStartTask} className="w-full py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <span>🚀</span>
              <span>作業を開始する</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}