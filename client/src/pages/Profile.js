import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  Circle
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college: {
      name: user?.college?.name || '',
      tier: user?.college?.tier || '',
      university: user?.college?.university || ''
    },
    branch: user?.branch || '',
    currentYear: user?.currentYear || '',
    currentSemester: user?.currentSemester || '',
    twelfthPercentage: user?.twelfthPercentage || '',
    jeeScore: user?.jeeScore || '',
    cetScore: user?.cetScore || ''
  });
  const [loading, setLoading] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Electrical',
    'Other'
  ];

  const tiers = ['Tier-1', 'Tier-2', 'Tier-3'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      college: {
        name: user?.college?.name || '',
        tier: user?.college?.tier || '',
        university: user?.college?.university || ''
      },
      branch: user?.branch || '',
      currentYear: user?.currentYear || '',
      currentSemester: user?.currentSemester || '',
      twelfthPercentage: user?.twelfthPercentage || '',
      jeeScore: user?.jeeScore || '',
      cetScore: user?.cetScore || ''
    });
    setIsEditing(false);
  };

  const getProfileCompletion = () => {
    const sections = [
      user?.name ? 1 : 0,
      user?.email ? 1 : 0,
      user?.phone ? 1 : 0,
      user?.college?.name ? 1 : 0,
      user?.college?.tier ? 1 : 0,
      user?.college?.university ? 1 : 0,
      user?.branch ? 1 : 0,
      user?.currentYear ? 1 : 0,
      user?.currentSemester ? 1 : 0,
      user?.twelfthPercentage ? 1 : 0,
      user?.interests?.length > 0 ? 1 : 0,
      user?.careerGoals?.length > 0 ? 1 : 0,
      user?.skills?.length > 0 ? 1 : 0,
      user?.projects?.length > 0 ? 1 : 0
    ];
    return Math.round((sections.reduce((a, b) => a + b, 0) / sections.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal and academic information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Completion</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{getProfileCompletion()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProfileCompletion()}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Basic Info', completed: !!(user?.name && user?.email) },
              { name: 'Academic Info', completed: !!(user?.college?.name && user?.branch) },
              { name: 'Interests', completed: !!(user?.interests?.length > 0) },
              { name: 'Skills', completed: !!(user?.skills?.length > 0) }
            ].map((section, index) => (
              <div key={index} className="flex items-center space-x-2">
                {section.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">{section.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field pl-10"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field pl-10 bg-gray-50"
                placeholder="Email address"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Name
            </label>
            <input
              type="text"
              name="college.name"
              value={formData.college.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="input-field"
              placeholder="Enter college name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Tier
            </label>
            <select
              name="college.tier"
              value={formData.college.tier}
              onChange={handleChange}
              disabled={!isEditing}
              className="input-field"
            >
              <option value="">Select tier</option>
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            <input
              type="text"
              name="college.university"
              value={formData.college.university}
              onChange={handleChange}
              disabled={!isEditing}
              className="input-field"
              placeholder="Enter university name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={!isEditing}
              className="input-field"
            >
              <option value="">Select branch</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Year
            </label>
            <input
              type="number"
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              disabled={!isEditing}
              min="1"
              max="4"
              className="input-field"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Semester
            </label>
            <input
              type="number"
              name="currentSemester"
              value={formData.currentSemester}
              onChange={handleChange}
              disabled={!isEditing}
              min="1"
              max="8"
              className="input-field"
              placeholder="e.g., 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              12th Percentage
            </label>
            <input
              type="number"
              name="twelfthPercentage"
              value={formData.twelfthPercentage}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="100"
              step="0.01"
              className="input-field"
              placeholder="e.g., 85.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              JEE Score
            </label>
            <input
              type="number"
              name="jeeScore"
              value={formData.jeeScore}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="360"
              className="input-field"
              placeholder="e.g., 85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CET Score
            </label>
            <input
              type="number"
              name="cetScore"
              value={formData.cetScore}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="200"
              className="input-field"
              placeholder="e.g., 150"
            />
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {user?.cgpa?.current?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">Current CGPA</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {user?.skills?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Skills Assessed</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {user?.projects?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
