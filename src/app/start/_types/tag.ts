export type Tag = {
    id: string;
    name: string;
    color: string;
    usage_count: number;
};

export type FetchTagsResponse = {
    tags: Tag[];
};
