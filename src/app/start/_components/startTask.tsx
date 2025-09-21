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
  const [isStarting, setIsStarting] = useState<boolean>(false);

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

  // ★★★ ここから修正 ★★★
  const handleStartTask = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // 1. 入力内容のバリデーション
    if (!userName.trim() || !plannedTask.trim()) {
      alert("「作業者名」と「これから行う作業」の両方を入力してください。");
      return; // 未入力の場合はここで処理を中断
    }

    setIsStarting(true); // 2. ローディング状態を開始

    try {
      const task: start = {
        user_name: userName,
        planned_task: plannedTask,
        tag_ids: selectedTags
      };
      
      // 3. APIリクエストを実行 (成功/失敗を待つ)
      await postWork(task, project_id);
      
      console.log("作業を開始:", task);
      alert("作業を開始しました！"); // 成功アラート

      // 4. 成功したらフォームをクリア
      setUserName("");
      setPlannedTask("");
      setSelectedTags([]);

    } catch (error) {
      console.error("作業の開始に失敗しました:", error);
      alert("エラーが発生しました。作業を開始できませんでした。"); // 失敗アラート
    } finally {
      setIsStarting(false); // 5. 成功・失敗にかかわらずローディング状態を終了
    }
  };
  // ★★★ ここまで修正 ★★★

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 w-full max-w-md">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-2xl">
          ▶
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
                <p className="text-gray-500 text-sm p-2">
                  利用可能なタグがありません。
                </p>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={handleStartTask} 
          disabled={isStarting}
          className="w-full py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-wait disabled:hover:translate-y-0"
        >
          {isStarting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>開始中...</span>
            </>
          ) : (
            <>
              <span>作業を開始する</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

