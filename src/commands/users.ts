import { setUser } from "../config.js"

export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length < 1) {
        throw new Error("Username is required for login.");
    };
    const userName = setUser(args[0]);
    console.log(`Logged in as ${args[0]}`);
};