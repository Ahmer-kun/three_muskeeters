import React, { useState } from 'react';
import { generateBirthdayPoem } from '../services/gemini';

const AIWisher: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const poem = await generateBirthdayPoem(prompt);
    setResult(poem);
    setLoading(false);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-4">AI Poet</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            You have full creative control! Describe the poem you want (e.g., "A funny limerick about Maaz losing his cake") and watch the magic happen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Controls */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition h-48 resize-none text-slate-700 placeholder:text-slate-400"
                  placeholder="e.g., Write a rap battle style poem between Maheen and Masaid about who is the favorite cousin..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  loading || !prompt.trim()
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Composing...
                  </span>
                ) : (
                  "Generate Poem 📜"
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="bg-indigo-900 p-8 rounded-2xl shadow-2xl text-white h-full flex flex-col justify-center relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <h3 className="text-xl font-serif text-pink-300 mb-6 relative z-10">The Masterpiece</h3>
            
            {result ? (
              <div className="prose prose-invert prose-lg relative z-10 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
                <p className="whitespace-pre-line leading-relaxed italic font-serif text-xl md:text-2xl">
                  "{result}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-indigo-300 opacity-60 relative z-10">
                <span className="text-6xl mb-4">✨</span>
                <p className="text-center">Enter a prompt on the left to start the AI poet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIWisher;