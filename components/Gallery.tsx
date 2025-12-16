import React from 'react';

const Gallery: React.FC = () => {
  // Using picsum with seeds to get consistent random images
  const images = [
    "https://i.postimg.cc/RFB3my21/9ec8b04121049fcddda23102577a25ff.jpg",
    "https://github.com/Ahmer-kun/three_muskeeters/blob/main/pictures/AAAAAAA.jpg",
    "https://github.com/Ahmer-kun/three_muskeeters/blob/main/pictures/DOJOCATTO.jpg",
    "https://github.com/Ahmer-kun/three_muskeeters/blob/main/pictures/BooPBIDPOP.mp4",
    "https://github.com/Ahmer-kun/three_muskeeters/blob/main/pictures/FreeFire%20CAT.jpg",
    "https://github.com/Ahmer-kun/three_muskeeters/blob/main/pictures/IGRIS.jpg",
  ];

  return (
    <section className="py-24 bg-slate-50" id="gallery">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Memories</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mt-2">The Cousins' Hall of Fame</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((src, index) => (
            <div key={index} className="break-inside-avoid group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <img 
                src={src} 
                alt={`Memory ${index + 1}`} 
                className="w-full h-auto transform transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">Epic Moment #{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
