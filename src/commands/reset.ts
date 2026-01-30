import { deleteAllUsers } from "src/lib/db/queries/users";

export async function handlerReset(cmdName: string) {
    await deleteAllUsers();
    console.log(`Deleted all user data.`);
}