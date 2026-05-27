import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { PendingSignup, User } from "./types";

export type AuthStoreData = {
  users: Record<string, User>;
  emailIndex: Record<string, string>;
  pending: Record<string, PendingSignup>;
  slotBookings: Record<string, Record<string, number>>;
};

const EMPTY: AuthStoreData = {
  users: {},
  emailIndex: {},
  pending: {},
  slotBookings: {},
};

function getStorePath(): string {
  return join(process.cwd(), ".data", "auth-store.json");
}

export function loadStore(): AuthStoreData {
  const path = getStorePath();
  try {
    if (!existsSync(path)) return { ...EMPTY };
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AuthStoreData>;
    return {
      users: parsed.users ?? {},
      emailIndex: parsed.emailIndex ?? {},
      pending: parsed.pending ?? {},
      slotBookings: parsed.slotBookings ?? {},
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveStore(data: AuthStoreData): void {
  const path = getStorePath();
  const dir = join(process.cwd(), ".data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}
