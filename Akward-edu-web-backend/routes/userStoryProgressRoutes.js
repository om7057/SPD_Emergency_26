import express from 'express';
import { completeStory } from '../controllers/userStoryProgressController.js';

const router = express.Router();


router.post('/:clerkId/complete-story', completeStory);

export default router;


