import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
  // If already unlocked by Dev button, don't recalculate
  if (!isLocked) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  let targetDate = new Date(currentYear, 11, 17); // Dec 17 (Month is 0-indexed)

  // If it IS Dec 17, we want to unlock.
  if (now.getMonth() === 11 && now.getDate() === 17) {
    setIsLocked(false);
    return;
  }

  // If we are past the date, target next year
  if (now > targetDate) {
    targetDate = new Date(currentYear + 1, 11, 17);
  }

  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    setIsLocked(false);
  } else {
    // Only update timeLeft, don't change isLocked state
    setTimeLeft({
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    });
  }
};

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial call

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white px-4 text-center overflow-hidden">
      
      {/* 
        DEV UNLOCK BUTTON
        Uncomment the button below if you need to bypass the lock for testing.
        To remove it completely, just delete this block.
      
      <button 
        onClick={() => setIsLocked(false)} 
        className="absolute top-4 right-4 text-xs text-white/10 hover:text-white/50 transition-colors uppercase tracking-widest z-50"
      >
        Dev Unlock
      </button>
      */}
      <button 
        onClick={() => setIsLocked(false)} 
        className="absolute top-4 right-4 text-xs text-white/10 hover:text-white/50 transition-colors uppercase tracking-widest z-50"
      >
        Dev Unlock
      </button>

      {/* Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="animate-float">
          <span className="text-6xl md:text-8xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {isLocked ? '🔒' : '🎂'}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-indigo-300 font-medium tracking-[0.3em] uppercase text-sm md:text-base animate-bounce-slow">
            {isLocked ? "Countdown to Chaos" : "It's Time!"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 leading-tight">
            Dec 17th
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
          <p className="text-lg md:text-xl text-slate-400 font-light">
            Maheen &nbsp;|&nbsp; Masaid &nbsp;|&nbsp; Maaz
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
        </div>

        {isLocked ? (
          <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="grid grid-cols-4 gap-4 md:gap-8 text-center">
              <TimeBox value={timeLeft.days} label="Days" />
              <TimeBox value={timeLeft.hours} label="Hrs" />
              <TimeBox value={timeLeft.minutes} label="Mins" />
              <TimeBox value={timeLeft.seconds} label="Secs" />
            </div>
            <p className="mt-6 text-slate-400 text-sm">The digital gates open on December 17th</p>
          </div>
        ) : (
          <button
            onClick={onEnter}
            className="mt-8 group relative inline-flex items-center justify-center px-10 py-4 font-serif text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full overflow-hidden hover:scale-105 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95 focus:outline-none"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-3">
              Enter Party Mode
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {isLocked && (
        <div className="absolute bottom-8 text-slate-600 text-xs tracking-widest uppercase">
          Restricted Access: Come back later
        </div>
      )}
    </div>
  );
};

const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl md:text-5xl font-bold font-sans tabular-nums text-white">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-[10px] md:text-xs uppercase tracking-wider text-indigo-300 mt-1">
      {label}
    </div>
  </div>
);

export default WelcomeScreen;
