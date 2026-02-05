import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUserFromUserId } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema.js";
import { createFeedFollow } from "src/lib/db/queries/feeds";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`To use: ${cmdName} <feed_name> <url>`);
    }
    const feedName = args[0];
    const url = args[1];

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error (`Failed to create feed`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`${feedFollow.feedName}`);
    console.log(`${feedFollow.userName}`);
}

export async function handlerFeeds(cmdName: string) {
    const feeds = await getFeeds();
    if (feeds.length === 0) {
        console.log(`No Feeds Found.`);
        return;
    }

    for (const feed of feeds) {
        console.log(`* ${feed.name}`);
        console.log(`* ${feed.url}`);
        const user = await getUserFromUserId(feed.userId);
        if (!user) {
            console.log(`Missing user for feed: ${feed.id}`);
            continue;
        }
        console.log(`* ${user.name}`);
    }
}


function printFeed(feed: Feed, user: User) {
    console.log(`* ID:          ${feed.id}`);
    console.log(`* Created:     ${feed.createdAt}`);
    console.log(`* Updated:     ${feed.updatedAt}`);
    console.log(`* Name:        ${feed.name}`);
    console.log(`* URL:         ${feed.url}`);
    console.log(`* User:        ${user.name}`);
}