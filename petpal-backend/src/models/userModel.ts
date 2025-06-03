import { db } from '../db';

export const createUser = async (name: string, email: string, hashedPassword: string) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return result;
};

export const findUserByEmail = async (email: string) => {
  const [rows]: any = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};