export type Tag = {
    id: string;
    name: string;
    color: string;
    usage_count: number;
};

export type FetchTagsResponse = {
    tags: Tag[];
};

export const sampleTags: Tag[] = [
    { id: '1', name: 'フロントエンド', color: '#FF5733', usage_count: 10 },
    { id: '2', name: 'バックエンド', color: '#33C1FF', usage_count: 8 },
];
