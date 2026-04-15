'use client';

import { useState } from 'react';

interface FeedbackProps {
  question?: string;
  response?: string;
  onFeedbackSubmit?: (rating: string) => void;
}

export default function FeedbackWidget({ 
  question = '', 
  response = '',
  onFeedbackSubmit 
}: FeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          message,
          question,
          response,
        }),
      });
      
      if (res.ok) {
        setSubmitted(true);
        onFeedbackSubmit?.(rating);
      }
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提取星座和MBTI
  const extractZodiacMBTI = (text: string) => {
    const zodiacs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const mbtiTypes = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp', 'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];
    
    const lowerText = text.toLowerCase();
    const zodiac = zodiacs.find(z => lowerText.includes(z)) || '';
    const mbti = mbtiTypes.find(m => lowerText.includes(m)) || '';
    
    return { zodiac, mbti };
  };

  const { zodiac, mbti } = extractZodiacMBTI(question);

  if (submitted) {
    return (
      <div 
        className="fixed bottom-24 right-6 p-4 rounded-xl shadow-lg animate-bounce"
        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
      >
        <p className="text-white font-medium flex items-center gap-2">
          <span>✨</span>
          Thanks for your feedback!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-white font-medium transition-all hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <span>💬</span>
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: '#e9d5ff' }}>
              How was your fortune? 🌟
            </h3>
            
            {/* Rating Buttons */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setRating('positive')}
                className={`p-4 rounded-xl text-3xl transition-all ${
                  rating === 'positive' ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ 
                  background: rating === 'positive' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: rating === 'positive' ? '2px solid #10b981' : '2px solid transparent'
                }}
              >
                😄
              </button>
              <button
                onClick={() => setRating('neutral')}
                className={`p-4 rounded-xl text-3xl transition-all ${
                  rating === 'neutral' ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ 
                  background: rating === 'neutral' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: rating === 'neutral' ? '2px solid #fbbf24' : '2px solid transparent'
                }}
              >
                😐
              </button>
              <button
                onClick={() => setRating('negative')}
                className={`p-4 rounded-xl text-3xl transition-all ${
                  rating === 'negative' ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ 
                  background: rating === 'negative' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  border: rating === 'negative' ? '2px solid #ef4444' : '2px solid transparent'
                }}
              >
                😔
              </button>
            </div>

            {/* Message Input */}
            {rating && (
              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your experience... (optional)"
                  className="w-full p-3 rounded-xl text-white placeholder-gray-400 resize-none"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    minHeight: '100px'
                  }}
                  maxLength={500}
                />
                <p className="text-right text-xs text-gray-400 mt-1">
                  {message.length}/500
                </p>
              </div>
            )}

            {/* Submit Button */}
            {rating && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}
              >
                {isSubmitting ? 'Sending...' : 'Submit Feedback ✨'}
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>

            {/* Stats */}
            {zodiac && mbti && (
              <p className="text-center text-sm mt-4" style={{ color: '#a78bfa' }}>
                {zodiac.charAt(0).toUpperCase() + zodiac.slice(1)} + {mbti.toUpperCase()} | 
                Your cosmic profile
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
