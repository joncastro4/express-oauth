import * as userService from '../services/userService.js';

export async function registerUser(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'No JSON body provided or JSON is invalid'
    });
  }

  const { username, email, password } = req.body;
  const requiredFields = { username, email, password };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || value.trim() === "")
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(422).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  try {
    const result = await userService.registerUser(username, email, password);
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: result 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
}

export async function loginUser(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'No JSON body provided or JSON is invalid'
    });
  }
  
  const { email, password } = req.body;
  const requiredFields = { email, password };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || value.trim() === "")
    .map(([key]) => key);
    
  if (missingFields.length > 0) {
    return res.status(422).json({
      message: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  try {
    const result = await userService.loginUser(email, password);
    res.status(200).json({ 
      message: 'Login successful', 
      token: result.token,
      user: result.user 
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
}

export async function getUserProfile(req, res) {
  const token = req.headers['authorization'].split(' ')[1];

  try {
    const user = await userService.getUserByToken(token);
    res.status(200).json({ 
      message: 'User profile retrieved successfully', 
      user 
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Failed to retrieve user profile', 
      error: error.message 
    });
  }
}