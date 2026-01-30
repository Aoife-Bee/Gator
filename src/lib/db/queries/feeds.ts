import { db } from "..";
import { users, feeds, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq } from "drizzle-orm";

export async function createFeed(
    feedName: string,
    url: string,
    userId: string,
) {
    const result = await db.insert(feeds).values({
        name: feedName,
        url,
        userId,
    })
    .returning();

    return firstOrUndefined(result);
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function createFeedFollow(feedId: string, userId: string) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({ feedId, userId })
        .returning();

    if (!newFeedFollow) {
        throw new Error ("Failed to create feed follow");
    }

    const [full] = await db
    .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

    if (!full) {
        throw new Error("Failed to fetch feed follow");
    }

    return full;
}

export async function getFeedFromFeedUrl(url: string) {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
    return feed;
}

export async function getFeedFollowsForUser(userId: string) {
    const follows = await db
    .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));
    
    return follows;
}