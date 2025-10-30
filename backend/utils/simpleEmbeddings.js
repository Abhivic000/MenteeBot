// Simple text embeddings using TF-IDF for free local processing
import fs from 'fs/promises';

class SimpleEmbeddings {
  constructor() {
    this.vocabulary = new Map();
    this.idf = new Map();
    this.documents = [];
  }

  // Simple tokenization
  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  // Calculate TF-IDF vectors
  async fitTransform(documents) {
    this.documents = documents;
    const allTokens = new Set();
    const docTokens = [];

    // Tokenize all documents
    for (const doc of documents) {
      const tokens = this.tokenize(doc.pageContent);
      docTokens.push(tokens);
      tokens.forEach(token => allTokens.add(token));
    }

    // Build vocabulary
    Array.from(allTokens).forEach((token, index) => {
      this.vocabulary.set(token, index);
    });

    // Calculate IDF
    for (const token of allTokens) {
      const docCount = docTokens.filter(tokens => tokens.includes(token)).length;
      this.idf.set(token, Math.log(documents.length / docCount));
    }

    // Calculate TF-IDF vectors
    const vectors = [];
    for (const tokens of docTokens) {
      const vector = new Array(this.vocabulary.size).fill(0);
      const tokenCounts = new Map();
      
      // Count token frequencies
      tokens.forEach(token => {
        tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
      });

      // Calculate TF-IDF
      for (const [token, count] of tokenCounts) {
        const index = this.vocabulary.get(token);
        const tf = count / tokens.length;
        const idf = this.idf.get(token);
        vector[index] = tf * idf;
      }
      
      vectors.push(vector);
    }

    return vectors;
  }

  // Transform query to vector
  transformQuery(query) {
    const tokens = this.tokenize(query);
    const vector = new Array(this.vocabulary.size).fill(0);
    const tokenCounts = new Map();
    
    tokens.forEach(token => {
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
    });

    for (const [token, count] of tokenCounts) {
      if (this.vocabulary.has(token)) {
        const index = this.vocabulary.get(token);
        const tf = count / tokens.length;
        const idf = this.idf.get(token) || 0;
        vector[index] = tf * idf;
      }
    }

    return vector;
  }

  // Calculate cosine similarity
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // Find most similar documents
  findSimilar(query, vectors, k = 3) {
    const queryVector = this.transformQuery(query);
    const similarities = vectors.map((vector, index) => ({
      index,
      similarity: this.cosineSimilarity(queryVector, vector),
      document: this.documents[index]
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k)
      .filter(item => item.similarity > 0.1); // Minimum similarity threshold
  }
}

export default SimpleEmbeddings;