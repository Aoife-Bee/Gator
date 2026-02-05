Gator is written in typescript.

## Requirements

- Node.js 21.7.0 or later (managed with nvm is recommended)
- npm (comes with Node)

## Running gator

```bash
npm install
npm run start
```

## Configuration

Gator uses a config file in your home directory:

- Path: `~/.gatorconfig.json`

- Contents (example):

```json
{
  "db_url": "postgres://user:password@localhost:5432/gator",
  "current_user_name": "your-username"
}
```

(Use whatever `db_url` makes sense for your project.)

The CLI will update `current_user_name` in that file when you change users.

## Commands

Some commands that may interest you are:

User management:
- `register <username>` (create a new user)
- `login <username>` (log into a specific user)
- `users` (lists all users)

Feeds:
- `addfeed "<feedname>" <feedURL>` (Add a feed globally, allowing anyone to follow it. Use "" to include spaces in the feedname.)
- `feeds` (lists all feeds globally)
- `follow <feedURL>` (Currently logged in user will follow the specified feed)
- `unfollow <feedURL>` (unfollow the specified feed)
- `following` (list all feeds the current user is following)

Posts and aggregation:
- `agg <time>` (updates database, make sure to run this periodically to get new posts)
- `browse <numberOfPosts>` (browse up to number of posts from followed feeds, if no number specified defaults to 2)
