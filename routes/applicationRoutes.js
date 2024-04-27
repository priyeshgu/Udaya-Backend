// src/routes/applicationRoutes.js
const express = require('express');
const applicationController = require('../controllers/applicationController');
const upload = require('../middlewares/uploadMiddelware');
const router = express.Router();

router.post('/apply', applicationController.applyForJob);
router.get('/', applicationController.getActiveJobs);
router.get('/job_details', applicationController.getJobDetails);
router.post('/filterJobs', applicationController.filterJobs);
router.post('/upload-resume', upload.single('resume'), applicationController.uploadResume);

module.exports = router;