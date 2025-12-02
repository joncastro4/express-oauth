import pool from '../config/database.js';

export async function oauth(googleInfo) {
  const { googleId, email, name, picture } = googleInfo;

  // Check if the user already exists
  const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
  let user;

  if (rows.length > 0) {
    // User exists, update their info
    user = rows[0];
    await pool.query(
      'UPDATE users SET email = ?, username = ?, picture = ? WHERE google_id = ?',
      [email, name, picture, googleId]
    );
  } else {
    // User does not exist, create a new one
    const [result] = await pool.query(
      'INSERT INTO users (google_id, email, username, picture) VALUES (?, ?, ?, ?)',
      [googleId, email, name, picture]
    );
    user = { id: result.insertId, googleId, email, name, picture };
  }

  return user;
}
