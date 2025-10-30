import Groq from 'groq-sdk';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import SimpleEmbeddings from './simpleEmbeddings.js';
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

class RAGChatbot {
  constructor() {
    this.documents = [];
    this.embeddings = null;
    this.vectors = [];
    this.groq = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      if (!process.env.GROQ_API_KEY) {
        console.warn('Groq API key not found. RAG chatbot will use fallback responses.');
        return;
      }

      // Initialize Groq client
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });

      // Load and process PDF documents
      this.documents = await this.loadDocuments();
      
      if (this.documents.length === 0) {
        console.warn('No documents found for RAG. Using fallback responses.');
        return;
      }

      // Split documents into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
      });

      const splitDocs = await textSplitter.splitDocuments(this.documents);
      
      // Initialize simple embeddings
      this.embeddings = new SimpleEmbeddings();
      this.vectors = await this.embeddings.fitTransform(splitDocs);
      this.documents = splitDocs;

      this.isInitialized = true;
      console.log('RAG Chatbot initialized successfully');
    } catch (error) {
      console.error('Error initializing RAG chatbot:', error);
      this.isInitialized = false;
    }
  }

  async loadDocuments() {
    const documents = [];
    const uploadsDir = path.join(process.cwd(), 'uploads');

    try {
      // Check if uploads directory exists
      await fs.access(uploadsDir);
      
      // Read all PDF files in uploads directory
      const files = await fs.readdir(uploadsDir);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

      for (const file of pdfFiles) {
        try {
          const filePath = path.join(uploadsDir, file);
          const pdfBuffer = await fs.readFile(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          
          documents.push({
            pageContent: pdfData.text,
            metadata: {
              source: file,
              type: 'pdf'
            }
          });
          
          console.log(`Loaded PDF: ${file}`);
        } catch (error) {
          console.error(`Error loading PDF ${file}:`, error);
        }
      }
    } catch (error) {
      console.log('Uploads directory not found or empty');
    }

    return documents;
  }

  async getResponse(message, context = []) {
    try {
      if (!this.isInitialized || !this.embeddings) {
        return this.getFallbackResponse(message);
      }

      // Retrieve relevant documents using simple embeddings
      const relevantDocs = this.embeddings.findSimilar(message, this.vectors, 3);
      
      // Create context from retrieved documents
      const docContext = relevantDocs
        .map(item => item.document.pageContent)
        .join('\n\n');

      // Create conversation context
      const conversationContext = context
        .slice(-3)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create comprehensive prompt
      const systemPrompt = `You are a compassionate mental health support assistant. Use the following knowledge base and conversation context to provide helpful, empathetic responses. Always prioritize user safety and encourage professional help when needed.

Knowledge Base:
${docContext}

Conversation Context:
${conversationContext}

User Message: ${message}

Provide a supportive, informative response based on the knowledge base. If the user expresses crisis thoughts, immediately provide crisis resources.`;

      // Get response from Groq
      const completion = await this.groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: systemPrompt
        }],
        model: 'llama3-8b-8192', // Free Groq model
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || this.getFallbackResponse(message);
      return this.formatResponse(response);
    } catch (error) {
      console.error('Error getting RAG response:', error);
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
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
    
    // Default supportive response
    return "Thank you for sharing with me. I'm here to listen and support you. Mental health is a journey, and it's okay to have ups and downs. What you're feeling is valid, and seeking support shows strength. Can you tell me more about what's on your mind today?";
  }

  formatResponse(response) {
    // Ensure the response is supportive and appropriate for mental health context
    const supportiveEnding = "\n\nRemember, I'm here to support you, but I'm not a replacement for professional mental health care. If you're in crisis or need immediate help, please contact a mental health professional or emergency services.";
    
    return response + supportiveEnding;
  }
}

// Create singleton instance
const ragChatbot = new RAGChatbot();

export default ragChatbot;