import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MessageSquare, Send, Bot, User, Loader2, Brain,
  Target, BookOpen, Zap, Users, Plus, X
} from 'lucide-react';

// --- Helper Components for Rich AI Responses ---

// Renders a single recommendation card
const RecommendationCard = ({ rec }) => (
  <div className="border-t border-gray-200 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
    <h4 className="font-bold text-sm">
      {rec.title} <span className={`font-normal text-xs px-2 py-0.5 rounded-full ${rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{rec.priority} Priority</span>
    </h4>
    <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
    {rec.actionItems?.length > 0 && (
      <p className="text-xs text-gray-500 mt-2">
        <strong>Actions:</strong> {(rec.actionItems || []).join(', ')}
      </p>
    )}
  </div>
);

// Renders a single weekly task card
const TaskCard = ({ task }) => (
  <div className="border-t border-gray-200 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
    <h4 className="font-bold text-sm">{task.title}</h4>
    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
    <p className="text-xs text-gray-500 mt-2">
      <strong>Category:</strong> {task.category} | <strong>Time:</strong> {task.estimatedTime}
    </p>
    {task.resources?.length > 0 && (
      <p className="text-xs text-gray-500 mt-1">
        <strong>Resources:</strong> {(task.resources || []).join(', ')}
      </p>
    )}
  </div>
);

// Renders a single project idea card
const ProjectCard = ({ project }) => (
  <div className="border-t border-gray-200 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
    <h4 className="font-bold text-sm">{project.title}</h4>
    <p className="text-xs text-gray-600 mt-1">{project.description}</p>
    {project.technologies?.length > 0 && (
      <p className="text-xs text-gray-500 mt-2">
        <strong>Technologies:</strong> {(project.technologies || []).join(', ')}
      </p>
    )}
    <p className="text-xs text-gray-500 mt-1">
      <strong>Duration:</strong> {project.estimatedDuration} | <strong>Difficulty:</strong> {project.difficulty}
    </p>
  </div>
);


const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize with welcome message only once
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          id: 'initial-welcome',
          type: 'ai',
          content: `Hello ${user.name}! 👋 I'm your AI mentor. What would you like to discuss today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user, messages.length]);
  
  // --- Core Chat Logic ---

  const sendMessage = async (messageToSend = inputMessage) => {
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // The backend should manage the conversation history/context
      const response = await axios.post('/api/ai/chat', { message: messageToSend });

      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
      const errorMessage = {
        id: `err-${Date.now()}`,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Quick Action Handlers ---

  const handleQuickAction = async (apiCall, successToast, errorToast, messageType) => {
    setIsLoading(true);
    try {
      const response = await axios.post(apiCall, {}); // Changed to GET for read-only actions
      const aiMessage = {
        id: `${messageType}-${Date.now()}`,
        type: messageType, // Use a special type for rich data
        data: response.data, // Store the structured data directly
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      toast.success(successToast);
    } catch (error) {
      console.error(`${messageType} error:`, error);
      toast.error(errorToast);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAIRecommendations = () => handleQuickAction(
    '/api/ai/recommendations',
    'Recommendations generated!',
    'Failed to get recommendations.',
    'recommendations'
  );

  const generateWeeklyTasks = () => handleQuickAction(
    '/api/ai/weekly-focus',
    'Weekly tasks generated!',
    'Failed to generate weekly tasks.',
    'weekly-tasks'
  );

  const getProjectIdeas = () => handleQuickAction(
    '/api/ai/project-ideas',
    'Project ideas generated!',
    'Failed to generate project ideas.',
    'project-ideas'
  );

  const getResumeSuggestions = () => handleQuickAction(
    '/api/ai/resume-enhancement',
    'Resume suggestions generated!',
    'Failed to generate resume suggestions.',
    'resume-suggestions'
  );

  const handleInterviewPrep = () => {
    const message = "Can you help me prepare for technical interviews?";
    // This now sends the message automatically for better UX
    sendMessage(message);
  };
  
  // --- Event Handlers ---
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-600">Your personalized AI mentor</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={getAIRecommendations} disabled={isLoading} className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border hover:border-primary-300 hover:shadow-sm transition disabled:opacity-50"><Brain className="w-4 h-4 text-blue-600" /> <span className="text-sm font-medium">Recommendations</span></button>
          <button onClick={generateWeeklyTasks} disabled={isLoading} className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border hover:border-primary-300 hover:shadow-sm transition disabled:opacity-50"><Target className="w-4 h-4 text-green-600" /> <span className="text-sm font-medium">Weekly Tasks</span></button>
          <button onClick={getProjectIdeas} disabled={isLoading} className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border hover:border-primary-300 hover:shadow-sm transition disabled:opacity-50"><BookOpen className="w-4 h-4 text-purple-600" /> <span className="text-sm font-medium">Project Ideas</span></button>
          <button onClick={getResumeSuggestions} disabled={isLoading} className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border hover:border-primary-300 hover:shadow-sm transition disabled:opacity-50"><Zap className="w-4 h-4 text-indigo-600" /> <span className="text-sm font-medium">Resume Tips</span></button>
          <button onClick={handleInterviewPrep} disabled={isLoading} className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border hover:border-primary-300 hover:shadow-sm transition disabled:opacity-50"><Users className="w-4 h-4 text-orange-600" /> <span className="text-sm font-medium">Interview Prep</span></button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isUser = message.type === 'user';
          let content;

          // --- This is the key change: Render based on message type ---
          switch (message.type) {
            case 'recommendations':
              content = (
                <div>
                  <h3 className="font-bold mb-2 text-sm">Personalized Recommendations:</h3>
                  {message.data.recommendations.map(rec => <RecommendationCard key={rec.title} rec={rec} />)}
                </div>
              );
              break;
            case 'weekly-tasks':
              content = (
                <div>
                  <h3 className="font-bold mb-2 text-sm">Your AI-Generated Weekly Tasks:</h3>
                  {message.data.tasks.map(task => <TaskCard key={task.title} task={task} />)}
                </div>
              );
              break;
            case 'project-ideas':
              content = (
                <div>
                  <h3 className="font-bold mb-2 text-sm">Project Ideas For You:</h3>
                  {message.data.projects.map(p => <ProjectCard key={p.title} project={p} />)}
                </div>
              );
              break;
            case 'resume-suggestions':
              // This can be expanded into its own component too
              content = (
                <div className="text-sm">
                  <h3 className="font-bold mb-2">Resume Enhancement Suggestions:</h3>
                  {message.data.summary && <p><strong>Summary:</strong> {message.data.summary}</p>}
                </div>
              );
              break;
            default: // 'ai' or 'user'
              content = <div className="whitespace-pre-wrap text-sm">{message.content}</div>;
          }

          return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUser ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-lg p-4 ${isUser ? 'bg-primary-600 text-white' : 'bg-white border text-gray-900'}`}>
                  {content}
                  <div className={`text-xs mt-2 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-200 flex items-center justify-center"><Bot className="w-4 h-4" /></div>
              <div className="rounded-lg p-4 bg-white border"><Loader2 className="w-5 h-5 animate-spin text-gray-500" /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500"
            rows="1"
            disabled={isLoading}
          />
          <button onClick={() => sendMessage()} disabled={!inputMessage.trim() || isLoading} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;