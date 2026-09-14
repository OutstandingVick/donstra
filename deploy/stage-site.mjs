import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("apps/web/out");
const destination = resolve("out");

if (!existsSync(resolve(source, "index.html"))) {
  throw new Error("Dashboard export is missing apps/web/out/index.html");
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
process.stdout.write("Staged dashboard export in out/\n");
