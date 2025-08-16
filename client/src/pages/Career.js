import React from 'react';
import { Briefcase, FileText, Users, Target, Award, Building } from 'lucide-react';

const Career = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Preparation</h1>
        <p className="text-gray-600">Prepare for your dream job with AI-powered guidance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">AI Resume Builder</h3>
          </div>
          <p className="text-gray-600 mb-4">Create industry-standard resumes with AI enhancement</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Professional</span>
            <span className="mx-2">•</span>
            <span>AI-Powered</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Company Prep Kits</h3>
          </div>
          <p className="text-gray-600 mb-4">Targeted preparation for top companies</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>TCS, Wipro, Amazon</span>
            <span className="mx-2">•</span>
            <span>Updated</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold">Mock Interviews</h3>
          </div>
          <p className="text-gray-600 mb-4">Practice technical and HR interviews</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Technical & HR</span>
            <span className="mx-2">•</span>
            <span>AI Feedback</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold">Interview Prep</h3>
          </div>
          <p className="text-gray-600 mb-4">Master common interview questions and techniques</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>500+ Questions</span>
            <span className="mx-2">•</span>
            <span>Practice</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold">Certifications</h3>
          </div>
          <p className="text-gray-600 mb-4">Track and showcase your certifications</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Industry Standard</span>
            <span className="mx-2">•</span>
            <span>Verified</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Briefcase className="w-8 h-8 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold">Job Opportunities</h3>
          </div>
          <p className="text-gray-600 mb-4">Discover relevant job openings and internships</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Curated</span>
            <span className="mx-2">•</span>
            <span>Personalized</span>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Coming Soon: AI-powered interview simulation and real-time feedback</p>
        <button className="btn-primary">Start Preparing</button>
      </div>
    </div>
  );
};

export default Career;
