const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// @route   POST api/career/resume
// @desc    Update student resume
// @access  Private
router.post('/resume', auth, async (req, res) => {
  try {
    const { summary, experience, certifications } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.resume = { summary, experience, certifications };
    await student.save();

    res.json({ message: 'Resume updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/career/companies
// @desc    Get company-specific prep kits
// @access  Private
router.get('/companies', auth, async (req, res) => {
  try {
    const companies = [
      {
        id: 1,
        name: 'TCS',
        logo: 'https://via.placeholder.com/100x50/0066CC/FFFFFF?text=TCS',
        description: 'Tata Consultancy Services - IT Services and Consulting',
        prepKit: {
          aptitude: {
            topics: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Programming'],
            pattern: '90 minutes, 30 questions',
            resources: [
              'https://www.geeksforgeeks.org/tcs-nqt-preparation/',
              'https://www.indiabix.com/aptitude/questions-and-answers/',
              'https://www.hackerrank.com/domains/tutorials/10-days-of-statistics'
            ]
          },
          technical: {
            topics: ['Data Structures', 'Algorithms', 'Database', 'Programming Languages'],
            commonQuestions: [
              'What is the difference between stack and queue?',
              'Explain time complexity of binary search',
              'What are ACID properties in database?',
              'Write a program to reverse a string'
            ],
            resources: [
              'https://www.geeksforgeeks.org/tcs-interview-experience/',
              'https://www.interviewbit.com/tcs-interview-questions/',
              'https://www.hackerrank.com/domains/algorithms'
            ]
          },
          hr: {
            commonQuestions: [
              'Tell me about yourself',
              'Why do you want to join TCS?',
              'What are your strengths and weaknesses?',
              'Where do you see yourself in 5 years?'
            ],
            tips: [
              'Research about TCS values and culture',
              'Prepare examples for behavioral questions',
              'Show enthusiasm for learning and growth'
            ]
          }
        }
      },
      {
        id: 2,
        name: 'Wipro',
        logo: 'https://via.placeholder.com/100x50/DA291C/FFFFFF?text=Wipro',
        description: 'Wipro Limited - Global Information Technology Company',
        prepKit: {
          aptitude: {
            topics: ['Quantitative Aptitude', 'Verbal Ability', 'Logical Reasoning', 'Coding'],
            pattern: '60 minutes, 20 questions',
            resources: [
              'https://www.geeksforgeeks.org/wipro-nlh-preparation/',
              'https://www.indiabix.com/aptitude/questions-and-answers/',
              'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript'
            ]
          },
          technical: {
            topics: ['Programming Fundamentals', 'Data Structures', 'Database Concepts', 'Computer Networks'],
            commonQuestions: [
              'Explain different types of sorting algorithms',
              'What is normalization in database?',
              'Explain OSI model layers',
              'Write a program to find factorial'
            ],
            resources: [
              'https://www.geeksforgeeks.org/wipro-interview-experience/',
              'https://www.interviewbit.com/wipro-interview-questions/',
              'https://www.hackerrank.com/domains/data-structures'
            ]
          },
          hr: {
            commonQuestions: [
              'Introduce yourself',
              'Why Wipro?',
              'What are your career goals?',
              'How do you handle pressure?'
            ],
            tips: [
              'Learn about Wipro\'s digital transformation focus',
              'Prepare for situational questions',
              'Show adaptability and learning mindset'
            ]
          }
        }
      },
      {
        id: 3,
        name: 'Amazon',
        logo: 'https://via.placeholder.com/100x50/FF9900/000000?text=Amazon',
        description: 'Amazon - E-commerce and Cloud Computing Giant',
        prepKit: {
          aptitude: {
            topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation'],
            pattern: '90 minutes, 35 questions',
            resources: [
              'https://www.geeksforgeeks.org/amazon-interview-preparation/',
              'https://www.hackerrank.com/domains/tutorials/10-days-of-statistics',
              'https://www.interviewbit.com/amazon-interview-questions/'
            ]
          },
          technical: {
            topics: ['Data Structures', 'Algorithms', 'System Design', 'Database', 'Operating Systems'],
            commonQuestions: [
              'Implement a stack using queues',
              'Design a parking lot system',
              'Explain ACID properties',
              'What is virtual memory?'
            ],
            resources: [
              'https://www.geeksforgeeks.org/amazon-interview-experience/',
              'https://www.hackerrank.com/domains/algorithms',
              'https://www.interviewbit.com/system-design-interview-questions/'
            ]
          },
          hr: {
            commonQuestions: [
              'Tell me about a challenging project',
              'Why Amazon?',
              'What is Amazon\'s leadership principle you relate to?',
              'Describe a time you failed'
            ],
            tips: [
              'Study Amazon\'s 14 Leadership Principles',
              'Prepare STAR method answers',
              'Show customer obsession and ownership'
            ]
          }
        }
      }
    ];

    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/career/mock-interview
// @desc    Get mock interview questions
// @access  Private
router.get('/mock-interview', auth, async (req, res) => {
  try {
    const { type = 'technical', company = 'general' } = req.query;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const technicalQuestions = [
      {
        id: 1,
        question: 'What is the difference between stack and queue?',
        category: 'Data Structures',
        difficulty: 'Easy',
        expectedAnswer: 'Stack follows LIFO (Last In First Out) while Queue follows FIFO (First In First Out). Stack has push/pop operations, Queue has enqueue/dequeue operations.',
        followUpQuestions: [
          'How would you implement a stack using an array?',
          'What are the applications of stack and queue?'
        ]
      },
      {
        id: 2,
        question: 'Explain time complexity of binary search',
        category: 'Algorithms',
        difficulty: 'Medium',
        expectedAnswer: 'Binary search has O(log n) time complexity. It works by dividing the search space in half with each iteration, making it very efficient for sorted arrays.',
        followUpQuestions: [
          'What is the space complexity of binary search?',
          'When would you use binary search vs linear search?'
        ]
      },
      {
        id: 3,
        question: 'What are ACID properties in database?',
        category: 'Database',
        difficulty: 'Medium',
        expectedAnswer: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. These properties ensure reliable transaction processing in databases.',
        followUpQuestions: [
          'Explain each ACID property in detail',
          'How do databases implement these properties?'
        ]
      },
      {
        id: 4,
        question: 'Write a program to reverse a string',
        category: 'Programming',
        difficulty: 'Easy',
        expectedAnswer: 'Multiple approaches: using built-in methods, iterative approach, or recursive approach. Consider edge cases like null strings.',
        followUpQuestions: [
          'What is the time complexity of your solution?',
          'How would you handle special characters?'
        ]
      },
      {
        id: 5,
        question: 'Explain the difference between REST and GraphQL',
        category: 'Web Development',
        difficulty: 'Medium',
        expectedAnswer: 'REST is a stateless architecture style with predefined endpoints, while GraphQL is a query language that allows clients to request exactly the data they need.',
        followUpQuestions: [
          'When would you choose GraphQL over REST?',
          'What are the trade-offs of each approach?'
        ]
      }
    ];

    const hrQuestions = [
      {
        id: 1,
        question: 'Tell me about yourself',
        category: 'Introduction',
        difficulty: 'Easy',
        expectedAnswer: 'A concise 2-3 minute summary covering education, relevant experience, skills, and career goals.',
        tips: [
          'Start with current situation',
          'Highlight relevant achievements',
          'Connect to the role you\'re applying for'
        ]
      },
      {
        id: 2,
        question: 'Why do you want to join this company?',
        category: 'Motivation',
        difficulty: 'Medium',
        expectedAnswer: 'Show research about the company, align your values with company culture, and connect your skills to the role.',
        tips: [
          'Research company values and mission',
          'Connect your background to the role',
          'Show enthusiasm and genuine interest'
        ]
      },
      {
        id: 3,
        question: 'What are your strengths and weaknesses?',
        category: 'Self-Assessment',
        difficulty: 'Medium',
        expectedAnswer: 'Strengths: Provide specific examples. Weaknesses: Show self-awareness and steps taken to improve.',
        tips: [
          'Use specific examples for strengths',
          'Show growth mindset for weaknesses',
          'Keep it professional and relevant'
        ]
      },
      {
        id: 4,
        question: 'Describe a challenging project you worked on',
        category: 'Experience',
        difficulty: 'Hard',
        expectedAnswer: 'Use STAR method: Situation, Task, Action, Result. Focus on your role, challenges faced, and outcomes achieved.',
        tips: [
          'Use STAR method structure',
          'Quantify results when possible',
          'Show problem-solving skills'
        ]
      },
      {
        id: 5,
        question: 'Where do you see yourself in 5 years?',
        category: 'Career Goals',
        difficulty: 'Medium',
        expectedAnswer: 'Show realistic career progression, alignment with company growth, and continuous learning mindset.',
        tips: [
          'Show ambition but be realistic',
          'Connect to company opportunities',
          'Emphasize continuous learning'
        ]
      }
    ];

    const questions = type === 'technical' ? technicalQuestions : hrQuestions;
    
    // Filter questions based on student's skills and branch
    const relevantQuestions = questions.filter(q => {
      if (type === 'technical') {
        return student.skills.some(skill => 
          skill.name.toLowerCase().includes(q.category.toLowerCase()) ||
          q.category === 'Programming' ||
          q.category === 'Algorithms'
        );
      }
      return true; // All HR questions are relevant
    });

    res.json({
      type,
      company,
      questions: relevantQuestions.slice(0, 5), // Return 5 questions
      studentContext: {
        branch: student.branch,
        skills: student.skills.map(s => s.name),
        careerGoals: student.careerGoals
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/career/interview-feedback
// @desc    Submit mock interview feedback
// @access  Private
router.post('/interview-feedback', auth, async (req, res) => {
  try {
    const { answers, questionIds, type } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // In a real application, this would use AI to analyze answers
    // For now, we'll provide basic feedback
    const feedback = {
      overallScore: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
      strengths: [
        'Good technical knowledge',
        'Clear communication',
        'Problem-solving approach'
      ],
      areasForImprovement: [
        'Practice more coding problems',
        'Improve time management',
        'Work on system design concepts'
      ],
      recommendations: [
        'Solve 2-3 coding problems daily',
        'Practice mock interviews regularly',
        'Read system design blogs'
      ]
    };

    res.json({
      message: 'Interview feedback generated successfully',
      feedback
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
