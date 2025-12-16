import React from 'react';

const Gallery: React.FC = () => {
  const images = [
    "https://i.postimg.cc/RFB3my21/9ec8b04121049fcddda23102577a25ff.jpg",
    "https://i.postimg.cc/d1Y7Fpg4/AAAAAAA.jpg",
    "https://i.postimg.cc/50VHJTD3/DOJOCATTO.jpg",
    "https://i.postimg.cc/3RTyhVz9/dombol.jpg",
    "https://i.postimg.cc/SshX43Hd/Free_Fire_CAT.jpg",
    "https://i.postimg.cc/bJ9ZwLjL/IGRIS.jpg",
  ];

  return (
    <section className="py-24 bg-slate-50" id="gallery">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Memories</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mt-2">The Cousins' Hall of Fame</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer h-64 md:h-80"
            >
              <img 
                src={src} 
                alt={`Memory ${index + 1}`} 
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium text-lg">Memory #{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
