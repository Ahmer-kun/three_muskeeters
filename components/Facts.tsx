import React, { useEffect, useState } from 'react';
import { getDayFacts } from '../services/gemini';

const Facts: React.FC = () => {
  const [facts, setFacts] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    getDayFacts().then((text) => {
      if (mounted) setFacts(text);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
               The Trio of Dec 17th
             </h2>
             <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
               <p>
                 You three share a birthday with Pope Francis, Milla Jovovich, and Sarah Paulson!
               </p>
               <p>
                 <strong className="text-white">Winter Royalty:</strong> ❄️ <br/>
                 Born in the most magical month of the year. That means festive vibes, cozy celebrations, and triple the cake.
               </p>
               <p>
                 <strong className="text-white">Fun Fact:</strong> ✈️ <br/>
                 December 17 is also Wright Brothers Day, marking the first successful flight in 1903. You guys are in legendary company!
               </p>
             </div>
          </div>

          <div className="md:w-1/2 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-indigo-300 mb-4">Historical Fun Facts</h3>
            {facts ? (
              <div className="prose prose-invert">
                 <div className="whitespace-pre-line">{facts}</div>
              </div>
            ) : (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facts;