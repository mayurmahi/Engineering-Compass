import React from 'react';
import { Users, MessageSquare, Calendar, UserPlus, Award, BookOpen } from 'lucide-react';

const Community = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community & Networking</h1>
        <p className="text-gray-600">Connect with peers, mentors, and build your professional network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <UserPlus className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Mentorship Program</h3>
          </div>
          <p className="text-gray-600 mb-4">Connect with verified seniors and industry professionals</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Verified Mentors</span>
            <span className="mx-2">•</span>
            <span>1-on-1</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">College Forums</h3>
          </div>
          <p className="text-gray-600 mb-4">Private discussion spaces for your college</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Academic</span>
            <span className="mx-2">•</span>
            <span>Career</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold">Events & Workshops</h3>
          </div>
          <p className="text-gray-600 mb-4">Attend college events and skill-building workshops</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Live Events</span>
            <span className="mx-2">•</span>
            <span>Virtual</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold">Study Groups</h3>
          </div>
          <p className="text-gray-600 mb-4">Form study groups with like-minded students</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Subject-based</span>
            <span className="mx-2">•</span>
            <span>Collaborative</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold">Resource Sharing</h3>
          </div>
          <p className="text-gray-600 mb-4">Share and discover study materials and resources</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Notes</span>
            <span className="mx-2">•</span>
            <span>Projects</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold">Alumni Network</h3>
          </div>
          <p className="text-gray-600 mb-4">Connect with successful alumni and industry experts</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>Verified</span>
            <span className="mx-2">•</span>
            <span>Network</span>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Coming Soon: Real-time chat, video calls, and collaborative features</p>
        <button className="btn-primary">Join Community</button>
      </div>
    </div>
  );
};

export default Community;
