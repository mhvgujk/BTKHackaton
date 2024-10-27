import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating response:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    async explainConcept(topic: string): Promise<string> {
        const prompt = `Explain ${topic} in simple terms, suitable for a student. Include:
        1. Simple definition
        2. Key points
        3. Real-world example
        4. Practice question`;
        return this.generateResponse(prompt);
    }

    async createStudyPlan(subject: string, level: string): Promise<string> {
        const prompt = `Create a structured study plan for ${subject} at ${level} level. Include:
        1. Key topics to cover
        2. Recommended study duration
        3. Learning objectives
        4. Practice suggestions`;
        return this.generateResponse(prompt);
    }
}