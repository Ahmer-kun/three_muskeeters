import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let birthday = new Date(currentYear, 11, 17); // Month is 0-indexed (11 = Dec)

      // Check if it's the birthday right now
      if (now.getMonth() === 11 && now.getDate() === 17) {
        setIsBirthdayToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      } else {
        setIsBirthdayToday(false);
      }

      // If birthday has passed this year, target next year
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 11, 17);
      }

      const difference = birthday.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Abstract Background Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-56 h-56 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-4 text-pink-200">
          December 17th
        </h2>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
          {isBirthdayToday ? "Happy Birthday!" : "Maheen, Masaid & Maaz"}
        </h1>

        <p className="text-lg md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Celebrating the coolest cousins in the galaxy. The ultimate December squad.
        </p>

        {!isBirthdayToday && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        )}

        {isBirthdayToday && (
          <div className="animate-bounce-slow mt-8">
             <div className="text-2xl md:text-4xl font-light text-indigo-100 mb-4">Maheen, Masaid & Maaz</div>
             <span className="text-6xl">🎂 🎉 🎁</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 text-center animate-bounce">
        <span className="text-white/50 text-sm uppercase tracking-widest">Scroll to Party</span>
      </div>
    </section>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-4xl md:text-6xl font-bold tabular-nums font-sans">{String(value).padStart(2, '0')}</span>
    <span className="text-xs md:text-sm uppercase tracking-wider text-indigo-200 mt-2">{label}</span>
  </div>
);

export default Hero;