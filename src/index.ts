import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users.js"
import { handlerAgg } from "./commands/aggregate.js";


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