import express from 'express';
import getReview from '../Controller/Ai_Controller.js'
import SummarizeJob from '../Controller/Ai_Summarize_Controller.js';
const router = express.Router();

router.post('/get-review', getReview);
router.post('/get-summarize', SummarizeJob);

export default router;  