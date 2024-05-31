// src/controllers/applicationController.js
const Candidate = require("../models/candidates");
const Job = require("../models/jobs");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/db");
const CandidateJobMapping = require("../models/candidates_jobs_map");
const { Op } = require("sequelize");

exports.applyForJob = async (req, res) => {
  try {
    const user_id = uuidv4();
    // Create the candidate
    const {
      name,
      phone_number,
      email,
      location,
      years_of_experience,
      current_salary,
      expected_salary,
      skills,
      current_position,
      current_company,
      resume,
      job_id,
    } = req.body;

    // Find the job
    const job = await Job.findOne({ where: { job_id } });
    const createdAt = sequelize.literal(
      "CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const candidate = await Candidate.create({
      user_id,
      name,
      phone_number,
      email,
      location,
      years_of_experience,
      createdAt,
      current_salary,
      expected_salary,
      skills,
      current_position,
      current_company,
      resume,
    });
    // Create the candidate-job mapping
    await CandidateJobMapping.create({
      status: "applied",
      appliedAt: createdAt,
      user_id: candidate.user_id,
      job_id: job.job_id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      candidateId: candidate.job_id,
    });
  } catch (error) {
    console.log("error");
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all active jobs
exports.getActiveJobs = async (req, res) => {
  try {
    // Fetch all active jobs from the database
    const activeJobs = await Job.findAll({
      where: { status: "active" },
      attributes: ["job_id", "post", "company_name", "location", "remote"],
      order: [["updatedAt", "DESC"]],
    });

    // Return the list of active jobs in the response
    res.status(200).json({ activeJobs });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to fetch active jobs", error: error.message });
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const { job_id } = req.query;

    // Find the job by its ID
    const job = await Job.findOne({ where: { job_id } });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Return the job details in the response
    res.status(200).json({ job });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to fetch job details", error: error.message });
  }
};

exports.filterJobs = async (req, res) => {
  try {
    const { keywords, years_of_experience, location, remote } = req.body;

    // Initialize an empty filter object
    let filter = {};

    // Add conditions for fields that are present in the request body
    if (keywords) {
      filter.keywords = {
        [Op.contains]: keywords, // Check if keywords array contains any of the provided keywords
      };
    }
    if (years_of_experience) {
      filter.years_of_experience = years_of_experience;
    }
    if (location) {
      filter.location = location;
    }
    if (remote) {
      filter.remote = remote;
    }
    filter.status = "active";

    // Filter jobs based on the filter object
    const filteredJobs = await Job.findAll({
      where: filter,
      attributes: ["job_id", "post", "company_name", "location", "remote"],
    });

    if (filteredJobs.length === 0) {
      return res
        .status(404)
        .json({ message: "Jobs matching your prefernces not found" });
    }

    // Return the filtered jobs in the response
    res.status(200).json({ filteredJobs });
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .json({ message: "Failed to filter jobs", error: error.message });
  }
};

exports.uploadResume = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // const fileLocation =
    //   "https://drive.google.com/file/d/178FjHCptG9_u_26IBqpid4o5puT3f8Z_/view?usp=sharing";
    const fileLocation = req.file.path; // Path of the uploaded file
    const fileName = req.file.filename; // Name of the uploaded file
    res.status(200).json({ fileLocation, fileName });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
};

exports.putMatchScore = async (req, res) => {
  try {
    // Fetch candidate_id and job_id from query parameters
    const { user_id, job_id } = req.body;
    // Validate input
    if (!user_id || !job_id) {
      return res
        .status(400)
        .json({ message: "user_id and job_id are required" });
    }

    // Fetch candidate from database
    const candidate = await Candidate.findOne({ where: { user_id: user_id } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Fetch job from database
    const job = await Job.findOne({ where: { job_id: job_id } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const jobCandidateMapping = await CandidateJobMapping.findOne({
      where: { user_id, job_id },
    });
    if (!jobCandidateMapping) {
      return res
        .status(404)
        .json({ message: "Job candidate mapping not found" });
    }
    const matchScore = calculateMatchScore(candidate, job);

    jobCandidateMapping.match_score = matchScore;
    await jobCandidateMapping.save();

    // Return match score
    res.status(200).json({ matchScore });
  } catch (error) {
    console.error("Error calculating match score:", error);
    res.status(500).json({
      message: "Failed to calculate match score",
      error: error.message,
    });
  }
};
function calculateMatchScore(candidate, job) {
  // Define weights for each criterion
  const weights = {
    yearsOfExperience: 0.2,
    remoteStatus: 0.1,
    salaryOffered: 0.3,
    skills: 0.4,
  };

  // Calculate scores for each criterion
  const yearsOfExperienceScore = calculateYearsOfExperienceScore(
    candidate.years_of_experience,
    job.years_of_experience
  );
  const remoteStatusScore =
    candidate.remotePreference === job.remoteStatus ? 1 : 0; // Binary score
  const salaryOfferedScore = calculateSalaryScore(
    candidate.expected_salary,
    job.salary_offered
  );
  const skillsScore = calculateSkillsScore(candidate.skills, job.skills);

  // Calculate the weighted sum of scores
  const weightedSum =
    weights.yearsOfExperience * yearsOfExperienceScore +
    weights.remoteStatus * remoteStatusScore +
    weights.salaryOffered * salaryOfferedScore +
    weights.skills * skillsScore;

  // Return the overall match score
  return weightedSum;
}

function calculateYearsOfExperienceScore(
  candidateExperience,
  jobExperienceRequirement
) {
  let difference;
  if (candidateExperience >= jobExperienceRequirement) {
    // Candidate's experience is greater than or equal to job's reference experience
    difference = 0;
  } else {
    // Candidate's experience is less than job's reference experience
    difference = candidateExperience - jobExperienceRequirement;
  }
  // Example: Higher score for closer match
  return Math.max(0, 1 - Math.abs(difference) / 10); // Adjust divisor for scaling
}

function calculateSalaryScore(candidateSalary, jobSalaryRange) {
  let difference;
  if (jobSalaryRange >= candidateSalary) {
    difference = 0;
  } else {
    difference = jobSalaryRange - candidateSalary;
  }
  return Math.max(0, 1 - Math.abs(difference) / 100000);
}

function calculateSkillsScore(candidateSkills, requiredSkills) {
  console.log(candidateSkills, requiredSkills);
  const intersection = candidateSkills.filter((skill) =>
    requiredSkills.includes(skill)
  );
  const overlapRatio = intersection.length / requiredSkills.length;
  console.log(intersection, overlapRatio);
  return overlapRatio;
}
