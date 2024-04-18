// src/controllers/applicationController.js
const Candidate = require('../models/candidates');
const Job = require('../models/jobs');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/db');
const CandidateJobMapping = require('../models/candidates_jobs_map');

exports.applyForJob = async (req, res) => {
  try {
    const user_id = uuidv4();
    // Create the candidate
    const { name, phone_number, email, location, years_of_experience, current_salary, expected_salary, skills, current_position, current_company, resume, job_id } = req.body;

    // Find the job
    const job = await Job.findOne({ where: { job_id } });
    const createdAt = sequelize.literal('CURRENT_TIMESTAMP AT TIME ZONE \'Asia/Kolkata\'');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const candidate = await Candidate.create({user_id, name, phone_number, email, location, years_of_experience, createdAt, current_salary, expected_salary, skills, current_position, current_company, resume });
    // Create the candidate-job mapping
    await CandidateJobMapping.create({ status: 'applied', appliedAt: createdAt, user_id: candidate.user_id, job_id: job.job_id });

    res.status(201).json({
      message: 'Application submitted successfully',
      candidateId: candidate.job_id,
    });
  } catch (error) {
    console.log("error")
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all active jobs
exports.getActiveJobs = async (req, res) => {
    try {
      // Fetch all active jobs from the database
      const activeJobs = await Job.findAll({ where: { 'status': 'active' } });
  
      // Return the list of active jobs in the response
      res.status(200).json({ activeJobs });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Failed to fetch active jobs', error: error.message });
    }
  };