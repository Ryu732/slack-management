// 1人のメンバーを表す型 (作業履歴から動的に生成)
export type Member = {
    // API仕様にメンバーIDがないため、名前をIDおよびnameとして扱う
    id: string;
    name: string;
};