import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: 'Where is Pizza Lounge & Cakes located in Bhakkar?',
    answer: 'Pizza Lounge & Cakes is located on Jhang Road, near Gulshan-e-Madina, Bhakkar, 30000, Punjab, Pakistan (Plus code: J34R+JX6). We offer comfortable family dining, takeaway, and quick home delivery across Bhakkar.'
  },
  {
    question: 'What are the opening hours of Pizza Lounge & Cakes Bhakkar?',
    answer: 'We are open seven days a week: Monday to Thursday from 11:00 AM to 1:30 AM, Friday from 10:00 AM to 1:30 AM (early opening), and Saturday to Sunday from 11:00 AM to 1:30 AM. Late-night pizza and fast food orders are welcomed.'
  },
  {
    question: 'What are your signature pizza flavors and crust types?',
    answer: 'Our top-rated specialties include the famous Lounge Special Crown Crust Pizza (stuffed with juicy kabab & melted cheese), Chicken Fajita, Chicken Tikka, Cheese Lover Supreme, and Malai Boti stuffed crust pizzas.'
  },
  {
    question: 'How do I order customized birthday or celebration cakes in Bhakkar?',
    answer: 'You can browse our fresh cake menu online or use our Cake Customization form. We prepare Chocolate Fudge, Red Velvet with Cream Cheese, Lotus Biscoff Caramel, and custom 3D fondant celebration cakes. You can also place pre-orders directly via WhatsApp at 0321 8865050.'
  },
  {
    question: 'Does Pizza Lounge & Cakes deliver across Bhakkar and what are the delivery charges?',
    answer: 'Yes! We deliver to Gulshan-e-Madina, Jhang Road, City Center, Main Bazar, Railway Road, Mandi Town, and surrounding areas in Bhakkar. Delivery is FREE on all orders of PKR 2,000 or more, and a nominal delivery fee of PKR 100 applies to smaller orders.'
  },
  {
    question: 'Can I place an order via WhatsApp or Cash on Delivery (COD)?',
    answer: 'Yes, both payment methods are fully supported. You can order online through our cart using Cash on Delivery (COD) or click the WhatsApp Order button to send your order directly to our official business number 0321 8865050.'
  }
];

export const SeoFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#0A0A0A] text-zinc-100 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#FF6321] flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-white tracking-tight">
            Frequently Asked <span className="text-[#FF6321]">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Everything you need to know about dining in, home delivery in Bhakkar, custom cake pre-orders, and opening hours.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-white font-cinzel">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 text-[#FF6321] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#FF6321]/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
