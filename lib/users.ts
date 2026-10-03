import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

const UserRow = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password_hash: z.string(),
  avatar_data_url: z.string().nullable(),
});

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarDataUrl: string | null;
}

function toUser(row: z.infer<typeof UserRow>): User {
  return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, avatarDataUrl: row.avatar_data_url };
}

const SELECT = "select id, name, email, password_hash, avatar_data_url from users";

export async function findUserByEmail(email: string): Promise<User | null> {
  const res = await db().query(`${SELECT} where email = $1`, [email.trim().toLowerCase()]);
  const row = res.rows[0];
  return row ? toUser(UserRow.parse(row)) : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await db().query(`${SELECT} where id = $1`, [id]);
  const row = res.rows[0];
  return row ? toUser(UserRow.parse(row)) : null;
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const passwordHash = await hash(password, 10);
  const res = await db().query(
    `insert into users (name, email, password_hash) values ($1, $2, $3) returning id, name, email, password_hash, avatar_data_url`,
    [name, email.trim().toLowerCase(), passwordHash],
  );
  return toUser(UserRow.parse(res.rows[0]));
}

export async function updateUserProfile(id: string, name: string, avatarDataUrl: string | null): Promise<void> {
  await db().query("update users set name = $1, avatar_data_url = $2 where id = $3", [name, avatarDataUrl, id]);
}

export async function updateUserPassword(id: string, passwordHash: string): Promise<void> {
  await db().query("update users set password_hash = $1 where id = $2", [passwordHash, id]);
}
