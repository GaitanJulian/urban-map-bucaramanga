import "reflect-metadata";
import { AppDataSource } from "./data-source.js";

async function main() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
