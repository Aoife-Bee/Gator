import { db } from "..";
import { posts, feeds, feedFollows, NewPost } from "../schema";
import { eq, and, sql } from "drizzle-orm";

export async function createPost(post: NewPost) {

    const [result] = await db.insert(posts).values(post).returning();

    return result
};

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db
    .select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        title: posts.title,
        description: posts.description,
        url: posts.url,
        publishedAt: posts.publishedAt,
        feedId: posts.feedId,
        feedName: feeds.name    
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(sql`published_at DESC`)
    .limit(limit);

    return result

}