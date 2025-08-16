import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, CheckCircle, ArrowRight, ExternalLink, Star } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const LearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(null);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchLearningPaths();
    fetchUserProgress();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await fetch('/api/skills/learning-paths', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLearningPaths(data);
      }
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    }
    setLoading(false);
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/skills/progress', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const startLearningPath = async (pathId) => {
    try {
      const response = await fetch('/api/skills/start-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ pathId })
      });

      if (response.ok) {
        fetchUserProgress();
      }
    } catch (error) {
      console.error('Error starting learning path:', error);
    }
  };

  const markStepComplete = async (pathId, stepNumber) => {
    try {
      const response = await fetch('/api/skills/complete-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ pathId, stepNumber })
      });

      if (response.ok) {
        fetchUserProgress();
      }
    } catch (error) {
      console.error('Error marking step complete:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (pathId, totalSteps) => {
    const pathProgress = userProgress[pathId];
    if (!pathProgress) return 0;
    return (pathProgress.completedSteps.length / totalSteps) * 100;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading learning paths...</p>
      </div>
    );
  }

  if (selectedPath) {
    const pathProgress = userProgress[selectedPath.id] || { completedSteps: [], startedAt: null };
    const progressPercentage = getProgressPercentage(selectedPath.id, selectedPath.steps.length);

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedPath(null)}
            className="btn-secondary mb-4"
          >
            ← Back to Learning Paths
          </button>
          
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPath.title}</h2>
                <p className="text-gray-600 mb-4">{selectedPath.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedPath.difficulty)}`}>
                    {selectedPath.difficulty}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedPath.duration}
                  </span>
                </div>
              </div>
              
              {!pathProgress.startedAt ? (
                <button
                  onClick={() => startLearningPath(selectedPath.id)}
                  className="btn-primary"
                >
                  Start Learning Path
                </button>
              ) : (
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Progress</div>
                  <div className="text-2xl font-bold text-primary-600">{Math.round(progressPercentage)}%</div>
                </div>
              )}
            </div>

            {pathProgress.startedAt && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {selectedPath.steps.map((step, index) => {
            const isCompleted = pathProgress.completedSteps.includes(step.step);
            const isNext = !isCompleted && (index === 0 || pathProgress.completedSteps.includes(selectedPath.steps[index - 1].step));

            return (
              <div key={step.step} className={`card ${isCompleted ? 'bg-green-50 border-green-200' : isNext ? 'border-primary-200' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isCompleted ? 'bg-green-500 text-white' : isNext ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.step}
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 ml-11">{step.description}</p>
                    
                    <div className="ml-11">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4 mr-1" />
                        Estimated time: {step.estimatedTime}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Resources:</div>
                        {step.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {resource.includes('youtube') ? 'Video Tutorial' : 
                             resource.includes('freecodecamp') ? 'FreeCodeCamp Course' :
                             resource.includes('coursera') ? 'Coursera Course' :
                             'Learning Resource'}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {pathProgress.startedAt && isNext && !isCompleted && (
                    <button
                      onClick={() => markStepComplete(selectedPath.id, step.step)}
                      className="btn-primary"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Curated Learning Paths</h2>
        <p className="text-gray-600">Structured learning journeys to master engineering skills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => {
          const progressPercentage = getProgressPercentage(path.id, path.steps.length);
          const isStarted = userProgress[path.id]?.startedAt;

          return (
            <div key={path.id} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPath(path)}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                {isStarted && (
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="text-sm font-bold text-primary-600">{Math.round(progressPercentage)}%</div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{path.description}</p>
              
              {isStarted && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                  <span className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {path.duration}
                  </span>
                </div>
                
                <ArrowRight className="w-4 h-4 text-primary-600" />
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="w-4 h-4 mr-1" />
                  {path.steps.length} steps to completion
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPaths;