import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  User,
  BookOpen,
  Briefcase,
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Your personalized journey overview'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your profile and settings'
    },
    {
      name: 'Skills Hub',
      href: '/skills',
      icon: BookOpen,
      description: 'Learning paths and skill development'
    },
    {
      name: 'Career Prep',
      href: '/career',
      icon: Briefcase,
      description: 'Resume building and interview prep'
    },
    {
      name: 'Community',
      href: '/community',
      icon: Users,
      description: 'Connect with peers and mentors'
    },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      icon: MessageSquare,
      description: 'Get AI-powered guidance'
    }
  ];

  const quickActions = [
    {
      name: 'Weekly Goals',
      href: '/dashboard#goals',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      name: 'Progress Track',
      href: '/dashboard#progress',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Achievements',
      href: '/profile#achievements',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      name: 'Timeline',
      href: '/dashboard#timeline',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Modules
          </h3>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={item.description}
                >
                  <item.icon 
                    className={`mr-3 w-5 h-5 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Completion */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Profile Completion
          </h4>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">75% Complete</p>
          <Link 
            to="/profile" 
            className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block"
          >
            Complete Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
