const express = require('express');
const adminController = require('../controllers/adminControllers');

const router = express.Router();

router.post('/create_jobs', adminController.createJob);
router.get('/jobs', adminController.getConditionalJobs);
router.post('/jobs/:job_id', adminController.editJob);
router.get('/jobs/:job_id/candidates', adminController.getJobCandidates2);
router.get('/jobs/:job_id/candidates/:candidate_id', adminController.getCandidate);
router.put('/jobs/:job_id/candidates/:candidate_id/edit_status', adminController.editCandidateStatus);


module.exports = router;