// Import necessary modules and models
const { v4: uuidv4 } = require('uuid');
const  Job  = require('../models/jobs');
const Candidate = require('../models/candidates');
const CandidateJobMapping = require('../models/candidates_jobs_map');
const AttributeTokens = require('../models/attribute_tokens');
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
    const job_id = req.params.job_id;
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
    job.updatedAt = new Date();

    // Save the changes to the database
    await job.save();

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Controller function to get candidates applied to a job
// exports.getJobCandidates = async (req, res) => {
//     try {
//       const jobId = req.params.job_id;
  
//       // Find candidates for the job using CandidateJobMapping
//       const jobCandidates = await CandidateJobMapping.findAll({
//         where: { job_id: jobId },
//         include: [{ model: Candidate }]
//       });
//       console.log(jobCandidates)
  
//       if (!jobCandidates) {
//         return res.status(404).json({ message: 'No candidates found for this job' });
//       }
  
//       const candidates = jobCandidates.map(candidateMapping => candidateMapping.candidate);
//       res.status(200).json({ candidates });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };


// Controller function to get jobs based on filters
exports.getConditionalJobs = async (req, res) => {
    try {
      const { status } = req.query; 
      // Fetch all active jobs from the database
      const Jobs = await Job.findAll({ where: { 'status': status },order: [['updatedAt', 'DESC']] });
      const jobsWithApplicantCount = await Promise.all(Jobs.map(async job => {
        const applicantCount = await CandidateJobMapping.count({ where: { job_id: job.job_id } });
        return { ...job.toJSON(), applicantCount };
      }));
      res.status(200).json({ jobs: jobsWithApplicantCount });
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: 'Failed to fetch active jobs', error: error.message });
    }
  };


  exports.getCandidate = async (req, res) => {
    try {
      const jobId = req.params.job_id;
      const candidateId = req.params.candidate_id;
  
      // Check if the job_id and candidate_id exist in the same row in the job_candidate_mapping table
      const jobCandidateMapping = await CandidateJobMapping.findOne({
        where: { job_id: jobId, user_id: candidateId ,order: [['updatedAt', 'DESC']]}
      });
  
      if (!jobCandidateMapping) {
        return res.status(404).json({ message: 'Job candidate mapping not found' });
      }
  
      // If the mapping exists, get the candidate details from the candidates table
      const candidate = await Candidate.findOne({ where: { user_id: candidateId } });
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      // Return the candidate details
      res.status(200).json({ candidate });
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  exports.editCandidateStatus= async (req, res) => {
    try {
      const jobId = req.params.job_id;
      const candidateId = req.params.candidate_id;
      const { status } = req.body;
  
      // Fetch the enum values for the status field from the model
      const statusEnumValues = CandidateJobMapping.rawAttributes.status.values;
  
      // Validate status value against the fetched enum values
      if (!statusEnumValues.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      // Update the status field in the jobcandidatemapping table
      const [updatedRowsCount, [updatedCandidateMapping]] = await CandidateJobMapping.update(
        { status },
        { where: { job_id: jobId, user_id: candidateId }, returning: true }
      );
  
      if (updatedRowsCount === 0) {
        return res.status(404).json({ message: 'Candidate mapping not found' });
      }
  
      // Return the updated candidate mapping
      res.status(200).json({ candidateMapping: updatedCandidateMapping });
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.getJobCandidates = async (req, res) => {
    try {
      const jobId = req.params.job_id;
      const { status } = req.query;
  
      let jobCandidates;
      if (status === 'all') {
        // Find all candidates for the job regardless of status
        jobCandidates = await CandidateJobMapping.findAll({
          where: { job_id: jobId },
          include: [{ model: Candidate}], 
          attributes: ['match_score'] 
        });
      } else {
        // Validate if the provided status is one of the enum values
        const statusEnumValues = CandidateJobMapping.rawAttributes.status.values;
        if (!statusEnumValues.includes(status)) {
          return res.status(400).json({ message: 'Invalid status value' });
        }
  
        // Find candidates for the job with the specified status
        jobCandidates = await CandidateJobMapping.findAll({
          where: { job_id: jobId, status },
          include: [{ model: Candidate}],
          attributes: ['match_score']
        });
      }
  
      if (!jobCandidates || jobCandidates.length === 0) {
        return res.status(404).json({ message: 'No candidates found for this job' });
      }
  
      const candidates = jobCandidates.map(candidateMapping => ({
        ...candidateMapping.candidate.toJSON(),
        match_score: candidateMapping.match_score // Add match_score to each candidate object
      }));
      res.status(200).json({ candidates });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


  exports.addToken = async (req, res) => {
    try {
        // Parse data from request body
        const { type, tokens } = req.body;
  
        // Validate input data
        if (!type || !tokens || !Array.isArray(tokens) || tokens.length === 0) {
            return res.status(400).json({ message: 'Type and non-empty array of tokens are required' });
        }
        
        const typeEnumValues = AttributeTokens.rawAttributes.type.values;
  
        // Validate status value against the fetched enum values
        if (!typeEnumValues.includes(type)) {
            return res.status(404).json({ message: 'Attribute not found' });
        }

        const [attribute, created] = await AttributeTokens.findOrCreate({
            where: { type },
            defaults: { name: type, tokens: [] } // Default value for tokens field
        });
  
        // Filter out any tokens that already exist in the list
        const newTokens = tokens.filter(token => !attribute.tokens.includes(token));

        // Add the new tokens to the list
        attribute.tokens = [...attribute.tokens, ...newTokens];

        // Save the updated attribute
        await attribute.save();
  
        // Send success response
        res.status(200).json({ message: 'Tokens added successfully', attribute });
    } catch (error) {
        console.error('Error adding tokens:', error);
        res.status(500).json({ message: 'Failed to add tokens', error: error.message });
    }
};