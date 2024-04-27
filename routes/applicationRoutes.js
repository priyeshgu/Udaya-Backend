// src/routes/applicationRoutes.js
const express = require('express');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.post('/apply', applicationController.applyForJob);
router.get('/', applicationController.getActiveJobs);
router.get('/job_details', applicationController.getJobDetails);
router.post('/filterJobs', applicationController.filterJobs);


module.exports = router;