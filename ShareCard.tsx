'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Share2, Copy, Check, Twitter, Facebook } from 'lucide-react';

interface ShareCardProps {
  question: string;
  response: string;
  zodiac?: string;
  mbti?: string;
  onClose: () => void;
}

export default function ShareCard({ question, response, zodiac, mbti, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setShowCard(true);
  }, []);

  const shareText = `🔮 My Zodiac + MBTI Fortune\n\n${question ? `Q: ${question}\n\n` : ''}${response.substring(0, 200)}${response.length > 200 ? '...' : ''}\n\n✨ Get your fortune: https://8cfe2369-77c3-43f9-b04c-35886985c710.dev.coze.site`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const url = encodeURIComponent('https://8cfe2369-77c3-43f9-b04c-35886985c710.dev.coze.site');
    const text = encodeURIComponent(shareText);

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    }
  };

  if (!showCard) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="relative p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3 className="text-lg font-bold text-white text-center">✨ Share Your Fortune</h3>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="p-4">
          <Card 
            className="p-4 mb-4"
            style={{ background: 'rgba(88, 28, 135, 0.3)', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #ec4899 50%, #8b5cf6 100%)' }}>
                <span className="text-lg">🔮</span>
              </div>
              <div>
                <p className="text-sm font-bold text-purple-100">Zodiac MBTI Oracle</p>
                <p className="text-xs text-purple-300/70">0.0001% Accurate</p>
              </div>
            </div>
            
            {zodiac && mbti && (
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(168, 85, 247, 0.3)', color: '#e9d5ff' }}>
                  ♈ {zodiac}
                </span>
                <span className="px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(236, 72, 153, 0.3)', color: '#fbcfe8' }}>
                  🧠 {mbti.toUpperCase()}
                </span>
              </div>
            )}
            
            <p className="text-sm text-purple-100 whitespace-pre-wrap">
              {response.substring(0, 150)}
              {response.length > 150 && '...'}
            </p>
          </Card>

          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={handleCopy}
              className="w-full justify-start"
              style={{ background: 'rgba(139, 92, 246, 0.3)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#e9d5ff' }}
            >
              {copied ? <Check className="mr-2 h-4 w-4 text-green-400" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={() => handleShare('twitter')}
                className="flex-1 justify-center"
                style={{ background: '#1DA1F2' }}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare('facebook')}
                className="flex-1 justify-center"
                style={{ background: '#4267B2' }}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>

            <Button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Zodiac Fortune',
                    text: shareText,
                    url: 'https://8cfe2369-77c3-43f9-b04c-35886985c710.dev.coze.site',
                  });
                }
              }}
              variant="outline"
              className="w-full justify-center border-purple-500/30 text-purple-200"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
