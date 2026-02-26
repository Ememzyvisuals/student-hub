import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  Users, 
  Lightbulb,
  Target,
  BookMarked,
  ArrowLeft
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/store/useStore';

interface Chapter {
  number: number;
  title: string;
  summary: string;
  keyEvents: string[];
  characters: string[];
  themes: string[];
  examFocus: string[];
}

const novelData = {
  title: "The Lekki Headmaster",
  author: "Adaora Ulasi",
  introduction: "The Lekki Headmaster is a captivating Nigerian novel that explores themes of education, tradition, and social change in colonial and post-colonial Nigeria. It tells the story of a dedicated headmaster navigating the complexities of running a school while dealing with cultural tensions and personal challenges.",
  chapters: [
    {
      number: 1,
      title: "The Arrival",
      summary: "The novel opens with the introduction of the protagonist, a newly appointed headmaster arriving at a school in Lekki. His arrival sparks curiosity and mixed reactions from the community.",
      keyEvents: [
        "The headmaster arrives at the school premises",
        "He meets the school staff and observes the state of the institution",
        "The local community discusses the new headmaster",
        "Initial challenges and resistance become apparent"
      ],
      characters: [
        "The Headmaster - protagonist, educated and idealistic",
        "School staff members",
        "Local community leaders"
      ],
      themes: [
        "Change vs. Tradition",
        "Education as a tool for progress",
        "Cultural identity"
      ],
      examFocus: [
        "Character introduction and motivation",
        "Setting description and its significance",
        "Foreshadowing of conflicts"
      ]
    },
    {
      number: 2,
      title: "First Impressions",
      summary: "The headmaster begins to implement changes in the school, facing resistance from traditionalists while gaining support from progressive members of the community.",
      keyEvents: [
        "Implementation of new educational policies",
        "Conflict with traditional authorities",
        "Building relationships with students",
        "First signs of success in the school"
      ],
      characters: [
        "Traditional chiefs who oppose change",
        "Progressive teachers who support reform",
        "Key students who embody hope for the future"
      ],
      themes: [
        "Modernization vs. traditional values",
        "The power of education",
        "Leadership and vision"
      ],
      examFocus: [
        "Conflict development",
        "Characterization through action",
        "Symbolism of the school"
      ]
    },
    {
      number: 3,
      title: "Growing Tensions",
      summary: "As the headmaster continues his reforms, tensions escalate. Personal and professional challenges test his resolve and commitment to his mission.",
      keyEvents: [
        "Major confrontation with opposition",
        "A crisis threatens the school",
        "The headmaster must make difficult choices",
        "Alliance building and strategic decisions"
      ],
      characters: [
        "New allies emerge",
        "The main antagonist's motivations revealed",
        "Supporting characters show their true colors"
      ],
      themes: [
        "Perseverance in adversity",
        "The cost of progress",
        "Community and individual responsibility"
      ],
      examFocus: [
        "Rising action and climax",
        "Thematic development",
        "Narrative techniques"
      ]
    },
    {
      number: 4,
      title: "Resolution",
      summary: "The story reaches its climax and resolution, with the headmaster and the community finding a way forward that honors both tradition and progress.",
      keyEvents: [
        "Final confrontation resolved",
        "The school achieves recognition",
        "Community reconciliation",
        "The headmaster's legacy established"
      ],
      characters: [
        "Transformed characters show growth",
        "Former opponents become allies",
        "New generation inspired by the journey"
      ],
      themes: [
        "Reconciliation and compromise",
        "The lasting impact of education",
        "Hope for the future"
      ],
      examFocus: [
        "Resolution and denouement",
        "Character transformation",
        "Overall message and moral"
      ]
    }
  ]
};

interface NovelPageProps {
  onOpenMenu: () => void;
}

export function NovelPage({ onOpenMenu }: NovelPageProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 px-4 py-4 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {selectedChapter ? (
            <button 
              onClick={() => setSelectedChapter(null)} 
              className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
            >
              <ArrowLeft size={22} strokeWidth={1.5} />
            </button>
          ) : (
            <button
              onClick={onOpenMenu}
              className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 w-5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
                <span className={`block h-0.5 w-4 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
                <span className={`block h-0.5 w-5 rounded-full ${isDark ? 'bg-white' : 'bg-gray-800'}`}></span>
              </div>
            </button>
          )}
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
            {selectedChapter ? `Chapter ${selectedChapter.number}` : "JAMB Novel"}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedChapter ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Book Cover Card */}
              <GlassCard hover={false} neonBorder className="text-center py-8">
                <div className="w-24 h-32 mx-auto rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                  <BookMarked size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <h2 
                  className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {novelData.title}
                </h2>
                <p className="text-primary font-medium">by {novelData.author}</p>
              </GlassCard>

              {/* Introduction */}
              <GlassCard hover={false}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <BookOpen size={18} className="text-primary" strokeWidth={1.5} />
                  About the Novel
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {novelData.introduction}
                </p>
              </GlassCard>

              {/* Chapter List */}
              <div>
                <h3 
                  className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  Chapters
                </h3>
                <div className="space-y-3">
                  {novelData.chapters.map((chapter, idx) => (
                    <motion.div
                      key={chapter.number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassCard onClick={() => setSelectedChapter(chapter)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                              <span className="text-xl font-bold text-amber-500">{chapter.number}</span>
                            </div>
                            <div>
                              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{chapter.title}</h4>
                              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Chapter {chapter.number}</p>
                            </div>
                          </div>
                          <ChevronRight size={20} className={isDark ? 'text-white/40' : 'text-gray-400'} strokeWidth={1.5} />
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chapter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Chapter Header */}
              <GlassCard hover={false} className="text-center py-6">
                <p className="text-primary text-sm font-semibold">Chapter {selectedChapter.number}</p>
                <h2 
                  className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  {selectedChapter.title}
                </h2>
              </GlassCard>

              {/* Summary */}
              <GlassCard hover={false}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <BookOpen size={18} className="text-primary" strokeWidth={1.5} />
                  Summary
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {selectedChapter.summary}
                </p>
              </GlassCard>

              {/* Key Events */}
              <GlassCard hover={false}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Lightbulb size={18} className="text-yellow-400" strokeWidth={1.5} />
                  Key Events
                </h3>
                <ul className="space-y-2">
                  {selectedChapter.keyEvents.map((event, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                      {event}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Characters */}
              <GlassCard hover={false}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Users size={18} className="text-blue-400" strokeWidth={1.5} />
                  Important Characters
                </h3>
                <ul className="space-y-2">
                  {selectedChapter.characters.map((character, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      {character}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Themes */}
              <GlassCard hover={false}>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <BookMarked size={18} className="text-purple-400" strokeWidth={1.5} />
                  Themes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChapter.themes.map((theme, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Exam Focus */}
              <GlassCard hover={false} neonBorder>
                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Target size={18} className="text-red-500" strokeWidth={1.5} />
                  Exam Focus Points
                </h3>
                <ul className="space-y-2">
                  {selectedChapter.examFocus.map((point, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
