import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { middlewareLoggedIn } from "./commands/middleware.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/follow.js";
import { handlerUnfollow } from "./commands/unfollow.js";
import { handlerBrowse } from "./commands/browse.js";


async function main() {
  const args = process.argv.slice(2);
  if (args.length <1) {
      console.log("To use: cli <command> [args...]");
      process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const cmdRegistry: CommandsRegistry = {};
  registerCommand(cmdRegistry, "login", handlerLogin);
  registerCommand(cmdRegistry, "register", handlerRegister);
  registerCommand(cmdRegistry, "reset", handlerReset);
  registerCommand(cmdRegistry, "users", handlerUsers);
  registerCommand(cmdRegistry, "agg", handlerAgg);
  registerCommand(cmdRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(cmdRegistry, "feeds", handlerFeeds);
  registerCommand(cmdRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(cmdRegistry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(cmdRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(cmdRegistry, "browse", middlewareLoggedIn(handlerBrowse));
  
  try {
    await runCommand(cmdRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}:  ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();