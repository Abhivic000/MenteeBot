import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import ChatSession from '../models/ChatSession.js';
import ragChatbot from '../utils/ragChatbot.js';

const router = express.Router();

// Simple mental health responses for now
// In production, you would integrate with OpenAI/LangChain and your PDF knowledge base
const getMentalHealthResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis detection
  if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
    return "I'm very concerned about what you're sharing. Please reach out for immediate help: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741, or Emergency Services: 911. You matter, and there are people who want to help you through this difficult time.";
  }
  
  // Anxiety responses
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
    return "I understand you're feeling anxious. Anxiety is very common and treatable. Try some deep breathing: breathe in for 4 counts, hold for 4, breathe out for 6. Remember that anxiety often makes situations seem worse than they are. What specific situation is causing you anxiety right now?";
  }
  
  // Depression responses
  if (lowerMessage.includes('depressed') || lowerMessage.includes('depression') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
    return "I hear that you're going through a difficult time. Depression can make everything feel overwhelming, but it's important to remember that these feelings are temporary and treatable. Small steps can make a big difference - have you been able to do any activities you usually enjoy, even briefly?";
  }
  
  // Stress responses
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
    return "Stress can feel overwhelming, but there are ways to manage it. Try breaking down what's stressing you into smaller, manageable parts. What's the most pressing thing you're dealing with right now? Sometimes just talking through it can help clarify next steps.";
  }
  
  // Sleep issues
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) {
    return "Sleep issues can significantly impact mental health. Good sleep hygiene includes: keeping a consistent sleep schedule, avoiding screens before bed, creating a calm environment, and avoiding caffeine late in the day. Have you noticed any patterns in what might be affecting your sleep?";
  }
  
  // Positive responses
  if (lowerMessage.includes('better') || lowerMessage.includes('good') || lowerMessage.includes('happy') || lowerMessage.includes('progress')) {
    return "I'm so glad to hear you're feeling better! It's wonderful that you're making progress. Remember to celebrate these positive moments - they're important milestones in your healing journey. What has been helping you feel better?";
  }
  
  // Gratitude and coping
  if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful') || lowerMessage.includes('coping')) {
    return "Gratitude is a powerful tool for mental wellness. It's great that you're recognizing positive aspects in your life. Practicing gratitude regularly can help shift our perspective and improve mood. What are you most grateful for today?";
  }
  
  // Default supportive response
  return "Thank you for sharing with me. I'm here to listen and support you. Mental health is a journey, and it's okay to have ups and downs. What you're feeling is valid, and seeking support shows strength. Can you tell me more about what's on your mind today?";
};

// @desc    Send message to chatbot
// @route   POST /api/chat
// @access  Private
router.post('/', protect, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { message } = req.body;
    const userId = req.user._id;

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ 
      user: userId, 
      isActive: true 
    }).sort({ updatedAt: -1 });

    if (!chatSession) {
      chatSession = await ChatSession.create({
        user: userId,
        messages: []
      });
    }

    // Add user message
    chatSession.messages.push({
      role: 'user',
      content: message
    });

    // Generate AI response using RAG chatbot
    const context = chatSession.messages.slice(-10); // Last 10 messages for context
    const aiResponse = await ragChatbot.getResponse(message, context);

    // Add AI response
    chatSession.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chatSession.save();

    res.json({
      success: true,
      response: aiResponse,
      sessionId: chatSession._id
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const chatSessions = await ChatSession.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      sessions: chatSessions
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Start new chat session
// @route   POST /api/chat/new-session
// @access  Private
router.post('/new-session', protect, async (req, res, next) => {
  try {
    // Deactivate current session
    await ChatSession.updateMany(
      { user: req.user._id, isActive: true },
      { isActive: false }
    );

    // Create new session
    const newSession = await ChatSession.create({
      user: req.user._id,
      messages: [{
        role: 'assistant',
        content: "Hello! I'm your mental health companion. I'm here to provide support, guidance, and a listening ear. How are you feeling today?"
      }]
    });

    res.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    next(error);
  }
});

export default router;