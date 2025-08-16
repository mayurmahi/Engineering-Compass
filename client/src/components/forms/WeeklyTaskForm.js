import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Plus, Clock } from 'lucide-react';

const WeeklyTaskForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    { title: '', description: '', category: 'Academic', estimatedTime: '2 hours', completed: false }
  ]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Academic',
    'Skill Development',
    'Career',
    'Personal',
    'Coding',
    'Networking',
    'Soft Skills'
  ];

  const timeOptions = [
    '30 minutes',
    '1 hour',
    '2 hours',
    '3 hours',
    '4 hours',
    '5 hours',
    '6+ hours'
  ];

  const addTask = () => {
    setTasks([...tasks, { title: '', description: '', category: 'Academic', estimatedTime: '2 hours', completed: false }]);
  };

  const removeTask = (index) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const updateTask = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate tasks
    const validTasks = tasks.filter(task => task.title.trim() && task.description.trim());
    if (validTasks.length === 0) {
      toast.error('Please add at least one task with title and description');
      return;
    }

    setLoading(true);
    try {
      const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      
      await axios.post('/api/students/weekly-focus', {
        currentWeek: currentWeek,
        tasks: validTasks.map(task => ({
          title: task.title.trim(),
          description: task.description.trim(),
          category: task.category,
          estimatedTime: task.estimatedTime,
          completed: false
        }))
      });

      toast.success('Weekly tasks added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding weekly tasks:', error);
      toast.error('Failed to add weekly tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Add Weekly Focus Tasks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {tasks.map((task, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Task {index + 1}</h3>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(index, 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Solve 10 Array Problems"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={task.description}
                    onChange={(e) => updateTask(index, 'description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe what you need to do..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={task.category}
                      onChange={(e) => updateTask(index, 'category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Time
                    </label>
                    <div className="relative">
                      <select
                        value={task.estimatedTime}
                        onChange={(e) => updateTask(index, 'estimatedTime', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTask}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Task</span>
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
              {loading ? 'Adding...' : 'Add Tasks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeeklyTaskForm;
