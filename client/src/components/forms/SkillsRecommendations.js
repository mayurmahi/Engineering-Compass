import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Star, BookOpen, ArrowRight, Lightbulb, Users } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SkillsRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/skills/recommended', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  const addToLearningGoals = async (skill) => {
    try {
      const response = await fetch('/api/skills/add-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ skill })
      });

      if (response.ok) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    } catch (error) {
      console.error('Error adding skill to goals:', error);
    }
  };

  const getSkillIcon = (skill) => {
    const icons = {
      'Full-Stack Development': <BookOpen className="w-5 h-5" />,
      'Data Structures': <Target className="w-5 h-5" />,
      'Machine Learning': <TrendingUp className="w-5 h-5" />,
      'Cloud Computing': <Star className="w-5 h-5" />,
      'Mobile Development': <Lightbulb className="w-5 h-5" />,
      'DevOps': <Users className="w-5 h-5" />
    };
    
    return icons[skill] || <Target className="w-5 h-5" />;
  };

  const getSkillColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-red-100 text-red-800 border-red-200'
    ];
    return colors[index % colors.length];
  };

  const getPriorityLevel = (index) => {
    if (index < 3) return { label: 'High Priority', color: 'text-red-600' };
    if (index < 6) return { label: 'Medium Priority', color: 'text-yellow-600' };
    return { label: 'Low Priority', color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Analyzing your profile for skill recommendations...</p>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Recommendations Available</h3>
        <p className="text-gray-600">Complete your profile assessment to get personalized skill recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Target className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personalized Skill Recommendations</h2>
        <p className="text-gray-600">Based on your profile, career goals, and current market trends</p>
      </div>

      {/* Current Skills Summary */}
      {recommendations.currentSkills && recommendations.currentSkills.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Your Current Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.currentSkills.map((skill, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  {getSkillIcon(skill.name)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{skill.name}</div>
                  <div className="text-sm text-gray-500">{skill.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Skills */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
          Recommended Skills to Learn
        </h3>

        {recommendations.recommendedSkills && recommendations.recommendedSkills.length > 0 ? (
          <div className="space-y-4">
            {recommendations.recommendedSkills.map((skill, index) => {
              const priority = getPriorityLevel(index);
              const isSelected = selectedSkills.includes(skill);
              
              return (
                <div key={index} className={`p-4 border-2 rounded-lg transition-all ${
                  isSelected ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-primary-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${getSkillColor(index)}`}>
                        {getSkillIcon(skill)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="text-lg font-semibold text-gray-900 mr-3">{skill}</h4>
                          <span className={`text-sm font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2">
                          {getSkillDescription(skill)}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Lightbulb className="w-4 h-4 mr-1" />
                          <span>Matches your career goals and industry trends</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isSelected ? (
                        <div className="flex items-center text-green-600">
                          <Star className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Added to Goals</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToLearningGoals(skill)}
                          className="btn-primary text-sm"
                        >
                          Add to Goals
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No specific recommendations available. Complete your skills assessment for personalized suggestions.</p>
          </div>
        )}
      </div>

      {/* Industry Insights */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
          Industry Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Most In-Demand Skills</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Full-Stack Development</li>
              <li>• Cloud Computing (AWS, Azure)</li>
              <li>• Machine Learning & AI</li>
              <li>• DevOps & CI/CD</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Emerging Technologies</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Blockchain Development</li>
              <li>• IoT Solutions</li>
              <li>• Cybersecurity</li>
              <li>• Data Science & Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const getSkillDescription = (skill) => {
  const descriptions = {
    'Full-Stack Development': 'Master both frontend and backend development to build complete web applications.',
    'Data Structures': 'Essential foundation for efficient programming and technical interviews.',
    'Algorithms': 'Problem-solving techniques crucial for software development and interviews.',
    'Machine Learning': 'Build intelligent systems that can learn and make predictions from data.',
    'Cloud Computing': 'Deploy and scale applications using modern cloud platforms like AWS and Azure.',
    'Mobile Development': 'Create mobile applications for iOS and Android platforms.',
    'DevOps': 'Streamline development and deployment processes with automation and CI/CD.',
    'System Design': 'Design scalable and reliable large-scale systems.',
    'Database Management': 'Efficiently store, retrieve, and manage data in applications.',
    'Cybersecurity': 'Protect systems and data from digital threats and vulnerabilities.',
    'UI/UX Design': 'Create intuitive and user-friendly interfaces and experiences.',
    'API Development': 'Build robust APIs for seamless communication between systems.'
  };
  
  return descriptions[skill] || 'A valuable skill for your engineering career development.';
};

export default SkillsRecommendations;