const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

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

module.exports = router;
