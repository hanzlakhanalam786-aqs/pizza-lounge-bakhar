import React, { useState } from 'react';
import { Star, MessageSquareQuote, Check, Sparkles, Send } from 'lucide-react';
import { CustomerReview } from '../types.ts';
import { submitReview } from '../services/api.ts';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  onReviewAdded: (newReview: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [orderedItem, setOrderedItem] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4'>('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const created = await submitReview({
        name,
        rating,
        comment,
        orderedItem: orderedItem || 'Pizza & Fast Food'
      });
      onReviewAdded(created);
      setSuccessMsg(true);
      setName('');
      setComment('');
      setOrderedItem('');
      setTimeout(() => {
        setSuccessMsg(false);
        setShowForm(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === Number(filterRating);
  });

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-[#0A0A0A] text-zinc-100 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with rating badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#FF6321] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white tracking-tight">
              What Bhakkar Foodies Say
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Genuine experiences from guests who dined in our restaurant or ordered fast delivery in Bhakkar.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl shrink-0 shadow-lg">
            <div className="text-right">
              <div className="text-2xl font-bold text-white font-mono tabular-nums">{averageRating} / 5.0</div>
              <div className="flex items-center gap-1 text-[#FF6321] justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FF6321] text-[#FF6321]" />
                ))}
              </div>
              <span className="text-[11px] text-zinc-400">{reviews.length} verified ratings</span>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#FF6321] hover:bg-[#e5591e] text-black text-xs font-black rounded-full transition-all cursor-pointer shadow-md shadow-[#FF6321]/20"
            >
              {showForm ? 'CANCEL' : 'WRITE REVIEW'}
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: '5', label: '5-Star Reviews' },
            { id: '4', label: '4-Star Reviews' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterRating(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                filterRating === f.id
                  ? 'bg-zinc-800 border-[#FF6321] text-[#FF6321]'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Leave a Review Modal / Expandable Form */}
        {showForm && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-cinzel text-white">Share Your Experience</h3>
            {successMsg ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your feedback has been submitted successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ahmad Raza"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Item Ordered</label>
                    <input
                      type="text"
                      value={orderedItem}
                      onChange={(e) => setOrderedItem(e.target.value)}
                      placeholder="e.g. Crown Crust Pizza or Fudge Cake"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`p-1.5 rounded cursor-pointer transition-colors ${
                          rating >= num ? 'text-[#FF6321]' : 'text-zinc-600'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= num ? 'fill-[#FF6321]' : ''}`} />
                      </button>
                    ))}
                    <span className="text-xs text-zinc-400 ml-2">{rating} out of 5 stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked about the crust, delivery, burgers, or cakes..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#FF6321] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#FF6321] hover:bg-[#e5591e] text-black text-xs font-black rounded-full transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#FF6321]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'POST REVIEW'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-[#FF6321]/40 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FF6321]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#FF6321] text-[#FF6321]' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block font-cinzel">{rev.name}</span>
                  {rev.orderedItem && (
                    <span className="text-[#FF6321] text-[11px] block">{rev.orderedItem}</span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  Verified Diner
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
