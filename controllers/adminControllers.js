// Import necessary modules and models
const { v4: uuidv4 } = require('uuid');
const  Job  = require('../models/jobs');
const Candidate = require('../models/candidates');
const CandidateJobMapping = require('../models/candidates_jobs_map');
const sequelize = require('../config/db');

// POST endpoint to create a new job
exports.createJob = async (req, res) => {
 try {
    // Extract job details from the request body
    const { company_name, job_description, skills, openings, salary_offered, post, location, remote, status, years_of_experience, keywords } = req.body;

    // Generate a unique job ID
    const job_id = uuidv4();
    const createdAt = sequelize.literal('CURRENT_TIMESTAMP AT TIME ZONE \'Asia/Kolkata\'');

    // Create the job in the database
    const newJob = await Job.create({job_id, company_name, job_description, skills, openings, salary_offered, post, location, remote, createdAt, status, years_of_experience, keywords });

    // Respond with success message and the created job data
    res.status(201).json({
      message: 'Job created successfully',
      job: newJob
    });
  } catch (error) {
    // Handle any errors that occur during job creation
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to edit a job
exports.editJob = async (req, res) => {
  try {
    const job_id = req.params.id;
    const { company_name, job_description, skills, openings, salary_offered, post, location, remote, status, years_of_experience, keywords } = req.body;

    // Find the job by ID
    const job = await Job.findOne({ where: { job_id } });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update the job fields
    job.company_name = company_name;
    job.job_description = job_description;
    job.skills = skills;
    job.openings = openings;
    job.salary_offered = salary_offered;
    job.post = post;
    job.location = location;
    job.remote = remote;
    job.status = status;
    job.years_of_experience = years_of_experience;
    job.keywords = keywords;

    // Save the changes to the database
    await job.save();

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Controller function to get candidates applied to a job
exports.getJobCandidates = async (req, res) => {
    try {
      const jobId = req.params.id;
  
      // Find candidates for the job using CandidateJobMapping
      const jobCandidates = await CandidateJobMapping.findAll({
        where: { job_id: jobId },
        include: [{ model: Candidate }]
      });
      console.log(jobCandidates)
  
      if (!jobCandidates) {
        return res.status(404).json({ message: 'No candidates found for this job' });
      }
  
      const candidates = jobCandidates.map(candidateMapping => candidateMapping.candidate);
      res.status(200).json({ candidates });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


// Controller function to get jobs based on filters
exports.getConditionalJobs = async (req, res) => {
    try {
      const { status } = req.query; 
      // Fetch all active jobs from the database
      const Jobs = await Job.findAll({ where: { 'status': status } });
  
      // Return the list of active jobs in the response
      res.status(200).json({ Jobs });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Failed to fetch active jobs', error: error.message });
    }
  };