const express = require('express');
const adminController = require('../controllers/adminControllers');

const router = express.Router();

router.post('/create_jobs', adminController.createJob);
router.post('/jobs/:id', adminController.editJob);
router.get('/jobs/:id/candidates', adminController.getJobCandidates);
router.get('/jobs', adminController.getConditionalJobs);


module.exports = router;