import React from 'react';

const Snippets = () => {
  // Images for the infinite scroll
  const images = [
    "../snip-1.png",
    "../snip-2.png",
    "../snip-3.png",
    "../snip-4.png",
    "../snip-5.png",
    "../snip-6.png"
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <>
      <style jsx>{`
        /* --- Scroll Animations Only --- */
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .infinite-scroll {
          animation: scroll-right 30s linear infinite;
        }
        .scroll-container {
          mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>

      <div id="snippets" className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center py-20">
        
        {/* --- 1. Background Image Effect (No Glow) --- */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/snippets-bg.jpg"
            alt="Background" 
            className="w-full h-full object-cover opacity-60" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Gradient Overlay matching Hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* --- 2. Main Content (Snippets) --- */}
        {/* Section Header */}
        <div className="relative z-10 text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-lg">
            SNIPPETS
          </h2>
          <p className="text-gray-300 text-lg font-light tracking-wide drop-shadow-md">
            Captured moments from our community
          </p>
        </div>
        
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="scroll-container w-full">
            <div className="infinite-scroll flex gap-6 w-max px-6">
              {duplicatedImages.map((image, index) => (
                <div
                  key={index}
                  // UPDATED: Large Landscape dimensions
                  // Mobile: w-72 h-40 
                  // Tablet: md:w-96 md:h-52
                  // Desktop: lg:w-[48rem] lg:h-[27rem] (Significant increase in size)
                  className="image-item flex-shrink-0 w-72 h-40 md:w-96 md:h-52 lg:w-[48rem] lg:h-[27rem] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Snippets;