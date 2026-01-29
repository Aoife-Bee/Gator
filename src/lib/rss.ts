import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
        "User-Agent": "gator",
        accept: "application/rss+xml",
    },
});
    if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    const parser = new XMLParser();
    let parsedData = parser.parse(data);

    const channel = parsedData?.rss?.channel;
    if (!channel) {
        throw new Error("Invalid RSS: Missing rss.channel");
    }


    if (!channel.title) {
        throw new Error("Invalid RSS: Missing/Invalid channel.title");
    }
    if (!channel.link) {
        throw new Error("Invalid RSS: Missing/Invalid channel.link");
    }
    if (!channel.description) {
        throw new Error("Invalid:RSS: Missing/Invalid channel.description");
    }

    let items: any[] = [];

    if ("item" in channel && channel.item != null) {
        if (Array.isArray(channel.item)) {
            items = channel.item;
        } else if (typeof channel.item === "object") {
            items = [channel.item];
        } else {
            items = [];
        }
    } else {
        items = [];
    }

    const parsedItems: RSSItem[] = items.map((item) => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
    }));

    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: parsedItems,
        },
    };
}