import * as userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function registerUser(username, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await userModel.registerUser(username, email, passwordHash);
}

export async function loginUser(email, password) {
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  await userModel.storeToken(user.id, token);
  
  return { 
    token, 
    user: { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    } 
  };
}

export async function getUserByToken(token) {
  const user = await userModel.getUserByToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }
  return user;
}