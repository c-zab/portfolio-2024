export const BLOG_TOPICS = ["engineering", "notes", "clients"] as const;

export type BlogTopic = (typeof BLOG_TOPICS)[number];
