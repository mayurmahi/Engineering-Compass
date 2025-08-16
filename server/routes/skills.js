const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// OpenRouter AI Integration
const generateAIQuestions = async (categories, studentProfile = null) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://engineering-compass.com',
        'X-Title': 'Engineering Compass'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant helping to create personalized skills assessment questions for engineering students. Generate 5-7 relevant questions in JSON format.'
          },
          {
            role: 'user',
            content: `Generate assessment questions for these skill categories: ${categories.join(', ')}. 
            ${studentProfile ? `Student profile: Branch - ${studentProfile.branch}, Career Goals - ${studentProfile.careerGoals?.join(', ')}` : ''}
            
            Return JSON format:
            {
              "questions": [
                {
                  "id": 1,
                  "category": "category_name",
                  "question": "Question text?",
                  "type": "multiple_choice" or "multiple_select",
                  "options": [
                    {"value": "option_key", "label": "Option text", "score": 1-4}
                  ]
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        const parsed = JSON.parse(content);
        return parsed.questions;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return null;
      }
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
  }
  
  return null;
};

// @route   POST api/skills/ai-assessment
// @desc    Generate AI-powered assessment questions
// @access  Private
router.post('/ai-assessment', auth, async (req, res) => {
  try {
    const { categories } = req.body;
    const student = await Student.findById(req.user.id);
    
    const aiQuestions = await generateAIQuestions(categories, student);
    
    if (aiQuestions) {
      res.json({ questions: aiQuestions });
    } else {
      // Fallback to default questions
      const defaultQuestions = [
        {
          id: 1,
          category: 'programming',
          question: 'What is your experience level with programming languages?',
          type: 'multiple_choice',
          options: [
            { value: 'beginner', label: 'Beginner (0-1 years)', score: 1 },
            { value: 'intermediate', label: 'Intermediate (1-3 years)', score: 2 },
            { value: 'advanced', label: 'Advanced (3-5 years)', score: 3 },
            { value: 'expert', label: 'Expert (5+ years)', score: 4 }
          ]
        },
        {
          id: 2,
          category: 'web_development',
          question: 'Which web development technologies are you familiar with?',
          type: 'multiple_select',
          options: [
            { value: 'html_css', label: 'HTML/CSS', score: 1 },
            { value: 'javascript', label: 'JavaScript', score: 1 },
            { value: 'react', label: 'React', score: 1 },
            { value: 'nodejs', label: 'Node.js', score: 1 },
            { value: 'databases', label: 'Databases (SQL/NoSQL)', score: 1 }
          ]
        }
      ];
      res.json({ questions: defaultQuestions });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/skills/learning-paths
// @desc    Get curated learning paths
// @access  Private
router.get('/learning-paths', auth, async (req, res) => {
  try {
    const learningPaths = [
      {
        id: 1,
        title: 'Full-Stack Web Development',
        description: 'Master modern web development from frontend to backend',
        difficulty: 'Intermediate',
        duration: '12 weeks',
        steps: [
          {
            step: 1,
            title: 'HTML & CSS Fundamentals',
            description: 'Learn the basics of web markup and styling',
            resources: [
              'https://developer.mozilla.org/en-US/docs/Learn/HTML',
              'https://developer.mozilla.org/en-US/docs/Learn/CSS',
              'https://www.freecodecamp.org/learn/responsive-web-design/'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 2,
            title: 'JavaScript Essentials',
            description: 'Master JavaScript programming fundamentals',
            resources: [
              'https://javascript.info/',
              'https://eloquentjavascript.net/',
              'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/'
            ],
            estimatedTime: '3 weeks'
          },
          {
            step: 3,
            title: 'React.js Framework',
            description: 'Build modern user interfaces with React',
            resources: [
              'https://react.dev/learn',
              'https://www.freecodecamp.org/learn/front-end-development-libraries/',
              'https://www.youtube.com/watch?v=bMknfKXIFA8'
            ],
            estimatedTime: '3 weeks'
          },
          {
            step: 4,
            title: 'Node.js & Express',
            description: 'Create robust backend APIs',
            resources: [
              'https://nodejs.org/en/learn/',
              'https://expressjs.com/',
              'https://www.freecodecamp.org/learn/back-end-development-and-apis/'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 5,
            title: 'Database Integration',
            description: 'Connect your app with MongoDB',
            resources: [
              'https://www.mongodb.com/developer/languages/javascript/',
              'https://mongoosejs.com/docs/',
              'https://www.freecodecamp.org/learn/back-end-development-and-apis/'
            ],
            estimatedTime: '2 weeks'
          }
        ]
      },
      {
        id: 2,
        title: 'Data Science & Machine Learning',
        description: 'Learn data analysis and ML fundamentals',
        difficulty: 'Advanced',
        duration: '16 weeks',
        steps: [
          {
            step: 1,
            title: 'Python Programming',
            description: 'Master Python for data science',
            resources: [
              'https://www.python.org/doc/',
              'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
              'https://www.youtube.com/watch?v=_uQrJ0TkZlc'
            ],
            estimatedTime: '3 weeks'
          },
          {
            step: 2,
            title: 'Data Analysis with Pandas',
            description: 'Learn data manipulation and analysis',
            resources: [
              'https://pandas.pydata.org/docs/',
              'https://www.kaggle.com/learn/pandas',
              'https://www.youtube.com/watch?v=dcqPhpY7tWk'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 3,
            title: 'Data Visualization',
            description: 'Create compelling data visualizations',
            resources: [
              'https://matplotlib.org/',
              'https://seaborn.pydata.org/',
              'https://plotly.com/python/'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 4,
            title: 'Machine Learning Basics',
            description: 'Introduction to ML algorithms',
            resources: [
              'https://scikit-learn.org/stable/',
              'https://www.coursera.org/learn/machine-learning',
              'https://www.kaggle.com/learn/intro-to-machine-learning'
            ],
            estimatedTime: '4 weeks'
          },
          {
            step: 5,
            title: 'Deep Learning',
            description: 'Neural networks and deep learning',
            resources: [
              'https://www.tensorflow.org/tutorials',
              'https://pytorch.org/tutorials/',
              'https://www.fast.ai/'
            ],
            estimatedTime: '5 weeks'
          }
        ]
      },
      {
        id: 3,
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile applications',
        difficulty: 'Intermediate',
        duration: '10 weeks',
        steps: [
          {
            step: 1,
            title: 'React Native Basics',
            description: 'Learn cross-platform mobile development',
            resources: [
              'https://reactnative.dev/docs/getting-started',
              'https://www.freecodecamp.org/learn/front-end-development-libraries/',
              'https://www.youtube.com/watch?v=0-S5a0eXPoc'
            ],
            estimatedTime: '3 weeks'
          },
          {
            step: 2,
            title: 'Mobile UI/UX Design',
            description: 'Design beautiful mobile interfaces',
            resources: [
              'https://www.figma.com/',
              'https://material.io/design',
              'https://developer.apple.com/design/'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 3,
            title: 'State Management',
            description: 'Manage app state with Redux',
            resources: [
              'https://redux.js.org/',
              'https://redux-toolkit.js.org/',
              'https://www.youtube.com/watch?v=CVpUuw9XSjY'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 4,
            title: 'API Integration',
            description: 'Connect your app to backend services',
            resources: [
              'https://axios-http.com/',
              'https://www.youtube.com/watch?v=Oive66jrwBs',
              'https://www.freecodecamp.org/learn/back-end-development-and-apis/'
            ],
            estimatedTime: '2 weeks'
          },
          {
            step: 5,
            title: 'App Deployment',
            description: 'Deploy to app stores',
            resources: [
              'https://expo.dev/',
              'https://developer.apple.com/app-store/',
              'https://play.google.com/console/'
            ],
            estimatedTime: '1 week'
          }
        ]
      }
    ];

    res.json(learningPaths);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/skills/assessment
// @desc    Submit skills assessment
// @access  Private
router.post('/assessment', auth, async (req, res) => {
  try {
    const { skills } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.skills = skills;
    student.profileCompletion.skillsAssessment = true;
    await student.save();

    res.json({ message: 'Skills assessment completed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/skills/recommended
// @desc    Get recommended skills based on student profile
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Skill recommendations based on branch and career goals
    const skillRecommendations = {
      'Computer Science': {
        'MNC Job': ['Data Structures', 'Algorithms', 'System Design', 'Database Management', 'Cloud Computing'],
        'Startup': ['Full-Stack Development', 'Mobile Development', 'DevOps', 'Product Management', 'UI/UX Design'],
        'MS Abroad': ['Research Methodology', 'Advanced Algorithms', 'Machine Learning', 'Computer Vision', 'Natural Language Processing'],
        'Government Job': ['Computer Networks', 'Operating Systems', 'Database Systems', 'Software Engineering', 'Information Security']
      },
      'Information Technology': {
        'MNC Job': ['Web Development', 'Database Management', 'Software Testing', 'IT Infrastructure', 'Cybersecurity'],
        'Startup': ['Full-Stack Development', 'API Development', 'DevOps', 'Product Management', 'Agile Methodologies'],
        'MS Abroad': ['Data Science', 'Machine Learning', 'Big Data Analytics', 'Cloud Computing', 'Information Systems'],
        'Government Job': ['Network Administration', 'System Administration', 'Database Administration', 'IT Security', 'Software Development']
      }
    };

    const recommendedSkills = skillRecommendations[student.branch] || {};
    const skillsForGoals = student.careerGoals.map(goal => recommendedSkills[goal] || []).flat();
    
    // Remove duplicates and skills already assessed
    const currentSkills = student.skills.map(s => s.name);
    const uniqueRecommendedSkills = [...new Set(skillsForGoals)].filter(
      skill => !currentSkills.includes(skill)
    );

    res.json({
      recommendedSkills: uniqueRecommendedSkills.slice(0, 10),
      currentSkills: student.skills
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/skills/progress
// @desc    Get user's learning progress
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ progress: student.learningProgress || {} });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/skills/start-path
// @desc    Start a learning path
// @access  Private
router.post('/start-path', auth, async (req, res) => {
  try {
    const { pathId } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.learningProgress) {
      student.learningProgress = {};
    }

    student.learningProgress[pathId] = {
      startedAt: new Date(),
      completedSteps: [],
      lastActivity: new Date()
    };

    await student.save();
    res.json({ message: 'Learning path started successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/skills/complete-step
// @desc    Mark a learning step as complete
// @access  Private
router.post('/complete-step', auth, async (req, res) => {
  try {
    const { pathId, stepNumber } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.learningProgress || !student.learningProgress[pathId]) {
      return res.status(400).json({ message: 'Learning path not started' });
    }

    const pathProgress = student.learningProgress[pathId];
    if (!pathProgress.completedSteps.includes(stepNumber)) {
      pathProgress.completedSteps.push(stepNumber);
      pathProgress.lastActivity = new Date();
    }

    await student.save();
    res.json({ message: 'Step marked as complete' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/skills/add-goal
// @desc    Add skill to learning goals
// @access  Private
router.post('/add-goal', auth, async (req, res) => {
  try {
    const { skill } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.learningGoals) {
      student.learningGoals = [];
    }

    // Check if skill is already in learning goals
    if (!student.learningGoals.includes(skill)) {
      student.learningGoals.push(skill);
      await student.save();
    }

    res.json({ message: 'Skill added to learning goals successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
