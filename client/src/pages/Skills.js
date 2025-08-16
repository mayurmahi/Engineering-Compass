import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Code, Database, Smartphone, Brain, TrendingUp, Star, CheckCircle } from 'lucide-react';
import SkillsAssessment from '../components/forms/SkillsAssessment';
import LearningPaths from '../components/forms/LearningPaths';
import SkillsRecommendations from '../components/forms/SkillsRecommendations';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAssessmentStatus();
  }, []);

  const checkAssessmentStatus = async () => {
    try {
      const response = await fetch('/api/students/profile', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHasCompletedAssessment(data.profileCompletion?.skillsAssessment || false);
        setUserSkills(data.skills || []);
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
    setLoading(false);
  };

  const handleAssessmentComplete = (skillsData) => {
    setHasCompletedAssessment(true);
    setUserSkills(skillsData);
    setActiveTab('recommendations');
  };

  const skillCategories = [
    {
      id: 'web_development',
      title: 'Web Development',
      description: 'Master full-stack development with modern technologies',
      icon: <Code className="w-8 h-8 text-blue-600" />,
      duration: '12 weeks',
      level: 'Intermediate',
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'data_science',
      title: 'Data Science',
      description: 'Learn data analysis and machine learning fundamentals',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      duration: '16 weeks',
      level: 'Advanced',
      color: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'mobile_development',
      title: 'Mobile Development',
      description: 'Build cross-platform mobile applications',
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      duration: '10 weeks',
      level: 'Intermediate',
      color: 'border-green-200 hover:border-green-300'
    },
    {
      id: 'database_management',
      title: 'Database Management',
      description: 'Master database design and management',
      icon: <Database className="w-8 h-8 text-orange-600" />,
      duration: '8 weeks',
      level: 'Beginner',
      color: 'border-orange-200 hover:border-orange-300'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'assessment', label: 'Assessment', icon: <Target className="w-5 h-5" /> },
    { id: 'learning-paths', label: 'Learning Paths', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <Star className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Hub</h1>
        <p className="text-gray-600">Master the skills that will shape your engineering career</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
              {tab.id === 'assessment' && hasCompletedAssessment && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Skills Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillCategories.map((category) => (
                <div key={category.id} className={`card hover:shadow-lg transition-shadow cursor-pointer ${category.color}`}>
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-lg font-semibold ml-3">{category.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-sm text-primary-600">
                    <span>{category.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{category.level}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Skills */}
            {userSkills.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Your Current Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSkills.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
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

            {/* Call to Action */}
            <div className="text-center py-8 card">
              {!hasCompletedAssessment ? (
                <div>
                  <Target className="w-16 h-16 mx-auto mb-4 text-primary-600" />
                  <h3 className="text-xl font-semibold mb-2">Start Your Skills Journey</h3>
                  <p className="text-gray-600 mb-4">Take our AI-powered assessment to get personalized learning recommendations</p>
                  <button 
                    onClick={() => setActiveTab('assessment')}
                    className="btn-primary"
                  >
                    Take Skills Assessment
                  </button>
                </div>
              ) : (
                <div>
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Learn!</h3>
                  <p className="text-gray-600 mb-4">Explore curated learning paths and get personalized recommendations</p>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setActiveTab('learning-paths')}
                      className="btn-primary"
                    >
                      Browse Learning Paths
                    </button>
                    <button 
                      onClick={() => setActiveTab('recommendations')}
                      className="btn-secondary"
                    >
                      View Recommendations
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <SkillsAssessment onComplete={handleAssessmentComplete} />
        )}

        {activeTab === 'learning-paths' && (
          <LearningPaths />
        )}

        {activeTab === 'recommendations' && (
          hasCompletedAssessment ? (
            <SkillsRecommendations />
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Assessment Required</h3>
              <p className="text-gray-600 mb-4">Complete your skills assessment to unlock personalized recommendations</p>
              <button 
                onClick={() => setActiveTab('assessment')}
                className="btn-primary"
              >
                Take Assessment
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Skills;
