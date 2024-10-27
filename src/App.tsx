import React, { useState } from 'react';
import { FiSearch, FiSave, FiShare2 } from 'react-icons/fi';
import { GeminiService } from './services/gemini.service';

const geminiService = new GeminiService('AIzaSyBWFXFz7DejrfOTJaCixjTwOhtUbyI4OIg');

function App() {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const explainTopic = async () => {
    if (!topic) {
      setResponse('Please enter a topic first.');
      return;
    }
    
    setIsLoading(true);
    try {
      const explanation = await geminiService.explainConcept(topic);
      setResponse(explanation);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to get explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createStudyPlan = async () => {
    if (!topic) {
      setResponse('Please enter a subject first.');
      return;
    }
    
    setIsLoading(true);
    try {
      const plan = await geminiService.createStudyPlan(topic, 'intermediate');
      setResponse(plan);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to create study plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveResponse = () => {
    if (response && topic) {
      localStorage.setItem(`learnmate-${Date.now()}`, JSON.stringify({
        topic,
        content: response
      }));
      alert('Saved successfully!');
    }
  };

  const shareResponse = () => {
    if (response) {
      if (navigator.share) {
        navigator.share({
          title: `LearnMate - ${topic}`,
          text: response,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(response)
          .then(() => alert('Copied to clipboard!'))
          .catch(console.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <h1 className="text-[22px] font-bold text-[#1D1D1F] text-center flex-1">LearnMate</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-[28px] font-medium text-[#6E6E73]">Hello,</h2>
          <h3 className="text-[34px] font-bold text-[#1D1D1F]">What would you like to learn?</h3>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center">
          <FiSearch className="text-[20px] text-[#86868B] mr-3" />
          <input
            type="text"
            placeholder="Enter any topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="text-[17px] text-[#1D1D1F] placeholder-[#86868B] flex-1 outline-none bg-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={explainTopic}
            className="w-full bg-[#0071E3] text-white font-bold rounded-[14px] p-5 text-[17px] shadow-md hover:bg-[#0077ED] transition-colors"
          >
            Explain Topic
          </button>
          <button
            onClick={createStudyPlan}
            className="w-full bg-white text-[#0071E3] font-bold rounded-[14px] p-5 text-[17px] shadow-sm hover:bg-[#F5F5F7] transition-colors"
          >
            Generate Study Plan
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Response Card */}
        {response && (
          <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
            <h4 className="text-[22px] font-bold text-[#1D1D1F]">Your Learning Resource</h4>
            <p className="text-[17px] text-[#1D1D1F] leading-[1.4] whitespace-pre-line">
              {response}
            </p>
            
            {/* Action Footer */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={saveResponse}
                className="bg-[#F5F5F7] text-[#0071E3] font-bold rounded-xl p-3 text-[15px] hover:bg-[#E5E5E7] transition-colors flex items-center justify-center"
              >
                <FiSave className="mr-2" /> Save
              </button>
              <button
                onClick={shareResponse}
                className="bg-[#F5F5F7] text-[#0071E3] font-bold rounded-xl p-3 text-[15px] hover:bg-[#E5E5E7] transition-colors flex items-center justify-center"
              >
                <FiShare2 className="mr-2" /> Share
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;