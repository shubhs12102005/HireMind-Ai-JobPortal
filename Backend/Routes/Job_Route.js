import express from 'express';
import { isAuthenticated } from '../Middlewares/isAuthenticated.js';
import { createJob, deleteJobById, getAllJobs, getJobById, getJobsBySkill, getRecruiterJobs, getRelatedJobs, getUserSavedJob, saveForLaterJob, unSaveJob } from '../Controller/Job_Controller.js';
const router = express.Router();

router.post('/create', isAuthenticated, createJob);
router.get('/get', getAllJobs);
router.get('/get/:id', getJobById);
router.get('/recruiter/get', isAuthenticated, getRecruiterJobs);
router.get('/delete/:id', isAuthenticated, deleteJobById);
router.get('/get/relatedjob/:id', getRelatedJobs);
router.post('/saveForLater', isAuthenticated, saveForLaterJob);
router.post('/unSaveJob', isAuthenticated, unSaveJob);
router.get('/get-allSavedJobs', isAuthenticated, getUserSavedJob);
router.post('/getJobsBySkill', getJobsBySkill);

export default router;