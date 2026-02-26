import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  RotateCcw, 
  Check, 
  Clock, 
  Trash2,
  Layers,
  X,
  Menu
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Textarea, Select } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { db, Flashcard } from '@/lib/db';
import { getSubjects, getTopics } from '@/data/questionBank';
import { toNumericId } from '@/lib/utils';

interface FlashcardsPageProps {
  onOpenMenu: () => void;
}

export function FlashcardsPage({ onOpenMenu }: FlashcardsPageProps) {
  const { currentUser, theme } = useStore();
  const level = currentUser?.academicLevel || 'JAMB';
  const isDark = theme === 'dark';
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'review' | 'known'>('all');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    subject: '',
    topic: ''
  });

  const subjects = getSubjects(level);
  const topics = newCard.subject ? getTopics(level, newCard.subject) : [];

  useEffect(() => {
    loadFlashcards();
  }, [currentUser?.id]);

  const loadFlashcards = async () => {
    if (!currentUser) return;
    const userId = toNumericId(currentUser.id);
    const cards = await db.flashcards.where('userId').equals(userId).toArray();
    setFlashcards(cards);
  };

  const filteredCards = flashcards.filter(card => {
    if (filter === 'review') return card.reviewLater;
    if (filter === 'known') return card.isKnown;
    if (selectedSubject && card.subject !== selectedSubject) return false;
    return true;
  });

  const handleCreateCard = async () => {
    if (!currentUser || !newCard.front || !newCard.back) return;

    await db.flashcards.add({
      userId: toNumericId(currentUser.id),
      front: newCard.front,
      back: newCard.back,
      subject: newCard.subject,
      topic: newCard.topic,
      isKnown: false,
      reviewLater: false,
      createdAt: new Date()
    });

    setNewCard({ front: '', back: '', subject: '', topic: '' });
    setShowCreate(false);
    loadFlashcards();
  };

  const handleMarkKnown = async () => {
    const card = filteredCards[currentCard];
    if (!card?.id) return;

    await db.flashcards.update(card.id, { isKnown: true, reviewLater: false });
    loadFlashcards();
    nextCard();
  };

  const handleMarkReview = async () => {
    const card = filteredCards[currentCard];
    if (!card?.id) return;

    await db.flashcards.update(card.id, { reviewLater: true });
    loadFlashcards();
    nextCard();
  };

  const handleDelete = async () => {
    const card = filteredCards[currentCard];
    if (!card?.id) return;

    await db.flashcards.delete(card.id);
    loadFlashcards();
    if (currentCard > 0) setCurrentCard(prev => prev - 1);
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentCard < filteredCards.length - 1) {
      setCurrentCard(prev => prev + 1);
    } else {
      setCurrentCard(0);
    }
  };

  const activeCard = filteredCards[currentCard];

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header with Menu */}
      <div className={`sticky top-0 z-30 px-4 py-3 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenMenu} 
              className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Flashcards
            </h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCreate(true)}
            className="p-2.5 rounded-xl bg-primary/20 text-primary"
          >
            <Plus size={22} strokeWidth={1.5} />
          </motion.button>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="text-center py-3" hover={false}>
            <Layers className="w-5 h-5 mx-auto mb-1 text-primary" strokeWidth={1.5} />
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{flashcards.length}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Total</p>
          </GlassCard>
          <GlassCard className="text-center py-3" hover={false}>
            <Check className="w-5 h-5 mx-auto mb-1 text-green-500" strokeWidth={1.5} />
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{flashcards.filter(c => c.isKnown).length}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Known</p>
          </GlassCard>
          <GlassCard className="text-center py-3" hover={false}>
            <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" strokeWidth={1.5} />
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{flashcards.filter(c => c.reviewLater).length}</p>
            <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Review</p>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {['all', 'review', 'known'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f as 'all' | 'review' | 'known'); setCurrentCard(0); setIsFlipped(false); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <select
            value={selectedSubject}
            onChange={e => { setSelectedSubject(e.target.value); setCurrentCard(0); setIsFlipped(false); }}
            className={`px-4 py-2.5 rounded-xl text-sm border-0 ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Flashcard */}
        {filteredCards.length > 0 ? (
          <div className="space-y-4">
            <p className={`text-center text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              Card {currentCard + 1} of {filteredCards.length}
            </p>

            <motion.div
              className="relative h-72 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-center items-center text-center border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <p className="text-xs text-primary mb-4 font-medium">{activeCard?.subject}</p>
                  <p className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{activeCard?.front}</p>
                  <p className={`text-xs mt-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Tap to flip</p>
                </div>

                {/* Back */}
                <div 
                  className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-center items-center text-center border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
                  }`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <p className={`text-lg leading-relaxed ${isDark ? 'text-white' : 'text-gray-900'}`}>{activeCard?.back}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleDelete} variant="ghost" className="flex-1">
                <Trash2 size={18} strokeWidth={1.5} />
              </Button>
              <Button onClick={handleMarkReview} variant="secondary" className="flex-1">
                <Clock size={18} className="mr-2" strokeWidth={1.5} />
                Later
              </Button>
              <Button onClick={handleMarkKnown} className="flex-1">
                <Check size={18} className="mr-2" strokeWidth={1.5} />
                Known
              </Button>
            </div>

            <Button onClick={nextCard} variant="secondary" fullWidth>
              <RotateCcw size={18} className="mr-2" strokeWidth={1.5} />
              Next Card
            </Button>
          </div>
        ) : (
          <GlassCard className="text-center py-12" hover={false}>
            <Layers className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} strokeWidth={1.5} />
            <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>No flashcards yet</p>
            <Button onClick={() => setShowCreate(true)} icon={<Plus size={18} strokeWidth={1.5} />}>
              Create Your First Card
            </Button>
          </GlassCard>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 border ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  New Flashcard
                </h2>
                <button onClick={() => setShowCreate(false)} className={isDark ? 'text-white/60' : 'text-gray-400'}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Question (Front)"
                  placeholder="Enter the question or term"
                  value={newCard.front}
                  onChange={e => setNewCard({ ...newCard, front: e.target.value })}
                  rows={3}
                />
                <Textarea
                  label="Answer (Back)"
                  placeholder="Enter the answer or definition"
                  value={newCard.back}
                  onChange={e => setNewCard({ ...newCard, back: e.target.value })}
                  rows={3}
                />
                <Select
                  label="Subject"
                  value={newCard.subject}
                  onChange={e => setNewCard({ ...newCard, subject: e.target.value, topic: '' })}
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...subjects.map(s => ({ value: s, label: s }))
                  ]}
                />
                {topics.length > 0 && (
                  <Select
                    label="Topic"
                    value={newCard.topic}
                    onChange={e => setNewCard({ ...newCard, topic: e.target.value })}
                    options={[
                      { value: '', label: 'Select Topic' },
                      ...topics.map(t => ({ value: t, label: t }))
                    ]}
                  />
                )}
                <Button onClick={handleCreateCard} fullWidth disabled={!newCard.front || !newCard.back}>
                  Create Flashcard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
