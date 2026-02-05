import { UserCommandHandler, CommandHandler } from "src/commands/commands.js";
import { readConfig } from "src/config.js";
import { getUser } from "src/lib/db/queries/users.js";


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName, ...args) => {
        const config = readConfig();
        const user = await getUser(config.currentUserName);
        if (!user) {
            throw new Error(`User undefined`);
        }
        
        await handler(cmdName, user, ...args);
    };
}