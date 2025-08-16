import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Circle, 
  Clock,
  BookOpen,
  Users,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Plus
} from 'lucide-react';
import GoalForm from '../components/forms/GoalForm';
import WeeklyTaskForm from '../components/forms/WeeklyTaskForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showWeeklyTaskForm, setShowWeeklyTaskForm] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await axios.get('/api/students/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalToggle = async (semester, goalId, completed) => {
    try {
      await axios.put(`/api/students/timeline-goals/${semester}/${goalId}`, {
        completed: !completed
      });
      loadDashboardData(); // Reload data
      toast.success('Goal updated successfully!');
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const handleWeeklyTaskToggle = async (taskId, completed) => {
    try {
      await axios.put(`/api/students/weekly-focus/${taskId}`, {
        completed: !completed
      });
      loadDashboardData(); // Reload data
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const initializeSampleData = async () => {
    try {
      await axios.post('/api/students/initialize-sample-data');
      loadDashboardData(); // Reload data
      toast.success('Sample data initialized successfully!');
    } catch (error) {
      toast.error('Failed to initialize sample data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { student, progress, weeklyFocus, recentRecommendations } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {student.name}! 👋
        </h1>
        <p className="text-primary-100">
          You're in {student.currentYear}nd year, {student.currentSemester}rd semester of {student.branch}
        </p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            {student.college.name} ({student.college.tier})
          </span>
          <span className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            CGPA: {student.cgpa.current.toFixed(2)} / {student.cgpa.target}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Goals Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {progress.completedGoals}/{progress.totalGoals}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {progress.progressPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Semester</p>
              <p className="text-2xl font-bold text-gray-900">
                {student.currentSemester}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentRecommendations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Target },
              { id: 'timeline', name: 'Timeline', icon: Calendar },
              { id: 'weekly', name: 'Weekly Focus', icon: Clock },
              { id: 'recommendations', name: 'AI Recommendations', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Semester Goals */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Current Semester Goals
              </h3>
              <div className="space-y-3">
                {progress.currentSemesterGoals.length > 0 ? (
                  progress.currentSemesterGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <button
                        onClick={() => handleGoalToggle(student.currentSemester, goal._id, goal.completed)}
                        className="mr-3"
                      >
                        {goal.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {goal.title}
                        </p>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No goals set for this semester yet</p>
                    <div className="flex space-x-3 justify-center mt-4">
                      <button 
                        onClick={() => setShowGoalForm(true)}
                        className="btn-primary flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Goals
                      </button>
                      <button 
                        onClick={initializeSampleData}
                        className="btn-secondary flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Sample Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Chart */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Overall Progress
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{progress.progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {progress.completedGoals} of {progress.totalGoals} goals completed
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              4-Year Engineering Timeline
            </h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((year) => (
                <div key={year} className="border-l-4 border-primary-200 pl-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    Year {year}
                  </h4>
                  <div className="space-y-3">
                    {[1, 2].map((semester) => {
                      const semNumber = (year - 1) * 2 + semester;
                      const semesterGoals = progress.allGoals.filter(
                        goal => goal.semester === semNumber
                      );
                      
                      return (
                        <div key={semester} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Semester {semNumber}
                          </h5>
                          {semesterGoals.length > 0 ? (
                            <div className="space-y-2">
                              {semesterGoals.map((goal, index) => (
                                <div key={index} className="flex items-center">
                                  <button
                                    onClick={() => handleGoalToggle(semNumber, goal._id, goal.completed)}
                                    className="mr-2"
                                  >
                                    {goal.completed ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>
                                  <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                    {goal.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No goals set</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Focus of the Week
            </h3>
            {weeklyFocus && weeklyFocus.tasks && weeklyFocus.tasks.length > 0 ? (
              <div className="space-y-4">
                {weeklyFocus.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <button
                      onClick={() => handleWeeklyTaskToggle(task._id, task.completed)}
                      className="mr-4"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}
                        <span className="mx-2">•</span>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No weekly tasks assigned yet</p>
                <div className="flex space-x-3 justify-center mt-4">
                  <button 
                    onClick={() => setShowWeeklyTaskForm(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tasks
                  </button>
                  <button 
                    onClick={initializeSampleData}
                    className="btn-secondary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Sample Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              AI Recommendations
            </h3>
            {recentRecommendations.length > 0 ? (
              <div className="space-y-4">
                {recentRecommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.priority} Priority
                          </span>
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {rec.type}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        {rec.actionItems && rec.actionItems.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-700">Action Items:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {rec.actionItems.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <ArrowRight className="w-3 h-3 mr-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recommendations available</p>
                <button 
                  onClick={initializeSampleData}
                  className="btn-primary mt-4"
                >
                  Initialize Sample Data
                </button>
              </div>
            )}
          </div>
                 )}
       </div>

       {/* Forms */}
       {showGoalForm && (
         <GoalForm
           onClose={() => setShowGoalForm(false)}
           onSuccess={loadDashboardData}
           semester={student.currentSemester}
         />
       )}

       {showWeeklyTaskForm && (
         <WeeklyTaskForm
           onClose={() => setShowWeeklyTaskForm(false)}
           onSuccess={loadDashboardData}
         />
       )}
     </div>
   );
 };

export default Dashboard;
