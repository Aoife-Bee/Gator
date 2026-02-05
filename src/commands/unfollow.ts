import { deleteFeedFollow, getFeedFromFeedUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema.js";

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`To use: ${cmdName} <url>`);
    }

    const url = args[0];
    const feed = await getFeedFromFeedUrl(url);
    if (!feed) {
        throw new Error(`Feed not found for URL: ${url}`);
    }
    await deleteFeedFollow(feed.id, user.id);
    console.log(`Unfollowed feed: ${feed.name}`);
}