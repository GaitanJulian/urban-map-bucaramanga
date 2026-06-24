import "reflect-metadata";
import type { ActorRole } from "@umb/shared";
import { auth, authDbPool } from "../modules/identity-access/better-auth.js";

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: ActorRole;
}

const demoUsers: DemoUser[] = [
  { email: "organizer@urbanmap.local", password: "Organizer#2026", name: "Organizador Demo", role: "organizer" },
  { email: "moderator@urbanmap.local", password: "Moderator#2026", name: "Moderador Demo", role: "moderator" },
  { email: "admin@urbanmap.local", password: "Admin#2026", name: "Administrador Demo", role: "admin" }
];

async function setRole(email: string, role: ActorRole): Promise<void> {
  await authDbPool.query('UPDATE "user" SET "role" = $1 WHERE "email" = $2', [role, email]);
}

async function upsertDemoUser(user: DemoUser): Promise<void> {
  const existing = await authDbPool.query('SELECT id FROM "user" WHERE "email" = $1', [user.email]);

  if (existing.rowCount && existing.rowCount > 0) {
    await setRole(user.email, user.role);
    console.log(`Usuario demo existente actualizado: ${user.email} (${user.role})`);
    return;
  }

  await auth.api.signUpEmail({
    body: { email: user.email, password: user.password, name: user.name }
  });
  await setRole(user.email, user.role);
  console.log(`Usuario demo creado: ${user.email} (${user.role})`);
}

async function main() {
  for (const user of demoUsers) {
    await upsertDemoUser(user);
  }
  await authDbPool.end();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
