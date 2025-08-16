const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Academic Information
  college: {
    name: { type: String, required: true },
    tier: { type: String, enum: ['Tier-1', 'Tier-2', 'Tier-3'], required: true },
    university: { type: String, required: true }
  },
  branch: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Electrical', 'Other']
  },
  admissionYear: {
    type: Number,
    required: true
  },
  currentYear: {
    type: Number,
    required: true
  },
  currentSemester: {
    type: Number,
    required: true
  },
  
  // Academic History
  twelfthPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  jeeScore: {
    type: Number
  },
  cetScore: {
    type: Number
  },
  
  // Interest Mapping (AI Quiz Results)
  interests: [{
    category: { type: String },
    score: { type: Number, min: 0, max: 10 }
  }],
  
  // Career Goals
  careerGoals: [{
    type: String,
    enum: ['MNC Job', 'Startup', 'MS Abroad', 'Government Job', 'Entrepreneurship', 'Research']
  }],
  
  // CGPA Tracking
  cgpa: {
    current: { type: Number, default: 0 },
    target: { type: Number, default: 8.5 },
    semesterWise: [{
      semester: { type: Number },
      gpa: { type: Number },
      subjects: [{
        name: { type: String },
        grade: { type: String },
        credits: { type: Number }
      }]
    }]
  },
  
  // Skills Assessment
  skills: [{
    name: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    category: { type: String },
    selfRated: { type: Number, min: 1, max: 10 }
  }],
  
  // Projects
  projects: [{
    title: { type: String },
    description: { type: String },
    technologies: [{ type: String }],
    githubLink: { type: String },
    liveLink: { type: String },
    complexity: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    completedAt: { type: Date }
  }],
  
  // Timeline Goals
  timelineGoals: [{
    semester: { type: Number },
    goals: [{
      title: { type: String },
      description: { type: String },
      completed: { type: Boolean, default: false },
      dueDate: { type: Date }
    }]
  }],
  
  // Focus of the Week
  weeklyFocus: {
    currentWeek: { type: Number },
    tasks: [{
      title: { type: String },
      description: { type: String },
      completed: { type: Boolean, default: false },
      category: { type: String }
    }]
  },
  
  // Resume
  resume: {
    summary: { type: String },
    experience: [{
      title: { type: String },
      company: { type: String },
      duration: { type: String },
      description: { type: String }
    }],
    certifications: [{
      name: { type: String },
      issuer: { type: String },
      date: { type: Date }
    }]
  },
  
  // Community & Networking
  connections: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    type: { type: String, enum: ['Mentor', 'Mentee', 'Peer'] },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'] }
  }],
  
  // AI Recommendations
  aiRecommendations: [{
    type: { type: String, enum: ['Skill', 'Project', 'Course', 'Opportunity', 'CareerGoal', 'Personal','CareerGoals'] },
    title: { type: String },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Profile Completion
  profileCompletion: {
    basicInfo: { type: Boolean, default: false },
    academicInfo: { type: Boolean, default: false },
    interestQuiz: { type: Boolean, default: false },
    skillsAssessment: { type: Boolean, default: false },
    projects: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Index for better query performance
studentSchema.index({ 'college.name': 1, branch: 1 });
studentSchema.index({ currentYear: 1, currentSemester: 1 });

module.exports = mongoose.model('Student', studentSchema);
