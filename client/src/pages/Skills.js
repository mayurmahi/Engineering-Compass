import React from 'react';
import { BookOpen, Target, Code, Database, Smartphone, Brain } from 'lucide-react';

const Skills = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills Hub</h1>
        <p className="text-gray-600">Master the skills that will shape your engineering career</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Code className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Web Development</h3>
          </div>
          <p className="text-gray-600 mb-4">Master full-stack development with modern technologies</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>12 weeks</span>
            <span className="mx-2">•</span>
            <span>Intermediate</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold">Data Science</h3>
          </div>
          <p className="text-gray-600 mb-4">Learn data analysis and machine learning fundamentals</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>16 weeks</span>
            <span className="mx-2">•</span>
            <span>Advanced</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Smartphone className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Mobile Development</h3>
          </div>
          <p className="text-gray-600 mb-4">Build cross-platform mobile applications</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>10 weeks</span>
            <span className="mx-2">•</span>
            <span>Intermediate</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Database className="w-8 h-8 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold">Database Management</h3>
          </div>
          <p className="text-gray-600 mb-4">Master database design and management</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>8 weeks</span>
            <span className="mx-2">•</span>
            <span>Beginner</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold">Cybersecurity</h3>
          </div>
          <p className="text-gray-600 mb-4">Learn security fundamentals and ethical hacking</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>14 weeks</span>
            <span className="mx-2">•</span>
            <span>Advanced</span>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold">Cloud Computing</h3>
          </div>
          <p className="text-gray-600 mb-4">Master AWS, Azure, and cloud deployment</p>
          <div className="flex items-center text-sm text-primary-600">
            <span>12 weeks</span>
            <span className="mx-2">•</span>
            <span>Intermediate</span>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Coming Soon: AI-powered skill assessment and personalized learning paths</p>
        <button className="btn-primary">Get Started</button>
      </div>
    </div>
  );
};

export default Skills;
