import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  sessionTitle: {
    type: String,
    default: 'Mental Health Chat'
  }
}, {
  timestamps: true
});

// Limit messages per session to prevent memory issues
chatSessionSchema.pre('save', function(next) {
  if (this.messages.length > 50) {
    this.messages = this.messages.slice(-50);
  }
  next();
});

export default mongoose.model('ChatSession', chatSessionSchema);