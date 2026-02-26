import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, MessageSquare, Heart } from 'lucide-react';

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  onMaybeLater: () => void;
}

export default function RatingPopup({ isOpen, onClose, onSubmit, onMaybeLater }: RatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [step, setStep] = useState<'rating' | 'review' | 'thanks'>('rating');

  const handleRatingClick = (value: number) => {
    setRating(value);
    setTimeout(() => setStep('review'), 300);
  };

  const handleSubmit = () => {
    onSubmit(rating, review);
    setStep('thanks');
    setTimeout(() => {
      onClose();
      setStep('rating');
      setRating(0);
      setReview('');
    }, 2500);
  };

  const handleMaybeLater = () => {
    onMaybeLater();
    onClose();
    setStep('rating');
    setRating(0);
    setReview('');
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Great';
      case 5: return 'Excellent';
      default: return 'Tap to rate';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleMaybeLater}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 text-center bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
              <button
                onClick={handleMaybeLater}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
              
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                {step === 'thanks' ? (
                  <Heart className="w-8 h-8 text-white" />
                ) : (
                  <MessageSquare className="w-8 h-8 text-white" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {step === 'thanks' ? 'Thank You!' : 'Enjoying StudentHub NG?'}
              </h2>
              <p className="text-sm text-white/60 mt-1">
                {step === 'thanks' 
                  ? 'Your feedback helps us improve'
                  : 'Your feedback means a lot to us'
                }
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 'rating' && (
                  <motion.div
                    key="rating"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <p className="text-white/80 mb-4 text-sm">
                      How would you rate your experience?
                    </p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoveredRating(value)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRatingClick(value)}
                          className="p-1 transition-colors"
                        >
                          <Star
                            className={`w-10 h-10 transition-all duration-200 ${
                              value <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                                : 'text-white/30'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    
                    <p className="text-sm text-white/60 h-5">
                      {getRatingText(hoveredRating || rating)}
                    </p>
                    
                    <button
                      onClick={handleMaybeLater}
                      className="mt-6 text-sm text-white/50 hover:text-white/70 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </motion.div>
                )}

                {step === 'review' && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Selected Rating Display */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-6 h-6 ${
                            value <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-white/80 mb-3 text-sm text-center">
                      Tell us what you think (optional)
                    </p>
                    
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Your feedback helps us improve StudentHub NG for all Nigerian students..."
                      className="w-full h-24 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setStep('rating')}
                        className="flex-1 py-3 rounded-xl bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'thanks' && (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Heart className="w-10 h-10 text-white fill-white" />
                      </motion.div>
                    </motion.div>
                    
                    <p className="text-white/80 text-sm">
                      We appreciate your feedback!
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Built with love by EMEMZYVISUALS
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
