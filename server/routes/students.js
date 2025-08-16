const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// @route   GET api/students/dashboard
// @desc    Get student dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate progress metrics
    const completedGoals = student.timelineGoals.reduce((total, semester) => {
      return total + semester.goals.filter(goal => goal.completed).length;
    }, 0);

    const totalGoals = student.timelineGoals.reduce((total, semester) => {
      return total + semester.goals.length;
    }, 0);

    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Get current semester goals
    const currentSemesterGoals = student.timelineGoals.find(
      semester => semester.semester === student.currentSemester
    ) || { goals: [] };

    // Get all goals for timeline view
    const allGoals = student.timelineGoals.reduce((acc, semester) => {
      semester.goals.forEach(goal => {
        acc.push({
          ...goal.toObject(),
          semester: semester.semester
        });
      });
      return acc;
    }, []);

    const dashboardData = {
      student: {
        name: student.name,
        college: student.college,
        branch: student.branch,
        currentYear: student.currentYear,
        currentSemester: student.currentSemester,
        cgpa: student.cgpa,
        profileCompletion: student.profileCompletion
      },
      progress: {
        completedGoals,
        totalGoals,
        progressPercentage,
        currentSemesterGoals: currentSemesterGoals.goals,
        allGoals: allGoals
      },
      weeklyFocus: student.weeklyFocus,
      recentRecommendations: student.aiRecommendations.slice(0, 3)
    };

    res.json(dashboardData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/students/cgpa
// @desc    Update CGPA and semester marks
// @access  Private
router.put('/cgpa', auth, async (req, res) => {
  try {
    const { semester, gpa, subjects } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update or add semester data
    const existingSemesterIndex = student.cgpa.semesterWise.findIndex(
      s => s.semester === semester
    );

    if (existingSemesterIndex !== -1) {
      student.cgpa.semesterWise[existingSemesterIndex] = { semester, gpa, subjects };
    } else {
      student.cgpa.semesterWise.push({ semester, gpa, subjects });
    }

    // Calculate current CGPA
    const totalCredits = student.cgpa.semesterWise.reduce((total, sem) => {
      return total + sem.subjects.reduce((semTotal, subject) => semTotal + subject.credits, 0);
    }, 0);

    const totalGradePoints = student.cgpa.semesterWise.reduce((total, sem) => {
      return total + sem.subjects.reduce((semTotal, subject) => {
        const gradePoints = getGradePoints(subject.grade);
        return semTotal + (gradePoints * subject.credits);
      }, 0);
    }, 0);

    student.cgpa.current = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    await student.save();

    res.json({ 
      message: 'CGPA updated successfully',
      currentCGPA: student.cgpa.current
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to convert grades to points
function getGradePoints(grade) {
  const gradeMap = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  return gradeMap[grade] || 0;
}

// @route   POST api/students/timeline-goals
// @desc    Add timeline goals for a semester
// @access  Private
router.post('/timeline-goals', auth, async (req, res) => {
  try {
    const { semester, goals } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if semester already exists
    const existingSemesterIndex = student.timelineGoals.findIndex(
      s => s.semester === semester
    );

    if (existingSemesterIndex !== -1) {
      student.timelineGoals[existingSemesterIndex].goals = goals;
    } else {
      student.timelineGoals.push({ semester, goals });
    }

    await student.save();
    res.json({ message: 'Timeline goals updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/students/timeline-goals/:semester/:goalId
// @desc    Update specific goal completion status
// @access  Private
router.put('/timeline-goals/:semester/:goalId', auth, async (req, res) => {
  try {
    const { semester, goalId } = req.params;
    const { completed } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const semesterIndex = student.timelineGoals.findIndex(s => s.semester == semester);
    if (semesterIndex === -1) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const goalIndex = student.timelineGoals[semesterIndex].goals.findIndex(g => g._id == goalId);
    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    student.timelineGoals[semesterIndex].goals[goalIndex].completed = completed;
    await student.save();

    res.json({ message: 'Goal status updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/students/weekly-focus
// @desc    Add weekly focus tasks
// @access  Private
router.post('/weekly-focus', auth, async (req, res) => {
  try {
    const { currentWeek, tasks } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.weeklyFocus = { currentWeek, tasks };
    await student.save();

    res.json({ message: 'Weekly focus tasks updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/students/weekly-focus/:taskId
// @desc    Update weekly focus task completion
// @access  Private
router.put('/weekly-focus/:taskId', auth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const taskIndex = student.weeklyFocus.tasks.findIndex(t => t._id == taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    student.weeklyFocus.tasks[taskIndex].completed = completed;
    await student.save();

    res.json({ message: 'Task status updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/students/initialize-sample-data
// @desc    Initialize sample data for new students
// @access  Private
router.post('/initialize-sample-data', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Add sample timeline goals
    const sampleGoals = [
      {
        semester: student.currentSemester,
        goals: [
          {
            title: 'Master Data Structures',
            description: 'Complete 50+ problems on arrays, linked lists, and trees',
            completed: false,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          },
          {
            title: 'Build a Web Project',
            description: 'Create a full-stack web application using React and Node.js',
            completed: false,
            dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 days from now
          },
          {
            title: 'Improve CGPA',
            description: 'Score above 8.5 in current semester',
            completed: false,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
          }
        ]
      }
    ];

    // Add sample weekly focus tasks
    const sampleWeeklyFocus = {
      currentWeek: 1,
      tasks: [
        {
          title: 'Solve 10 Array Problems',
          description: 'Practice array manipulation and searching algorithms',
          completed: false,
          category: 'Coding'
        },
        {
          title: 'Update LinkedIn Profile',
          description: 'Add recent projects and skills to your profile',
          completed: false,
          category: 'Networking'
        },
        {
          title: 'Watch Communication Skills Video',
          description: '20-minute video on effective communication',
          completed: false,
          category: 'Soft Skills'
        }
      ]
    };

    // Add sample AI recommendations
    const sampleRecommendations = [
      {
        type: 'Skill',
        title: 'Learn React.js',
        description: 'Based on your interest in web development',
        priority: 'High',
        createdAt: new Date()
      },
      {
        type: 'Project',
        title: 'Build a Portfolio Website',
        description: 'Showcase your skills and projects',
        priority: 'Medium',
        createdAt: new Date()
      },
      {
        type: 'Course',
        title: 'Data Structures & Algorithms',
        description: 'Essential for technical interviews',
        priority: 'High',
        createdAt: new Date()
      }
    ];

    // Update student data
    student.timelineGoals = sampleGoals;
    student.weeklyFocus = sampleWeeklyFocus;
    student.aiRecommendations = sampleRecommendations;

    await student.save();
    res.json({ message: 'Sample data initialized successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/students/opportunities
// @desc    Get personalized opportunities
// @access  Private
router.get('/opportunities', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Mock opportunities data - in real app, this would be scraped from various sources
    const opportunities = [
      {
        id: 1,
        title: 'Google Summer of Code 2024',
        type: 'Internship',
        company: 'Google',
        deadline: '2024-03-15',
        description: 'Open source internship program',
        eligibility: ['Computer Science', 'Information Technology'],
        skills: ['Programming', 'Open Source'],
        link: 'https://summerofcode.withgoogle.com'
      },
      {
        id: 2,
        title: 'Microsoft Learn Student Ambassador',
        type: 'Program',
        company: 'Microsoft',
        deadline: '2024-02-28',
        description: 'Student ambassador program',
        eligibility: ['All Branches'],
        skills: ['Leadership', 'Communication'],
        link: 'https://studentambassadors.microsoft.com'
      },
      {
        id: 3,
        title: 'HackMIT 2024',
        type: 'Hackathon',
        company: 'MIT',
        deadline: '2024-04-01',
        description: 'Annual hackathon at MIT',
        eligibility: ['Computer Science', 'Information Technology'],
        skills: ['Programming', 'Innovation'],
        link: 'https://hackmit.org'
      }
    ];

    // Filter opportunities based on student's branch and skills
    const filteredOpportunities = opportunities.filter(opp => {
      return opp.eligibility.includes('All Branches') || 
             opp.eligibility.includes(student.branch);
    });

    res.json(filteredOpportunities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
