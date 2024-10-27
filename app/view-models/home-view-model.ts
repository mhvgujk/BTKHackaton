import { Observable, ShareFile, SocialShare, Utils } from '@nativescript/core';
import { GeminiService } from '../services/gemini.service';

export class HomeViewModel extends Observable {
    private geminiService: GeminiService;
    private _isLoading: boolean = false;
    private _response: string = '';
    private _topic: string = '';
    private _savedResponses: Array<{ topic: string, content: string }> = [];

    constructor() {
        super();
        this.geminiService = new GeminiService('AIzaSyBWFXFz7DejrfOTJaCixjTwOhtUbyI4OIg');
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    get response(): string {
        return this._response;
    }

    set response(value: string) {
        if (this._response !== value) {
            this._response = value;
            this.notifyPropertyChange('response', value);
        }
    }

    get topic(): string {
        return this._topic;
    }

    set topic(value: string) {
        if (this._topic !== value) {
            this._topic = value;
            this.notifyPropertyChange('topic', value);
        }
    }

    async explainTopic() {
        if (!this.topic) {
            this.response = 'Please enter a topic first.';
            return;
        }
        
        this.isLoading = true;
        try {
            const explanation = await this.geminiService.explainConcept(this.topic);
            this.response = explanation;
        } catch (error) {
            console.error('Error:', error);
            this.response = 'Failed to get explanation. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }

    async createStudyPlan() {
        if (!this.topic) {
            this.response = 'Please enter a subject first.';
            return;
        }
        
        this.isLoading = true;
        try {
            const plan = await this.geminiService.createStudyPlan(this.topic, 'intermediate');
            this.response = plan;
        } catch (error) {
            console.error('Error:', error);
            this.response = 'Failed to create study plan. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }

    saveResponse() {
        if (this.response && this.topic) {
            this._savedResponses.push({
                topic: this.topic,
                content: this.response
            });
            Utils.toast({
                text: 'Saved successfully!',
                duration: 2000,
            });
        }
    }

    shareResponse() {
        if (this.response) {
            SocialShare.shareText(
                `LearnMate - ${this.topic}\n\n${this.response}`,
                'Share your learning resource'
            );
        }
    }
}