import React, { useState } from 'react';
import Hero from './components/Hero';
import AIWisher from './components/AIWisher';
import Facts from './components/Facts';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <main className="w-full min-h-screen animate-fade-in">
      <Hero />
      
      <div className="relative z-20 -mt-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border-b-4 border-pink-500">
          <h3 className="text-3xl font-bold text-slate-900 mb-6 font-serif">Happy Birthday, Legends! 👑</h3>
          <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
            <p>
              Welcome to your official digital headquarters. Since ordinary cards are boring, I built this entire site just for the three of you.
            </p>
            <p>
              Explore the <strong>AI Poet</strong> (make it roast you if you dare), uncover cool history about your shared day, and see what the world has to say in the Guestbook.
            </p>
          </div>
          <p className="mt-8 font-serif italic text-pink-600 text-2xl font-bold">
            Here’s to another year of being absolutely awesome! 🚀
          </p>
        </div>
      </div>

      <Facts />
      <Gallery />
      <AIWisher />
      <Guestbook />

      <footer className="bg-slate-900 text-white pt-20 pb-10 relative overflow-hidden mt-0">
          {/* Decorative top border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 opacity-70"></div>
          
          {/* Background glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            
            <div className="mb-10">
              <h2 className="text-3xl font-serif font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 inline-block">
                The December 17th Crew
              </h2>
              <p className="text-slate-400 text-sm tracking-[0.2em] uppercase">Legends Only</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
               <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-pink-200">🎂 Maheen</span>
               <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-purple-200">🎈 Masaid</span>
               <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-200">🎁 Maaz</span>
            </div>

            <button 
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300 mb-12 group"
            >
              <span className="uppercase tracking-widest text-xs">Back to Top</span>
              <svg className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} Birthday Bash. All rights reserved.</p>
              <p className="flex items-center gap-1">
                Crafted with <span className="text-pink-500 animate-pulse">❤️</span> by Ahmer
              </p>
            </div>
          </div>
      </footer>
    </main>
  );
};

export default App;