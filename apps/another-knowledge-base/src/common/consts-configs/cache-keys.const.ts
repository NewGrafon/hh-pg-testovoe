export const CacheKeys: {
  allArticles: () => string;
  articleById: (id: string | number) => string;
} = {
  allArticles: (): string => {
    return `akb-article-all`;
  },
  articleById: (id: string | number): string => {
    return `akb-article-by-id-${id}`;
  }
};
