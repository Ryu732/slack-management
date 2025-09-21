'use client';

import { useState, useEffect } from "react";
import postWork from "../_lib/postWork";
import { UUID } from "crypto";
import { start } from "../_types/startTask";
import { Tag } from "@/app/start/_types/tag";

type StartTaskProps = {
  project_id: UUID;
  tags: Tag[];
};

export default function StartTask({ project_id, tags }: StartTaskProps) {

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [plannedTask, setPlannedTask] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedTags([]);
  }, [project_id, tags]);


  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleStartTask = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userName.trim() || !plannedTask.trim()) {
      alert("作業者名とこれから行う作業を入力してください。");
      return;
    }
    setIsLoading(true);
    try {
      const task: start = {
        user_name: userName,
        planned_task: plannedTask,
        tag_ids: selectedTags
      };
      await postWork(task, project_id); 
      // 成功時にブラウザのalertを表示
      alert("作業を開始しました！");

      // 成功後にフォームをクリアする
      setUserName('');
      setPlannedTask('');
      setSelectedTags([]);

    } catch (error) {
      console.error("Failed to start task:", error);
      alert("作業の開始に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  作業者名
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                />
              </div>
              <div>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  タグ
                </label>
                <div className="flex flex-wrap gap-2 mt-1 p-2 border-2 border-gray-200 rounded-xl min-h-[40px]">
                  {/* tags 配列の長さをチェック */}
                  {Array.isArray(tags) && tags.length > 0 ? (
                    tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color, color: "#fff", border: "none" } : {}}
                        className={`px-3 py-1 text-xs rounded-full border-2 transition-all duration-300 hover:scale-105 ${selectedTags.includes(tag.id) ? "" : "text-gray-600 border-gray-200 hover:border-indigo-500"}`}
                      >
                        {tag.name}
                      </button>
                    ))
                  ) : (
                    // タグが1つもない場合にメッセージを表示
                    <p className="text-gray-500 text-sm p-2">
                      このプロジェクトには利用可能なタグがありません。
                    </p>
                  )}
                </div>
              </div>

            </div>
            <button onClick={handleStartTask} className="w-full py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              {isLoading ? "開始中..." : "作業開始"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

