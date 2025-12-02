import { Router } from "express";
import { oauthCallback } from '../controllers/oauthController.js';

const router = Router();

router.get("/google/callback", oauthCallback); 

export default router;