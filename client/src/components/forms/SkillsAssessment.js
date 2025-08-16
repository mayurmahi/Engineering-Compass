import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, Clock, Target, ArrowRight, Lightbulb } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SkillsAssessment = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(true);

  const skillCategories = [
    {
      id: 'programming',
      name: 'Programming & Development',
      icon: <Brain className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'web_development',
      name: 'Web Development',
      icon: <Target className="w-6 h-6" />,
      color: 'green'
    },
    {
      id: 'data_science',
      name: 'Data Science & Analytics',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 'mobile_development',
      name: 'Mobile Development',
      icon: <Clock className="w-6 h-6" />,
      color: 'orange'
    },
    {
      id: 'devops',
      name: 'DevOps & Cloud',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'indigo'
    }
  ];

  useEffect(() => {
    generateAIQuestions();
  }, []);

  const generateAIQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch('/api/skills/ai-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          categories: skillCategories.map(cat => cat.id)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiQuestions(data.questions);
      } else {
        // Fallback to static questions if AI fails
        setAiQuestions(getStaticQuestions());
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      setAiQuestions(getStaticQuestions());
    }
    setIsGeneratingQuestions(false);
  };

  const getStaticQuestions = () => [
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
    },
    {
      id: 3,
      category: 'data_science',
      question: 'What is your experience with data analysis and machine learning?',
      type: 'multiple_choice',
      options: [
        { value: 'none', label: 'No experience', score: 0 },
        { value: 'basic', label: 'Basic understanding', score: 1 },
        { value: 'intermediate', label: 'Some practical experience', score: 2 },
        { value: 'advanced', label: 'Strong experience', score: 3 }
      ]
    },
    {
      id: 4,
      category: 'mobile_development',
      question: 'Have you developed mobile applications?',
      type: 'multiple_choice',
      options: [
        { value: 'none', label: 'No experience', score: 0 },
        { value: 'learning', label: 'Currently learning', score: 1 },
        { value: 'basic', label: 'Built simple apps', score: 2 },
        { value: 'experienced', label: 'Published apps to stores', score: 3 }
      ]
    },
    {
      id: 5,
      category: 'devops',
      question: 'What is your familiarity with DevOps and cloud technologies?',
      type: 'multiple_choice',
      options: [
        { value: 'none', label: 'No experience', score: 0 },
        { value: 'basic', label: 'Basic knowledge', score: 1 },
        { value: 'intermediate', label: 'Some hands-on experience', score: 2 },
        { value: 'advanced', label: 'Experienced with CI/CD and cloud platforms', score: 3 }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextStep = () => {
    if (currentStep < aiQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const skillsData = processAnswers();
      const response = await fetch('/api/skills/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ skills: skillsData })
      });

      if (response.ok) {
        onComplete(skillsData);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
    setLoading(false);
  };

  const processAnswers = () => {
    const skillsData = [];
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = aiQuestions.find(q => q.id.toString() === questionId);
      if (question) {
        if (question.type === 'multiple_select' && Array.isArray(answer)) {
          answer.forEach(selectedOption => {
            const option = question.options.find(opt => opt.value === selectedOption);
            if (option) {
              skillsData.push({
                name: option.label,
                level: getSkillLevel(option.score),
                category: question.category
              });
            }
          });
        } else if (question.type === 'multiple_choice') {
          const option = question.options.find(opt => opt.value === answer);
          if (option && option.score > 0) {
            skillsData.push({
              name: skillCategories.find(cat => cat.id === question.category)?.name || question.category,
              level: getSkillLevel(option.score),
              category: question.category
            });
          }
        }
      }
    });

    return skillsData;
  };

  const getSkillLevel = (score) => {
    if (score >= 3) return 'Advanced';
    if (score >= 2) return 'Intermediate';
    if (score >= 1) return 'Beginner';
    return 'None';
  };

  if (isGeneratingQuestions) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 mx-auto mb-4 text-primary-600 animate-pulse" />
        <h3 className="text-xl font-semibold mb-2">AI is Generating Personalized Questions</h3>
        <p className="text-gray-600">Creating a customized assessment just for you...</p>
        <LoadingSpinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h3 className="text-xl font-semibold mb-2">Processing Your Assessment</h3>
        <p className="text-gray-600">Analyzing your skills and generating recommendations...</p>
        <LoadingSpinner />
      </div>
    );
  }

  const currentQuestion = aiQuestions[currentStep];
  const progress = ((currentStep + 1) / aiQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentStep + 1} of {aiQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          {skillCategories.find(cat => cat.id === currentQuestion?.category)?.icon}
          <h3 className="text-lg font-semibold ml-3">{currentQuestion?.question}</h3>
        </div>

        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => (
            <label
              key={option.value}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                currentQuestion.type === 'multiple_choice'
                  ? answers[currentQuestion.id] === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                  : Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option.value)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <input
                  type={currentQuestion.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                  name={`question-${currentQuestion.id}`}
                  value={option.value}
                  checked={
                    currentQuestion.type === 'multiple_choice'
                      ? answers[currentQuestion.id] === option.value
                      : Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option.value)
                  }
                  onChange={(e) => {
                    if (currentQuestion.type === 'multiple_choice') {
                      handleAnswer(currentQuestion.id, option.value);
                    } else {
                      const currentAnswers = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswer(currentQuestion.id, [...currentAnswers, option.value]);
                      } else {
                        handleAnswer(currentQuestion.id, currentAnswers.filter(val => val !== option.value));
                      }
                    }
                  }}
                  className="mr-3"
                />
                <span className="text-gray-700">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={!answers[currentQuestion?.id]}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {currentStep === aiQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SkillsAssessment;