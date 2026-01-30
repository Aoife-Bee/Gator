import { getFeedFromFeedUrl, createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`To use: ${cmdName} <url>`);
    }
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error('User undefined');
    }

    const url = args[0]
    const feed = await getFeedFromFeedUrl(url)
    if (!feed) {
        throw new Error('Feed Undefined');
    }

    const full = await createFeedFollow(feed.id, user.id)
    console.log(`* ${full.feedName}`)
    console.log(`*${full.userName}`)
}

export async function handlerFollowing(cmdName: string) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User undefined`);
    }
    const follows = await getFeedFollowsForUser(user.id);
    for (const follow of follows) {
        console.log(`* ${follow.feedName}`)
    }
}