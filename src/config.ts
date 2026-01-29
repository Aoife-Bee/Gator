import fs from "fs";
import path from "path";
import os from "os";

type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string): void {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
};

export function readConfig(): Config {
    const configFilePath = getConfigFilePath();
    if (!fs.existsSync(configFilePath)) {
        throw new Error("Configuration file not found.");
    }
    const data = fs.readFileSync(configFilePath, "utf-8");
    const rawConfig = JSON.parse(data);
    return validateConfig(rawConfig);
};

function getConfigFilePath(): string {
    const homeDir = os.homedir();
    return path.join(homeDir, ".gatorconfig.json");
};

function writeConfig(cfg: Config): void {
    const configFilePath = getConfigFilePath();
    const snakeCase = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    const data = JSON.stringify(snakeCase, null, 2);
    fs.writeFileSync(configFilePath, data, "utf-8");
};

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Invalid URL format.");
    }

    let currentUserName = "";

    if (rawConfig.current_user_name !== undefined) {
        if (typeof rawConfig.current_user_name !== "string") {
        throw new Error("Invalid user name format.");
        }
        currentUserName = rawConfig.current_user_name;
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: currentUserName
    };
};