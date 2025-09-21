'use client';

import React, { useState } from 'react';
import { WorkLog } from '@/app/history/_types/workLog';
import { Tag } from '@/app/start/_types/tag';
import { Member } from '@/app/history/_types/member';

type Props = {
    workLogs: WorkLog[];
    // プロジェクトに存在する全てのタグ情報 (色情報を含む)
    allTags: Tag[]; 
    members: Member[];
};

// ISO 8601形式の日付文字列を "YYYY/MM/DD HH:mm" 形式にフォーマットするヘルパー関数
const formatDateTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // 日本時間に変換して表示
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Tokyo'
        });
    } catch (e) {
        return "日付不明";
    }
};

// ステータスに応じてスタイルを変更するコンポーネント
const StatusBadge: React.FC<{ status: 'completed' | 'working' | 'paused' }> = ({ status }) => {
    const statusStyles = {
        completed: { text: '完了', bg: 'bg-green-100', textColor: 'text-green-800' },
        working: { text: '作業中', bg: 'bg-blue-100', textColor: 'text-blue-800' },
        paused: { text: '中断', bg: 'bg-gray-100', textColor: 'text-gray-800' },
    };

    const style = statusStyles[status] || statusStyles.paused;

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.textColor}`}>
            {style.text}
        </span>
    );
};

const WorkLogHistory: React.FC<Props> = ({ workLogs, allTags, members }) => {
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);

    const selectedTagName = allTags.find(t => t.id === selectedTagId)?.name;
    
    const filteredLogs = workLogs.filter(log => {
        const tagMatch = !selectedTagName || log.tags.includes(selectedTagName);
        const memberMatch = !selectedMemberName || log.user_name === selectedMemberName;
        return tagMatch && memberMatch;
    });

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl w-full mx-auto my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📝</span> 作業履歴
            </h2>

            {/* フィルターセクション */}
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                <button
                    onClick={() => setSelectedTagId(null)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${!selectedTagId ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    すべて
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag.id}
                        onClick={() => setSelectedTagId(tag.id)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${selectedTagId === tag.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {tag.name}
                    </button>
                ))}
                <select
                    value={selectedMemberName || ''}
                    onChange={(e) => setSelectedMemberName(e.target.value || null)}
                    className="ml-auto px-3 py-1.5 text-sm bg-gray-200 border-none rounded-full focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">全メンバー</option>
                    {members.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                </select>
            </div>

            {/* 履歴リスト */}
            <div className="space-y-4">
                {filteredLogs && filteredLogs.length > 0 ? (
                    filteredLogs.map(log => {
                        const taskDescription = log.actual_task || log.planned_task;
                        return (
                            <div key={log.id} className="p-4 border border-gray-200 rounded-lg">
                                {/* 上段: ユーザー名とステータス */}
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-gray-800">{log.user_name}</p>
                                    <StatusBadge status={log.status} />
                                </div>
                                {/* 中段: タスク内容 */}
                                <p className="text-gray-700 my-3">{taskDescription}</p>
                                {/* タグ */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {log.tags.map(tagName => {
                                        const tagInfo = allTags.find(t => t.name === tagName);
                                        const color = tagInfo ? tagInfo.color : '#cccccc';
                                        return (
                                            <span key={tagName} className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${color}20`, color: color }}>
                                                {tagName}
                                            </span>
                                        );
                                    })}
                                </div>
                                {/* 下段: 時刻 */}
                                <div className="text-sm text-gray-500 border-t border-gray-100 pt-2 mt-2">
                                    <span>🕒 </span>
                                    <span>{formatDateTime(log.started_at)}</span>
                                    {log.ended_at && <span> 〜 {formatDateTime(log.ended_at)}</span>}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500 py-16">
                        表示する作業履歴がありません。
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkLogHistory;