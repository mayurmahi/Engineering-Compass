const express = require('express');
const router = express.Router();
const OpenAI = require('openai'); // Gemini की जगह OpenAI लाइब्रेरी
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// OpenRouter API Key को environment variables से लोड करें
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('FATAL ERROR: OPENROUTER_API_KEY is not defined in the environment variables.');
}

// OpenRouter के लिए OpenAI client को कॉन्फ़िगर करें
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1', // OpenRouter का URL
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // (Optional) अपने प्रोजेक्ट का URL
    'X-Title': 'Engineering Compass',      // (Optional) अपने प्रोजेक्ट का नाम
  },
});

// AI से मिले टेक्स्ट को सुरक्षित रूप से JSON में बदलने के लिए हेल्पर फंक्शन
const safeJsonParse = (text) => {
  const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedText);
};

// GET: AI recommendations for student (UPDATED FOR OPENROUTER)
router.post('/recommendations', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const prompt = `
      Generate 5 personalized recommendations for this engineering student:
      Student Profile: ${JSON.stringify({ branch: student.branch, skills: student.skills.map(s => s.name), careerGoals: student.careerGoals })}
      Return ONLY a valid JSON object in the specified format:
      { "recommendations": [{"type": "Skill|Project", "title": "...", "description": "...", "priority": "High|Medium|Low"}] }
    `;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    let recommendations;
    try {
      recommendations = safeJsonParse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response (recommendations):', parseError, { originalText: text });
      return res.status(500).json({ message: 'AI response was not valid JSON.' });
    }

    student.aiRecommendations = recommendations.recommendations;
    await student.save();
    res.json(recommendations);
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
});

// POST: AI Chatbot for doubts (UPDATED FOR OPENROUTER)
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const prompt = `
      You are an AI mentor for an engineering student.
      Student Context: Branch - ${student.branch}, Skills - ${student.skills.map(s => s.name).join(', ')}.
      Previous Context: ${context || 'None'}
      Student Question: "${message}"
      Provide a helpful, concise, and encouraging response.
    `;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = completion.choices[0].message.content;
    res.json({ response: text, timestamp: new Date() });
  } catch (error) {
    console.error('AI chat error:', error);
    const fallbackResponse = "I'm having trouble processing your request right now. Please try again.";
    res.status(200).json({ response: fallbackResponse, timestamp: new Date() });
  }
});

// POST: Generate weekly focus tasks (UPDATED FOR OPENROUTER)
router.post('/weekly-focus', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const prompt = `
      Generate 3 specific, actionable weekly tasks for this engineering student:
      Profile: ${JSON.stringify({ branch: student.branch, year: student.currentYear, goals: student.careerGoals })}
      Return ONLY a valid JSON object in the specified format:
      { "tasks": [{"title": "...", "description": "...", "category": "Academic|Skill|Career", "estimatedTime": "X hours"}] }
    `;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    let weeklyTasks;
    try {
      weeklyTasks = safeJsonParse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response (weekly-focus):', parseError, { originalText: text });
      return res.status(500).json({ message: 'AI response was not valid JSON.' });
    }

    student.weeklyFocus = {
      currentWeek: Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)),
      tasks: weeklyTasks.tasks.map(task => ({ ...task, completed: false }))
    };
    await student.save();
    res.json(weeklyTasks);
  } catch (error) {
    console.error('Weekly focus generation error:', error);
    res.status(500).json({ message: 'Error generating weekly tasks' });
  }
});

// POST: Generate project ideas (UPDATED FOR OPENROUTER)
router.post('/project-ideas', auth, async (req, res) => {
  try {
    const { complexity = 'Intermediate' } = req.body;
    const student = await Student.findById(req.user.id);

    const prompt = `
      Generate 5 project ideas for a ${student.branch} student at ${complexity} level.
      Student Skills: ${student.skills.map(s => s.name).join(', ')}.
      Return ONLY a valid JSON object in the specified format:
      { "projects": [{"title": "...", "description": "...", "technologies": ["...", "..."], "difficulty": "${complexity}"}] }
    `;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    let projectIdeas;
    try {
      projectIdeas = safeJsonParse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response (project-ideas):', parseError, { originalText: text });
      return res.status(500).json({ message: 'AI response was not valid JSON.' });
    }

    res.json(projectIdeas);
  } catch (error) {
    console.error('Project ideas generation error:', error);
    res.status(500).json({ message: 'Error generating project ideas' });
  }
});

// POST: Resume enhancement suggestions (UPDATED FOR OPENROUTER)
router.post('/resume-enhancement', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const prompt = `
      Analyze this student's profile and provide resume enhancement suggestions.
      Profile: ${JSON.stringify({ branch: student.branch, cgpa: student.cgpa.current, skills: student.skills, projects: student.projects.map(p => p.title) })}
      Return ONLY a valid JSON object in the specified format:
      { "summary": "...", "skillEnhancements": [{"skill": "...", "suggestion": "..."}], "projectEnhancements": [{"project": "...", "enhancedDescription": "..."}], "missingElements": ["..."] }
    `;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;
    let resumeSuggestions;
    try {
      resumeSuggestions = safeJsonParse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response (resume-enhancement):', parseError, { originalText: text });
      return res.status(500).json({ message: 'AI response was not valid JSON.' });
    }

    res.json(resumeSuggestions);
  } catch (error) {
    console.error('Resume enhancement error:', error);
    res.status(500).json({ message: 'Error generating resume suggestions' });
  }
});

module.exports = router;