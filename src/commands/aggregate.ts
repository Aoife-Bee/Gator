import { markFeedFetched, getNextFeedToFetch } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";
import { Feed, NewPost } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`To use: ${cmdName} <time_between_requests>`);
    }
    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(`Invalid time duration: ${timeArg} - use format 1h 30m 15s or 3500ms`);
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}


async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log(`No feeds to fetch.`);
        return;
    }
    console.log(`Found a feed to fetch!`);
    scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id);

    const feedData = await fetchFeed(feed.url);

    for (let item of feedData.channel.item) {
        console.log(`Found post: %s`, item.title);

        const now = new Date();

        await createPost({
            url: item.link,
            feedId: feed.id,
            title: item.title,
            createdAt: now,
            updatedAt: now,
            description: item.description,
            publishedAt: new Date(item.pubDate),
        } satisfies NewPost);
    }
}

function handleError(error: Error) {
  console.error("Error:", error.message);
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Invalid duration format: ${durationStr}`);
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        default:
            throw new Error(`Unknown time unit: ${unit}`);
    }
}