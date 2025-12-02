import * as oauthService from "../services/oauthService.js";

// Make sure to define this in your environment variables
const FRONTEND_REDIRECT_URL = process.env.FRONTEND_LOGIN_SUCCESS_URL; 

export async function oauthCallback(req, res) {
  // We only need the 'code' parameter for the exchange
  const { code } = req.query; 
  
  if (!code) {
    return res.status(400).json({
      message: 'Missing required query parameter: code'
    });
  }

  try {
    const { googleInfo, localToken } = await oauthService.handleOAuthCallback(code);

    // ⬅️ SUCCESS: Instead of sending JSON, redirect the user
    // The client (browser) will redirect to your Angular app.
    // We pass the local JWT/session token as a query parameter.
    return res.redirect(`${FRONTEND_REDIRECT_URL}?token=${localToken}`);

  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    // ⬅️ ERROR: Redirect to an error page on the frontend
    return res.redirect(`${FRONTEND_REDIRECT_URL}?error=${encodeURIComponent(error.message)}`);
  }
}