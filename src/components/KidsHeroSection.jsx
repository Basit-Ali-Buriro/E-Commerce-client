import React, { useState, useEffect } from 'react';

const KidsHeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 20,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const seconds = prev.seconds - 1;
        if (seconds < 0) {
          if (prev.minutes === 0 && prev.hours === 0) {
            clearInterval(timer);
            return { hours: 0, minutes: 0, seconds: 0 };
          }
          return {
            hours: prev.minutes === 0 ? prev.hours - 1 : prev.hours,
            minutes: prev.minutes === 0 ? 59 : prev.minutes - 1,
            seconds: 59,
          };
        }
        return { ...prev, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image with Overlay - Kids playing */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604917018610-55ec80b2d4e2?auto=format&fit=crop&w=1740&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        {/* Promo Banner - Playful colors */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 py-4 px-8 rounded-xl shadow-2xl mb-6 animate-bounce">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
            FLAT 50% OFF
          </h2>
          <p className="text-white text-sm mt-1 font-medium">
            On all kids' collections
          </p>
        </div>

        {/* Countdown */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl mb-10 animate-fadeIn">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Hurry up! Offer ends in:
          </h3>
          <div className="flex justify-center space-x-5 text-center">
            {[
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-blue-600">
                  {value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-medium text-gray-600">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action Button */}
        <button className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 py-3 px-8 rounded-full font-semibold text-lg shadow-md flex items-center">
          Shop Now
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 01 0 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 11 0-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Age Group Tags */}
        <div className="absolute bottom-6 flex flex-wrap justify-center gap-3">
          {['Newborn', 'Toddlers', 'Kids', 'Pre-Teens'].map((tag, i) => (
            <span
              key={i}
              className="bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-blue-900 hover:bg-white shadow-sm transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KidsHeroSection;