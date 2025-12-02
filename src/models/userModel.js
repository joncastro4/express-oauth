import pool from '../config/database.js';

export async function registerUser(username, email, passwordHash) {
  const [result] = await pool.execute(
    `INSERT INTO users (
      username, 
      email, 
      password
    ) VALUES (?, ?, ?)`,
    [username, email, passwordHash]
  );

  const insertedId = result.insertId;

  const [rows] = await pool.execute(
      `SELECT id, username, email, created_at, updated_at
      FROM users
      WHERE id = ?`,
    [insertedId]
  );

  return rows[0];
}

export async function getUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT 
      id, 
      username, 
      email, 
      password, 
      created_at, 
      updated_at
    FROM users
    WHERE email = ?`,
    [email]
  );
  
  return rows[0];
}

export async function storeToken(userId, token) {
  await pool.execute(
    `INSERT INTO tokens (
      user_id,
      token
    ) VALUES (?, ?)`,
    [userId, token]
  );

  return true;
}

export async function getUserByToken(token) {
  const [rows] = await pool.execute(
    `select 
      users.id, 
      users.username, 
      users.email,
      users.picture 
    from users 
    join tokens on users.id = tokens.user_id 
    where tokens.token = ?`,
    [token]
  );

  return rows[0];
}

