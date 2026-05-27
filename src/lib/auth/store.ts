import { randomBytes } from "crypto";
import { loadStore, saveStore, type AuthStoreData } from "./persistence";
import type { PendingSignup, User } from "./types";

const PENDING_TTL_MS = 24 * 60 * 60 * 1000;

let cache: AuthStoreData | null = null;

function getData(): AuthStoreData {
  cache ??= loadStore();
  return cache;
}

/** Ricarica da disco (utile dopo hot-reload) */
export function reloadStore(): void {
  cache = loadStore();
}

function persist(): void {
  if (cache) saveStore(cache);
}

export function createToken(): string {
  return randomBytes(32).toString("hex");
}

export function createUserId(): string {
  return `usr_${randomBytes(8).toString("hex")}`;
}

export function findUserByEmail(email: string): User | undefined {
  const data = getData();
  const id = data.emailIndex[email.toLowerCase()];
  return id ? data.users[id] : undefined;
}

export function findUserById(id: string): User | undefined {
  return getData().users[id];
}

export function saveUser(user: User): void {
  const data = getData();
  data.users[user.id] = user;
  data.emailIndex[user.email.toLowerCase()] = user.id;
  persist();
}

export function createPendingSignup(
  email: string,
  provider: PendingSignup["provider"],
  name?: string,
): PendingSignup {
  const data = getData();
  const token = createToken();
  const pending: PendingSignup = {
    token,
    email: email.toLowerCase(),
    provider,
    name,
    expiresAt: Date.now() + PENDING_TTL_MS,
  };
  data.pending[token] = pending;
  persist();
  return pending;
}

export function findPending(token: string): PendingSignup | undefined {
  const pending = getData().pending[token];
  if (!pending) return undefined;
  if (pending.expiresAt < Date.now()) {
    delete getData().pending[token];
    persist();
    return undefined;
  }
  return pending;
}

export function consumePending(token: string): PendingSignup | undefined {
  const pending = findPending(token);
  if (!pending) return undefined;
  delete getData().pending[token];
  persist();
  return pending;
}

export function registerVerifiedUser(
  email: string,
  provider: User["provider"],
  name?: string,
): User {
  const existing = findUserByEmail(email);
  if (existing) {
    if (!existing.verified) {
      existing.verified = true;
      saveUser(existing);
    }
    return existing;
  }

  const user: User = {
    id: createUserId(),
    email: email.toLowerCase(),
    provider,
    name,
    verified: true,
    createdAt: new Date().toISOString(),
  };
  saveUser(user);
  return user;
}

export function getSlotBookings(
  barId: string,
  slotIso: string,
): number {
  return getData().slotBookings[barId]?.[slotIso] ?? 0;
}

export function bookSlot(barId: string, slotIso: string): boolean {
  const data = getData();
  if (!data.slotBookings[barId]) data.slotBookings[barId] = {};
  const current = data.slotBookings[barId][slotIso] ?? 0;
  if (current >= 5) return false;
  data.slotBookings[barId][slotIso] = current + 1;
  persist();
  return true;
}
