import * as oauthModel from '../models/oauthModel.js';
import * as userModel from '../models/userModel.js';
import { OAuth2Client } from "google-auth-library";
import 'dotenv/config'; 
import jwt from 'jsonwebtoken';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; 
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; 
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

/**
 * Exchanges the authorization code for tokens and handles user database interaction.
 * @param {string} code The authorization code from Google
 */
export async function handleOAuthCallback(code) {
  // 1. Exchange the code for the tokens (access_token, id_token, refresh_token)
  const { tokens } = await client.getToken(code);
  
  const idToken = tokens.id_token;
  if (!idToken) {
      throw new Error("Failed to receive ID Token from Google during code exchange.");
  }

  // 2. Verify the ID Token and get the payload (user data)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  
  const payload = ticket.getPayload();

  // 3. Extract standardized user data
  const googleInfo = {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };

  // 4. TODO: Database Lookup/Creation (replace with actual model logic)
  // In a real app, you'd call your model here to find the user by email/googleId
  // and create them if they don't exist.
  const user = { 
      id: 1,
      ...googleInfo
  }; 

  const createdUser = await oauthModel.oauth(googleInfo);

  // 5. Generate your application's JWT for the session
  const localToken = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
  );

  await userModel.storeToken(createdUser.id, localToken);
  
  return { googleInfo, localToken };
}

// NOTE: You must also ensure you have a simple 'dotenv/config' or 
// equivalent package installed and running to load these variables.