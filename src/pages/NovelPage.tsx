import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Menu,
  Users,
  Target,
  Lightbulb,
  FileText,
  Award,
  BookMarked,
  Bookmark,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Quote,
  Pen,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface NovelPageProps {
  onOpenMenu?: () => void;
}

export function NovelPage({ onOpenMenu }: NovelPageProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'characters' | 'themes' | 'exam'>('overview');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const chapters = [
    {
      number: 1,
      title: "The Arrival",
      summary: "The novel opens with the introduction of Mr. Bepo Adewale, a seasoned and respected educationist known for his strict discipline. His appointment as headmaster of a private secondary school in Lekki raises expectations among stakeholders.",
      keyEvents: [
        "Introduction of Mr. Bepo Adewale",
        "His reputation as a strict disciplinarian",
        "Appointment as headmaster in Lekki",
        "Stakeholders' expectations"
      ],
      examFocus: "Mr. Adewale's character introduction and his educational philosophy"
    },
    {
      number: 2,
      title: "First Impressions",
      summary: "Mr. Adewale resumes duty and carefully observes the school environment. He notices lateness, poor student behavior, weak teacher supervision, and lack of moral control.",
      keyEvents: [
        "Mr. Adewale begins his observation",
        "Discovery of rampant lateness",
        "Poor student behavior identified",
        "Weak teacher supervision noted",
        "Lack of moral control in the school"
      ],
      examFocus: "The state of the school before reforms"
    },
    {
      number: 3,
      title: "Uncovering the Rot",
      summary: "The headmaster reviews school records and discovers declining academic standards and frequent cases of examination malpractice that were previously ignored.",
      keyEvents: [
        "Review of school records",
        "Discovery of declining academic standards",
        "Examination malpractice uncovered",
        "Previous administration's negligence exposed"
      ],
      examFocus: "Corruption and malpractice in the education system"
    },
    {
      number: 4,
      title: "The Reforms Begin",
      summary: "Mr. Adewale introduces strict administrative reforms, including punctuality checks, proper dress codes, and firm disciplinary measures for misconduct.",
      keyEvents: [
        "Introduction of punctuality checks",
        "Enforcement of proper dress codes",
        "New disciplinary measures implemented",
        "Administrative restructuring"
      ],
      examFocus: "The importance of discipline in education"
    },
    {
      number: 5,
      title: "Student Resistance",
      summary: "Students react negatively to the new rules. Many are uncomfortable with the sudden end of favoritism and lax discipline.",
      keyEvents: [
        "Students resist new rules",
        "End of favoritism creates tension",
        "Adjustment difficulties among students",
        "Initial rebellion against discipline"
      ],
      examFocus: "Change and resistance to reform"
    },
    {
      number: 6,
      title: "Teacher Discontent",
      summary: "Some teachers express dissatisfaction, as the new leadership exposes their negligence and unethical practices.",
      keyEvents: [
        "Teachers' dissatisfaction emerges",
        "Negligence of some teachers exposed",
        "Unethical practices revealed",
        "Internal conflicts within staff"
      ],
      examFocus: "Role of teachers in educational decay"
    },
    {
      number: 7,
      title: "Parental Pressure",
      summary: "Parents begin to complain, especially wealthy ones whose children are affected by the enforcement of rules.",
      keyEvents: [
        "Wealthy parents complain",
        "Children of elites face discipline",
        "Class privilege challenged",
        "Pressure mounts on administration"
      ],
      examFocus: "Role of parents in educational decay"
    },
    {
      number: 8,
      title: "The Bribes",
      summary: "Attempts are made by influential parents to pressure the headmaster into relaxing disciplinary actions against their children.",
      keyEvents: [
        "Bribery attempts by wealthy parents",
        "Pressure to relax discipline",
        "Use of influence and connections",
        "Moral testing of Mr. Adewale"
      ],
      examFocus: "Corruption and moral compromise"
    },
    {
      number: 9,
      title: "Standing Firm",
      summary: "Mr. Adewale firmly rejects all forms of bribery and influence, reinforcing his belief that education must be based on merit.",
      keyEvents: [
        "Rejection of all bribes",
        "Affirmation of merit-based education",
        "Demonstration of moral courage",
        "Integrity under pressure"
      ],
      examFocus: "Integrity and principled leadership"
    },
    {
      number: 10,
      title: "Management Concerns",
      summary: "The school management shows concern that strict discipline may reduce student enrollment and profit, creating tension with the headmaster.",
      keyEvents: [
        "Management prioritizes profit",
        "Fear of reduced enrollment",
        "Tension between ethics and business",
        "Commercial interests vs. education"
      ],
      examFocus: "Commercialization of education"
    },
    {
      number: 11,
      title: "Justice Served",
      summary: "Cases of examination malpractice are uncovered, and culprits are punished according to school regulations.",
      keyEvents: [
        "Malpractice cases uncovered",
        "Fair punishment administered",
        "School regulations enforced",
        "Precedent for accountability set"
      ],
      examFocus: "Examination malpractice and consequences"
    },
    {
      number: 12,
      title: "Signs of Progress",
      summary: "Students begin to realize the importance of hard work and discipline as academic performance slowly improves.",
      keyEvents: [
        "Students embrace discipline",
        "Academic performance improves",
        "Value of hard work recognized",
        "Positive behavioral changes"
      ],
      examFocus: "Discipline leads to success"
    },
    {
      number: 13,
      title: "Threats and Intimidation",
      summary: "Mr. Adewale faces subtle threats to his job due to his uncompromising stance on discipline and honesty.",
      keyEvents: [
        "Job security threatened",
        "Intimidation tactics used",
        "Pressure to compromise",
        "Test of resolve"
      ],
      examFocus: "Challenges faced by principled leaders"
    },
    {
      number: 14,
      title: "Growing Support",
      summary: "Despite opposition, some teachers and parents begin to support the headmaster, acknowledging positive changes in the school.",
      keyEvents: [
        "Support base grows",
        "Positive changes acknowledged",
        "Alliance of like-minded individuals",
        "Shift in public opinion"
      ],
      examFocus: "Support for integrity and reform"
    },
    {
      number: 15,
      title: "Transformation",
      summary: "The school environment becomes more orderly, and students demonstrate improved behavior and seriousness toward studies.",
      keyEvents: [
        "School environment transforms",
        "Orderly conduct established",
        "Students become serious",
        "Academic culture improves"
      ],
      examFocus: "Results of disciplinary reforms"
    },
    {
      number: 16,
      title: "Corruption Exposed",
      summary: "Corrupt practices within the school administration are exposed, validating the headmaster's concerns.",
      keyEvents: [
        "Administrative corruption revealed",
        "Mr. Adewale's concerns validated",
        "Truth prevails",
        "Accountability demanded"
      ],
      examFocus: "Institutional corruption"
    },
    {
      number: 17,
      title: "Resilience",
      summary: "Mr. Adewale remains firm despite attempts to discredit his leadership.",
      keyEvents: [
        "Attempts to discredit headmaster",
        "Mr. Adewale remains steadfast",
        "Character assassination fails",
        "Integrity triumphs over lies"
      ],
      examFocus: "Resilience and perseverance"
    },
    {
      number: 18,
      title: "Victory of Integrity",
      summary: "The novel concludes with the triumph of integrity, as discipline is restored and the school regains academic credibility.",
      keyEvents: [
        "Discipline fully restored",
        "Academic credibility regained",
        "Integrity triumphs",
        "Legacy of principled leadership"
      ],
      examFocus: "Triumph of integrity over corruption"
    }
  ];

  const characters = [
    {
      name: "Mr. Bepo Adewale",
      role: "Protagonist / Headmaster",
      description: "A disciplined, honest, and courageous headmaster who believes education must develop character and integrity. He is known for his strict discipline and unwavering commitment to merit-based education. Despite facing immense pressure from wealthy parents, corrupt staff, and profit-driven management, he refuses to compromise his principles.",
      traits: ["Disciplined", "Honest", "Courageous", "Principled", "Resilient", "Morally upright"],
      significance: "Represents the ideal educator who prioritizes character formation over certificates. His character challenges the corrupt practices in Nigeria's education system."
    },
    {
      name: "The Students",
      role: "Collective Characters",
      description: "Represent Nigerian youths influenced by moral decline but capable of reform when guided by discipline. Initially resistant to Mr. Adewale's reforms, they eventually embrace discipline and show improved academic performance.",
      traits: ["Impressionable", "Initially undisciplined", "Capable of change", "Responsive to guidance"],
      significance: "Show that young people can be reformed when proper leadership and discipline are applied."
    },
    {
      name: "Wealthy Parents",
      role: "Antagonists",
      description: "Wealthy parents who use their money and influence to shield their children from discipline. They attempt to bribe and pressure Mr. Adewale to relax rules for their children.",
      traits: ["Entitled", "Corrupt", "Manipulative", "Class-conscious"],
      significance: "Symbolize corruption, entitlement, and misuse of power in education. They represent how wealth distorts justice and fairness in Nigerian society."
    },
    {
      name: "Teachers",
      role: "Supporting Characters",
      description: "Some teachers are complicit in the school's decay through negligence and unethical practices. However, others eventually support Mr. Adewale's reforms.",
      traits: ["Initially negligent", "Some corrupt", "Some supportive of reform"],
      significance: "Represent institutional weakness and the potential for change within the education system."
    },
    {
      name: "School Management",
      role: "Antagonists",
      description: "Prioritize profit over educational standards. They create tension with Mr. Adewale by expressing concern that strict discipline may reduce student enrollment.",
      traits: ["Profit-driven", "Morally compromised", "Business-oriented"],
      significance: "Represent the commercialization of education and the conflict between ethics and business interests."
    }
  ];

  const themes = [
    {
      title: "Integrity",
      icon: Award,
      description: "The novel promotes honesty and moral courage as essential leadership qualities. Mr. Adewale's refusal to accept bribes or compromise his principles demonstrates that integrity must not be sacrificed for personal gain.",
      examples: [
        "Mr. Adewale rejecting bribes from wealthy parents",
        "His insistence on merit-based education",
        "Standing firm despite threats to his job"
      ]
    },
    {
      title: "Corruption in Education",
      icon: AlertCircle,
      description: "The novel exposes bribery, examination malpractice, and manipulation by parents and authorities. It shows how corruption has weakened Nigeria's education system.",
      examples: [
        "Examination malpractice in the school",
        "Parents bribing to protect their children",
        "Teachers' negligence and complicity"
      ]
    },
    {
      title: "Discipline",
      icon: CheckCircle2,
      description: "Discipline is portrayed as the foundation of academic excellence and moral growth. The transformation of the school proves that discipline leads to success.",
      examples: [
        "Implementation of punctuality checks",
        "Enforcement of dress codes",
        "Improved academic performance after reforms"
      ]
    },
    {
      title: "Leadership and Responsibility",
      icon: Target,
      description: "True leadership requires firmness, sacrifice, and moral courage. Mr. Adewale demonstrates that leaders must be willing to face opposition for the greater good.",
      examples: [
        "Mr. Adewale's administrative reforms",
        "His resilience against opposition",
        "Eventual support from like-minded individuals"
      ]
    },
    {
      title: "Social Inequality",
      icon: Users,
      description: "Wealth is shown to distort justice and fairness in society. The novel critiques how money and influence are used to circumvent rules and protect the privileged.",
      examples: [
        "Wealthy parents expecting special treatment",
        "Class privilege being challenged",
        "Equal application of rules to all students"
      ]
    },
    {
      title: "Education and Character Formation",
      icon: GraduationCap,
      description: "Education should shape morals, not just produce certificates. The novel argues that true education must develop both academic excellence and moral character.",
      examples: [
        "Mr. Adewale's educational philosophy",
        "Students learning the value of hard work",
        "Balance between academics and character"
      ]
    }
  ];

  const examQuestions = [
    {
      category: "Character Analysis",
      questions: [
        "Discuss the character of Mr. Bepo Adewale as a principled leader.",
        "How does Mr. Adewale demonstrate integrity throughout the novel?",
        "Examine the role of wealthy parents as antagonists in the novel.",
        "What lessons can be learned from the transformation of the students?"
      ]
    },
    {
      category: "Themes",
      questions: [
        "Discuss corruption in education as portrayed in The Lekki Headmaster.",
        "How does the novel present discipline as a foundation for success?",
        "Examine the theme of integrity versus corruption in the novel.",
        "Discuss the role of social inequality in the novel."
      ]
    },
    {
      category: "Plot and Setting",
      questions: [
        "Trace the reforms introduced by Mr. Adewale and their effects.",
        "How does the Lekki setting contribute to the themes of the novel?",
        "Discuss the conflict between Mr. Adewale and the school management.",
        "Examine the turning point in the novel."
      ]
    },
    {
      category: "Style and Technique",
      questions: [
        "Comment on the author's use of realistic narration in the novel.",
        "How does dialogue contribute to character development in the novel?",
        "Discuss the didactic style of The Lekki Headmaster.",
        "What literary devices does the author use to convey the novel's message?"
      ]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'chapters', label: 'Chapters', icon: FileText },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'themes', label: 'Themes', icon: Lightbulb },
    { id: 'exam', label: 'Exam Prep', icon: GraduationCap }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 px-4 py-3 ${
        isDark ? 'bg-black/80' : 'bg-white/80'
      } backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className={`p-2.5 rounded-xl ${
              isDark ? 'hover:bg-white/10 active:bg-white/20' : 'hover:bg-gray-100 active:bg-gray-200'
            } transition-all touch-manipulation`}
          >
            <Menu className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-purple-500" />
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
              JAMB Literature
            </h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 pb-24">
        {/* Book Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 border mb-6 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20' 
              : 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-20 h-28 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-purple-600' : 'bg-purple-500'
            } shadow-lg`}>
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                The Lekki Headmaster
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <Pen className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Kabir Alabi Garba
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Lekki, Lagos State, Nigeria
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-200 text-purple-700'
                }`}>
                  Educational Fiction
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-200 text-blue-700'
                }`}>
                  Social Realism
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-200 text-green-700'
                }`}>
                  JAMB Text
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* One-Line Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 border mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/20' 
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <Quote className={`w-6 h-6 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <p className={`text-sm italic ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
              "The Lekki Headmaster exposes corruption in Nigeria's education system and celebrates
              integrity, discipline, and principled leadership through Mr. Bepo Adewale."
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all touch-manipulation ${
                  activeTab === tab.id
                    ? isDark 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-500 text-white'
                    : isDark
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Plot Overview */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Plot Overview
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  The Lekki Headmaster is a realistic novel that exposes the moral decay, corruption,
                  and indiscipline prevalent in Nigeria's contemporary education system.
                </p>
                <p className={`text-sm leading-relaxed mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  The novel follows Mr. Bepo Adewale, an experienced and principled educationist
                  appointed as the headmaster of a private secondary school in Lekki. From the outset,
                  he encounters a school environment weakened by indiscipline, examination malpractice,
                  parental interference, and compromised school authorities.
                </p>
                <p className={`text-sm leading-relaxed mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Despite intense pressure from wealthy parents and management who prioritize profit
                  over morals, Mr. Adewale insists on discipline, merit, and integrity. His refusal to
                  compromise standards places him in constant conflict with influential stakeholders.
                  Through resilience and moral courage, he restores order and proves that education
                  must be founded on character as well as academics.
                </p>
              </div>

              {/* Symbolism */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Symbolism
                </h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>The School:</span>
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Represents Nigerian society</span>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Examinations:</span>
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Symbolize honesty versus corruption</span>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Disciplinary Rules:</span>
                    <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Symbolize justice and moral order</span>
                  </div>
                </div>
              </div>

              {/* Style and Language */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Style and Language
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>Simple Nigerian English</span>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>Didactic Style</span>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>Realistic Narration</span>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                  }`}>Dialogue-Driven</span>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                  }`}>Strong Moral Emphasis</span>
                </div>
              </div>

              {/* Moral Lessons */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    Moral Lessons
                  </h3>
                </div>
                <ul className="space-y-2">
                  {[
                    "Integrity must not be compromised",
                    "Discipline leads to success",
                    "Wealth should not override justice",
                    "Education must build character"
                  ].map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-green-200' : 'text-green-800'}`}>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {selectedChapter === null ? (
                <>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    18 chapters covering Mr. Adewale's journey to reform the school
                  </p>
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.number}
                      onClick={() => setSelectedChapter(chapter.number)}
                      className={`w-full text-left p-4 rounded-xl border transition-all touch-manipulation ${
                        isDark 
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 active:bg-white/15' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                          }`}>
                            <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              {chapter.number}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {chapter.title}
                            </h4>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              Chapter {chapter.number} of 18
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className={`flex items-center gap-2 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to all chapters
                  </button>

                  {(() => {
                    const chapter = chapters.find(c => c.number === selectedChapter)!;
                    return (
                      <>
                        <div className={`rounded-2xl p-5 border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                            }`}>
                              <span className={`text-xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                {chapter.number}
                              </span>
                            </div>
                            <div>
                              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                {chapter.title}
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Chapter {chapter.number}
                              </p>
                            </div>
                          </div>

                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Summary</h4>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {chapter.summary}
                          </p>
                        </div>

                        <div className={`rounded-2xl p-5 border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                        }`}>
                          <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Events</h4>
                          <ul className="space-y-2">
                            {chapter.keyEvents.map((event, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isDark ? 'bg-purple-400' : 'bg-purple-500'}`} />
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{event}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={`rounded-2xl p-5 border ${
                          isDark ? 'bg-amber-900/20 border-amber-500/20' : 'bg-amber-50 border-amber-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                            <h4 className={`font-semibold ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>Exam Focus</h4>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>{chapter.examFocus}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                            disabled={selectedChapter === 1}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                              selectedChapter === 1
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            } ${isDark ? 'bg-white/5 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                          <button
                            onClick={() => setSelectedChapter(Math.min(18, selectedChapter + 1))}
                            disabled={selectedChapter === 18}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                              selectedChapter === 18
                                ? 'opacity-50 cursor-not-allowed'
                                : 'bg-purple-600 text-white'
                            }`}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}

          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {characters.map((character, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      idx === 0 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                        : isDark ? 'bg-white/10' : 'bg-gray-100'
                    }`}>
                      <Users className={`w-6 h-6 ${idx === 0 ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{character.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{character.role}</p>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {character.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {character.traits.map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                    <p className={`text-xs font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      <span className="font-semibold">Significance: </span>
                      {character.significance}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Themes Tab */}
          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {themes.map((theme, idx) => {
                const Icon = theme.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 border ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{theme.title}</h3>
                    </div>

                    <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {theme.description}
                    </p>

                    <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Examples from the novel:
                      </p>
                      <ul className="space-y-1">
                        {theme.examples.map((example, eIdx) => (
                          <li key={eIdx} className="flex items-start gap-2">
                            <div className={`w-1 h-1 rounded-full mt-2 ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`} />
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Exam Prep Tab */}
          {activeTab === 'exam' && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* JAMB Focus Areas */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/20' 
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                    JAMB Focus Areas
                  </h3>
                </div>
                <ul className="space-y-2">
                  {[
                    "Character of Mr. Bepo Adewale",
                    "Causes and effects of corruption in schools",
                    "Role of parents in educational decay",
                    "Importance of discipline",
                    "Overall message of the novel"
                  ].map((focus, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Bookmark className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-red-200' : 'text-red-800'}`}>{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Likely Questions */}
              {examQuestions.map((category, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.questions.map((question, qIdx) => (
                      <li
                        key={qIdx}
                        className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {qIdx + 1}
                          </span>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {question}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Quick Tips */}
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Exam Tips
                  </h3>
                </div>
                <ul className="space-y-2">
                  {[
                    "Always quote specific examples from chapters",
                    "Connect themes to real-life Nigerian education",
                    "Analyze character motivations, not just actions",
                    "Discuss the author's message and style",
                    "Use proper literary terms in your answers"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-green-200' : 'text-green-800'}`}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NovelPage;
