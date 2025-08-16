import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, GraduationCap, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: {
      name: '',
      tier: '',
      university: ''
    },
    branch: '',
    admissionYear: '',
    currentYear: '',
    currentSemester: '',
    twelfthPercentage: '',
    jeeScore: '',
    cetScore: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.college.name || !formData.college.tier || !formData.college.university) {
      toast.error('Please fill in all college information');
      return false;
    }
    if (!formData.branch || !formData.admissionYear || !formData.currentYear || !formData.currentSemester) {
      toast.error('Please fill in all academic information');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    // Prepare data for registration
    const registrationData = {
      ...formData,
      admissionYear: parseInt(formData.admissionYear),
      currentYear: parseInt(formData.currentYear),
      currentSemester: parseInt(formData.currentSemester),
      twelfthPercentage: formData.twelfthPercentage ? parseFloat(formData.twelfthPercentage) : undefined,
      jeeScore: formData.jeeScore ? parseInt(formData.jeeScore) : undefined,
      cetScore: formData.cetScore ? parseInt(formData.cetScore) : undefined
    };

    delete registrationData.confirmPassword;

    const result = await register(registrationData);
    
    if (result.success) {
      toast.success('Registration successful! Welcome to Engineering Compass!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">EC</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join Engineering Compass
          </h2>
          <p className="text-gray-600">
            Start your personalized engineering journey today
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${
            step >= 2 ? 'bg-primary-600' : 'bg-gray-200'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              // Step 1: Basic Information
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pl-10 pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pl-10 pr-10"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary w-full"
                >
                  Next Step
                </button>
              </div>
            ) : (
              // Step 2: Academic Information
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="college.name" className="block text-sm font-medium text-gray-700 mb-2">
                      College Name *
                    </label>
                    <input
                      id="college.name"
                      name="college.name"
                      type="text"
                      required
                      value={formData.college.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter college name"
                    />
                  </div>

                  <div>
                    <label htmlFor="college.tier" className="block text-sm font-medium text-gray-700 mb-2">
                      College Tier *
                    </label>
                    <select
                      id="college.tier"
                      name="college.tier"
                      required
                      value={formData.college.tier}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select tier</option>
                      {tiers.map(tier => (
                        <option key={tier} value={tier}>{tier}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="college.university" className="block text-sm font-medium text-gray-700 mb-2">
                      University *
                    </label>
                    <input
                      id="college.university"
                      name="college.university"
                      type="text"
                      required
                      value={formData.college.university}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter university name"
                    />
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                      Branch *
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="admissionYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Admission Year *
                    </label>
                    <input
                      id="admissionYear"
                      name="admissionYear"
                      type="number"
                      required
                      min="2020"
                      max="2024"
                      value={formData.admissionYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2023"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Year *
                    </label>
                    <input
                      id="currentYear"
                      name="currentYear"
                      type="number"
                      required
                      min="1"
                      max="4"
                      value={formData.currentYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentSemester" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Semester *
                    </label>
                    <input
                      id="currentSemester"
                      name="currentSemester"
                      type="number"
                      required
                      min="1"
                      max="8"
                      value={formData.currentSemester}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 3"
                    />
                  </div>

                  <div>
                    <label htmlFor="twelfthPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                      12th Percentage
                    </label>
                    <input
                      id="twelfthPercentage"
                      name="twelfthPercentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.twelfthPercentage}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 85.5"
                    />
                  </div>

                  <div>
                    <label htmlFor="jeeScore" className="block text-sm font-medium text-gray-700 mb-2">
                      JEE Score
                    </label>
                    <input
                      id="jeeScore"
                      name="jeeScore"
                      type="number"
                      min="0"
                      max="360"
                      value={formData.jeeScore}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 85"
                    />
                  </div>

                  <div>
                    <label htmlFor="cetScore" className="block text-sm font-medium text-gray-700 mb-2">
                      CET Score
                    </label>
                    <input
                      id="cetScore"
                      name="cetScore"
                      type="number"
                      min="0"
                      max="200"
                      value={formData.cetScore}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 150"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : null}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
