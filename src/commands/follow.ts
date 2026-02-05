import { getFeedFromFeedUrl, createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`To use: ${cmdName} <url>`);
    }

    const url = args[0]
    const feed = await getFeedFromFeedUrl(url)
    if (!feed) {
        throw new Error('Feed Undefined');
    }

    const full = await createFeedFollow(feed.id, user.id)
    console.log(`* ${full.feedName}`)
    console.log(`* ${full.userName}`)
}

export async function handlerFollowing(cmdName: string, user: User) {
    const follows = await getFeedFollowsForUser(user.id);
    for (const follow of follows) {
        console.log(`* ${follow.feedName}`)
    }
}