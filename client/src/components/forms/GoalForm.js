import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Plus, Calendar } from 'lucide-react';

const GoalForm = ({ onClose, onSuccess, semester }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([
    { title: '', description: '', dueDate: '', completed: false }
  ]);
  const [loading, setLoading] = useState(false);

  const addGoal = () => {
    setGoals([...goals, { title: '', description: '', dueDate: '', completed: false }]);
  };

  const removeGoal = (index) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate goals
    const validGoals = goals.filter(goal => goal.title.trim() && goal.description.trim());
    if (validGoals.length === 0) {
      toast.error('Please add at least one goal with title and description');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/students/timeline-goals', {
        semester: semester,
        goals: validGoals.map(goal => ({
          title: goal.title.trim(),
          description: goal.description.trim(),
          dueDate: goal.dueDate || null,
          completed: false
        }))
      });

      toast.success('Goals added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding goals:', error);
      toast.error('Failed to add goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Add Goals for Semester {semester}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Goal {index + 1}</h3>
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={(e) => updateGoal(index, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Master Data Structures"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={goal.description}
                    onChange={(e) => updateGoal(index, 'description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe what you want to achieve..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={goal.dueDate}
                      onChange={(e) => updateGoal(index, 'dueDate', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addGoal}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Goal</span>
          </button>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Goals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
