const express = require('express');
const adminController = require('../controllers/adminControllers');
const tokens =require('../utils/tokens')

const router = express.Router();

router.post('/create_jobs', adminController.createJob);
router.get('/jobs', adminController.getConditionalJobs);
router.post('/jobs/:job_id', adminController.editJob);
router.get('/jobs/:job_id/candidates', adminController.getJobCandidates);
router.get('/jobs/:job_id/candidates/:candidate_id', adminController.getCandidate);
router.put('/jobs/:job_id/candidates/:candidate_id/edit_status', adminController.editCandidateStatus);
router.post('/add_token', adminController.addToken);
router.get('/get_token', tokens.getToken);

module.exports = router;