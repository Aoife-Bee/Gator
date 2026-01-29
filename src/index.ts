import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Aoife");
  const cfg = readConfig();
  console.log(cfg);
}

main();