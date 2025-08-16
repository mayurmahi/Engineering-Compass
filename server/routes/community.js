const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// @route   GET api/community/students
// @desc    Get students from same college for mentorship
// @access  Private
router.get('/students', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find students from the same college
    const collegeStudents = await Student.find({
      'college.name': student.college.name,
      _id: { $ne: student._id } // Exclude current student
    }).select('name currentYear currentSemester branch skills projects');

    // Categorize students by year for mentorship
    const seniors = collegeStudents.filter(s => s.currentYear > student.currentYear);
    const peers = collegeStudents.filter(s => s.currentYear === student.currentYear);
    const juniors = collegeStudents.filter(s => s.currentYear < student.currentYear);

    res.json({
      seniors: seniors.slice(0, 10), // Top 10 seniors
      peers: peers.slice(0, 10), // Top 10 peers
      juniors: juniors.slice(0, 10), // Top 10 juniors
      totalStudents: collegeStudents.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/community/connect
// @desc    Send connection request to another student
// @access  Private
router.post('/connect', auth, async (req, res) => {
  try {
    const { studentId, type, message } = req.body;
    const currentStudent = await Student.findById(req.user.id);

    if (!currentStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const targetStudent = await Student.findById(studentId);
    if (!targetStudent) {
      return res.status(404).json({ message: 'Target student not found' });
    }

    // Check if connection already exists
    const existingConnection = currentStudent.connections.find(
      conn => conn.studentId.toString() === studentId
    );

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Add connection to current student
    currentStudent.connections.push({
      studentId,
      type,
      status: 'Pending'
    });

    // Add reverse connection to target student
    targetStudent.connections.push({
      studentId: currentStudent._id,
      type: type === 'Mentor' ? 'Mentee' : type === 'Mentee' ? 'Mentor' : 'Peer',
      status: 'Pending'
    });

    await currentStudent.save();
    await targetStudent.save();

    res.json({ message: 'Connection request sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/community/connections/:connectionId
// @desc    Accept or reject connection request
// @access  Private
router.put('/connections/:connectionId', auth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { status } = req.body;
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const connectionIndex = student.connections.findIndex(
      conn => conn._id.toString() === connectionId
    );

    if (connectionIndex === -1) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    student.connections[connectionIndex].status = status;
    await student.save();

    // Update the other student's connection status
    const otherStudentId = student.connections[connectionIndex].studentId;
    const otherStudent = await Student.findById(otherStudentId);
    
    if (otherStudent) {
      const otherConnectionIndex = otherStudent.connections.findIndex(
        conn => conn.studentId.toString() === student._id.toString()
      );
      
      if (otherConnectionIndex !== -1) {
        otherStudent.connections[otherConnectionIndex].status = status;
        await otherStudent.save();
      }
    }

    res.json({ message: `Connection ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/community/connections
// @desc    Get all connections (mentors, mentees, peers)
// @access  Private
router.get('/connections', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('connections.studentId', 'name currentYear branch skills');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const connections = {
      mentors: student.connections.filter(conn => 
        conn.type === 'Mentor' && conn.status === 'Accepted'
      ),
      mentees: student.connections.filter(conn => 
        conn.type === 'Mentee' && conn.status === 'Accepted'
      ),
      peers: student.connections.filter(conn => 
        conn.type === 'Peer' && conn.status === 'Accepted'
      ),
      pending: student.connections.filter(conn => 
        conn.status === 'Pending'
      )
    };

    res.json(connections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/community/forums
// @desc    Get college-specific forum topics
// @access  Private
router.get('/forums', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Mock forum data - in real app, this would be stored in database
    const forumTopics = [
      {
        id: 1,
        title: 'Best Study Resources for Data Structures',
        category: 'Academic',
        author: 'Senior Student',
        replies: 15,
        views: 120,
        lastActivity: '2024-01-15T10:30:00Z',
        tags: ['Data Structures', 'Study Tips', 'Computer Science']
      },
      {
        id: 2,
        title: 'Internship Opportunities for 3rd Year Students',
        category: 'Career',
        author: 'Placement Cell',
        replies: 8,
        views: 85,
        lastActivity: '2024-01-14T14:20:00Z',
        tags: ['Internships', 'Career', '3rd Year']
      },
      {
        id: 3,
        title: 'Project Ideas for Final Year',
        category: 'Projects',
        author: 'Faculty Member',
        replies: 12,
        views: 95,
        lastActivity: '2024-01-13T16:45:00Z',
        tags: ['Projects', 'Final Year', 'Ideas']
      },
      {
        id: 4,
        title: 'Tips for JEE Advanced Preparation',
        category: 'Competitive Exams',
        author: 'Alumni',
        replies: 6,
        views: 67,
        lastActivity: '2024-01-12T11:15:00Z',
        tags: ['JEE', 'Preparation', 'Tips']
      },
      {
        id: 5,
        title: 'College Fest 2024 - Call for Volunteers',
        category: 'Events',
        author: 'Student Council',
        replies: 3,
        views: 45,
        lastActivity: '2024-01-11T09:30:00Z',
        tags: ['Events', 'Volunteers', 'College Fest']
      }
    ];

    res.json({
      college: student.college.name,
      topics: forumTopics,
      categories: ['Academic', 'Career', 'Projects', 'Competitive Exams', 'Events', 'General']
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/community/events
// @desc    Get college events and activities
// @access  Private
router.get('/events', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Mock events data
    const events = [
      {
        id: 1,
        title: 'Tech Talk: AI in Modern Applications',
        type: 'Workshop',
        date: '2024-02-15T14:00:00Z',
        duration: '2 hours',
        location: 'Main Auditorium',
        organizer: 'Computer Science Department',
        description: 'Learn about practical applications of AI in modern software development',
        registrationRequired: true,
        maxParticipants: 100,
        currentParticipants: 45
      },
      {
        id: 2,
        title: 'Coding Competition',
        type: 'Competition',
        date: '2024-02-20T10:00:00Z',
        duration: '4 hours',
        location: 'Computer Lab 1',
        organizer: 'Programming Club',
        description: 'Annual coding competition with exciting prizes',
        registrationRequired: true,
        maxParticipants: 50,
        currentParticipants: 32
      },
      {
        id: 3,
        title: 'Career Fair 2024',
        type: 'Career',
        date: '2024-03-01T09:00:00Z',
        duration: '6 hours',
        location: 'Sports Complex',
        organizer: 'Placement Cell',
        description: 'Meet top companies and explore career opportunities',
        registrationRequired: false,
        maxParticipants: 500,
        currentParticipants: 0
      },
      {
        id: 4,
        title: 'Alumni Meet',
        type: 'Networking',
        date: '2024-02-25T18:00:00Z',
        duration: '3 hours',
        location: 'College Garden',
        organizer: 'Alumni Association',
        description: 'Network with successful alumni and learn from their experiences',
        registrationRequired: true,
        maxParticipants: 200,
        currentParticipants: 78
      }
    ];

    res.json({
      college: student.college.name,
      events,
      upcoming: events.filter(e => new Date(e.date) > new Date()),
      past: events.filter(e => new Date(e.date) <= new Date())
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
