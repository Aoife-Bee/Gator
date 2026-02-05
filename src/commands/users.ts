import { setUser, readConfig } from "../config.js"
import { createUser, getUser, getUsers } from "src/lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("Username is required for login.");
    };
    const userName = args[0];
    const userExists = await getUser(userName);
    if (!userExists) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(userExists.name);
    console.log(`Logged in as ${userName}`);
};

export async function handlerRegister(cmdName: string, ...args:string[]) {
    if (args.length < 1) {
        throw new Error("Username is required to register.");
    };
    const userName = args[0];
    const userExists = await getUser(userName);
    if (!userExists) {
        const user = await createUser(args[0]);
        setUser(user.name);
        console.log(`User ${userName} created successfully.`)
    } else {
        throw new Error("Username already exists.");
    }
}


export async function handlerUsers(cmdName: string) {
    const users = await getUsers();
    const cfg = readConfig();

    for (const user of users) {
        if (user.name === cfg.currentUserName) {
            console.log(`* ${user.name} (current)`);
        } else {
                console.log(`* ${user.name}`);
        }
    }
}