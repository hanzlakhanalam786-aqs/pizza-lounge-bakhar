import React from 'react';

const HIGHLIGHTS = [
  {
    icon: '🍕',
    title: 'Fresh Pizza',
    description: 'Hand-stretched dough, rich signature sauces, melted cheese, and appetizing toppings baked fresh.'
  },
  {
    icon: '🍔',
    title: 'Delicious Fast Food',
    description: 'Crispy zinger burgers, loaded special burgers, and savory delights cooked to perfection.'
  },
  {
    icon: '🎂',
    title: 'Custom Cakes',
    description: 'Freshly baked customized cakes for birthdays, anniversaries, and all your festive celebrations.'
  },
  {
    icon: '🥤',
    title: 'Fresh Shakes',
    description: 'Rich, thick, and frosty milkshakes crafted with premium milk and rich flavors.'
  },
  {
    icon: '🚗',
    title: 'Delivery Available',
    description: 'Reliable and fast delivery across Bhakkar in every season, rain or fog, piping hot.'
  },
  {
    icon: '🍽️',
    title: 'Comfortable Dine-In',
    description: 'Modern family atmosphere, pleasant music, and welcoming hospitality on Jhang Road.'
  }
];

export const HighlightsSection: React.FC = () => {
  return (
    <section id="highlights" className="py-14 sm:py-16 bg-[#0A0A0A] border-y border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF6321] font-bold">
            Why Bhakkar Loves Us
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel mt-1">
            Experience The Best of Dining
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">
            Quality ingredients, authentic recipes, and dedicated service crafted for every craving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((h, idx) => (
            <div
              key={idx}
              className="group p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-[#FF6321]/40 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-2xl mb-3 group-hover:scale-105 group-hover:border-[#FF6321]/40 transition-transform duration-300 shadow-inner">
                  {h.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF6321] transition-colors font-cinzel">
                  {h.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                  {h.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center text-[10px] font-bold uppercase tracking-wider text-[#FF6321]/80 group-hover:text-[#FF6321]">
                <span>Pizza Lounge &amp; Cakes Promise</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
