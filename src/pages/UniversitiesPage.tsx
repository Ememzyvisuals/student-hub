import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  GraduationCap,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  Globe,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Filter,
  TrendingUp,
  Users,
  Award,
  FileText,
  Shield,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface UniversitiesPageProps {
  onOpenMenu: () => void;
}

interface University {
  name: string;
  shortName: string;
  website: string;
  admissionPortal?: string;
  prospectus?: string;
  type: 'federal' | 'state' | 'private';
  region: string;
  difficulty: 'high' | 'moderate' | 'easy';
  description?: string;
}

const federalUniversities: University[] = [
  {
    name: 'University of Ibadan',
    shortName: 'UI',
    website: 'https://www.ui.edu.ng',
    admissionPortal: 'https://admissions.ui.edu.ng',
    type: 'federal',
    region: 'Southwest',
    difficulty: 'high',
    description: 'Nigeria\'s premier university, established in 1948.',
  },
  {
    name: 'University of Lagos',
    shortName: 'UNILAG',
    website: 'https://www.unilag.edu.ng',
    admissionPortal: 'https://admissions.unilag.edu.ng',
    type: 'federal',
    region: 'Southwest',
    difficulty: 'high',
    description: 'A leading research university in Lagos.',
  },
  {
    name: 'Obafemi Awolowo University',
    shortName: 'OAU',
    website: 'https://www.oauife.edu.ng',
    admissionPortal: 'https://admissions.oauife.edu.ng',
    type: 'federal',
    region: 'Southwest',
    difficulty: 'high',
    description: 'Known for its beautiful campus and academic excellence.',
  },
  {
    name: 'University of Nigeria, Nsukka',
    shortName: 'UNN',
    website: 'https://www.unn.edu.ng',
    admissionPortal: 'https://unn.edu.ng/admissions/',
    type: 'federal',
    region: 'Southeast',
    difficulty: 'high',
    description: 'First indigenous Nigerian university.',
  },
  {
    name: 'Ahmadu Bello University',
    shortName: 'ABU',
    website: 'https://www.abu.edu.ng',
    admissionPortal: 'https://portal.abu.edu.ng',
    type: 'federal',
    region: 'North',
    difficulty: 'high',
    description: 'Largest university in Sub-Saharan Africa by student population.',
  },
  {
    name: 'University of Ilorin',
    shortName: 'UNILORIN',
    website: 'https://www.unilorin.edu.ng',
    admissionPortal: 'https://uilugportal.unilorin.edu.ng',
    type: 'federal',
    region: 'North',
    difficulty: 'high',
    description: 'Known for academic stability and zero tolerance for strikes.',
  },
  {
    name: 'University of Benin',
    shortName: 'UNIBEN',
    website: 'https://www.uniben.edu',
    admissionPortal: 'https://uniben.waeup.org',
    type: 'federal',
    region: 'South-South',
    difficulty: 'moderate',
    description: 'A major federal university in the South-South region.',
  },
  {
    name: 'University of Port Harcourt',
    shortName: 'UNIPORT',
    website: 'https://www.uniport.edu.ng',
    admissionPortal: 'https://utmedetails.uniport.edu.ng',
    type: 'federal',
    region: 'South-South',
    difficulty: 'moderate',
    description: 'A leading university in Rivers State.',
  },
  {
    name: 'Nnamdi Azikiwe University',
    shortName: 'UNIZIK',
    website: 'https://www.unizik.edu.ng',
    admissionPortal: 'https://apply.unizik.edu.ng',
    type: 'federal',
    region: 'Southeast',
    difficulty: 'moderate',
    description: 'Named after Nigeria\'s first president.',
  },
  {
    name: 'Federal University of Technology, Akure',
    shortName: 'FUTA',
    website: 'https://www.futa.edu.ng',
    admissionPortal: 'https://admissions.futa.edu.ng',
    type: 'federal',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Premier technology university in Nigeria.',
  },
  {
    name: 'Federal University of Technology, Owerri',
    shortName: 'FUTO',
    website: 'https://www.futo.edu.ng',
    admissionPortal: 'https://portal.futo.edu.ng',
    type: 'federal',
    region: 'Southeast',
    difficulty: 'moderate',
    description: 'Leading technology institution in the Southeast.',
  },
  {
    name: 'Federal University Oye-Ekiti',
    shortName: 'FUOYE',
    website: 'https://www.fuoye.edu.ng',
    admissionPortal: 'https://ecampus.fuoye.edu.ng',
    type: 'federal',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Growing federal university in Ekiti State.',
  },
];

const stateUniversities: University[] = [
  {
    name: 'Lagos State University',
    shortName: 'LASU',
    website: 'https://www.lasu.edu.ng',
    admissionPortal: 'https://admissions.lasu.edu.ng',
    type: 'state',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Premier state university in Lagos.',
  },
  {
    name: 'Olabisi Onabanjo University',
    shortName: 'OOU',
    website: 'https://www.oouagoiwoye.edu.ng',
    type: 'state',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Major state university in Ogun State.',
  },
  {
    name: 'Osun State University',
    shortName: 'UNIOSUN',
    website: 'https://www.uniosun.edu.ng',
    admissionPortal: 'https://admissions.uniosun.edu.ng',
    type: 'state',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Multi-campus university in Osun State.',
  },
  {
    name: 'Ekiti State University',
    shortName: 'EKSU',
    website: 'https://eksu.edu.ng',
    type: 'state',
    region: 'Southwest',
    difficulty: 'moderate',
    description: 'Premier state university in Ekiti State.',
  },
  {
    name: 'Delta State University',
    shortName: 'DELSU',
    website: 'https://www.delsu.edu.ng',
    admissionPortal: 'https://portal.delsu.edu.ng',
    type: 'state',
    region: 'South-South',
    difficulty: 'moderate',
    description: 'Leading state university in Delta State.',
  },
  {
    name: 'Rivers State University',
    shortName: 'RSU',
    website: 'https://www.rsu.edu.ng',
    admissionPortal: 'https://ecampus.rsu.edu.ng',
    type: 'state',
    region: 'South-South',
    difficulty: 'moderate',
    description: 'Prominent state university in Rivers State.',
  },
  {
    name: 'Kwara State University',
    shortName: 'KWASU',
    website: 'https://kwasu.edu.ng',
    type: 'state',
    region: 'North',
    difficulty: 'moderate',
    description: 'Growing state university in Kwara State.',
  },
];

const privateUniversities: University[] = [
  {
    name: 'Covenant University',
    shortName: 'Covenant',
    website: 'https://www.covenantuniversity.edu.ng',
    admissionPortal: 'https://admission.covenantuniversity.edu.ng',
    type: 'private',
    region: 'Southwest',
    difficulty: 'easy',
    description: 'Top-ranked private university in Nigeria and Africa.',
  },
  {
    name: 'Babcock University',
    shortName: 'Babcock',
    website: 'https://www.babcock.edu.ng',
    admissionPortal: 'https://application.babcock.edu.ng',
    type: 'private',
    region: 'Southwest',
    difficulty: 'easy',
    description: 'Premier Seventh-day Adventist institution.',
  },
  {
    name: 'Nile University, Abuja',
    shortName: 'Nile',
    website: 'https://nileuniversity.edu.ng',
    prospectus: 'https://nileuniversity.edu.ng/download-a-prospectus/',
    type: 'private',
    region: 'North',
    difficulty: 'easy',
    description: 'Modern private university in the FCT.',
  },
  {
    name: 'Afe Babalola University',
    shortName: 'ABUAD',
    website: 'https://www.abuad.edu.ng',
    type: 'private',
    region: 'Southwest',
    difficulty: 'easy',
    description: 'Comprehensive private university in Ekiti.',
  },
  {
    name: 'Madonna University',
    shortName: 'Madonna',
    website: 'https://www.madonnauniversity.edu.ng',
    type: 'private',
    region: 'Southeast',
    difficulty: 'easy',
    description: 'Catholic-founded private university.',
  },
  {
    name: 'Pan-Atlantic University',
    shortName: 'PAU',
    website: 'https://pau.edu.ng',
    type: 'private',
    region: 'Southwest',
    difficulty: 'easy',
    description: 'Business-focused private university in Lagos.',
  },
  {
    name: 'Bowen University',
    shortName: 'Bowen',
    website: 'https://bowen.edu.ng',
    type: 'private',
    region: 'Southwest',
    difficulty: 'easy',
    description: 'Baptist-owned private university in Osun.',
  },
  {
    name: 'University on the Niger',
    shortName: 'UNN-Private',
    website: 'https://uniniger.edu.ng',
    prospectus: 'https://uniniger.edu.ng/2025-prospectus/',
    type: 'private',
    region: 'Southeast',
    difficulty: 'easy',
    description: 'Growing private university in Anambra.',
  },
];

const allUniversities = [...federalUniversities, ...stateUniversities, ...privateUniversities];

const admissionRequirements = [
  {
    title: 'UTME Score',
    description: 'Minimum score: 140-200 (varies by institution)',
    icon: FileText,
  },
  {
    title: 'Post-UTME',
    description: 'Screening test or CBT examination',
    icon: BookOpen,
  },
  {
    title: "O'Level",
    description: "Minimum 5 credits (including English & Maths)",
    icon: Award,
  },
  {
    title: 'Direct Entry',
    description: 'ND / HND / A-Level / JUPEB / IJMB accepted',
    icon: GraduationCap,
  },
  {
    title: 'Age Requirement',
    description: 'Minimum 16 years old',
    icon: Users,
  },
];

const regions = ['All', 'Southwest', 'Southeast', 'South-South', 'North'];
const types = ['All', 'Federal', 'State', 'Private'];
const difficulties = ['All', 'High Competition', 'Moderate', 'Easy'];

export const UniversitiesPage: React.FC<UniversitiesPageProps> = ({ onOpenMenu }) => {
  const { theme } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [expandedSection, setExpandedSection] = useState<string | null>('guide');
  const [showFilters, setShowFilters] = useState(false);

  const filteredUniversities = allUniversities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || uni.region === selectedRegion;
    const matchesType = selectedType === 'All' || uni.type === selectedType.toLowerCase();
    const matchesDifficulty = selectedDifficulty === 'All' ||
      (selectedDifficulty === 'High Competition' && uni.difficulty === 'high') ||
      (selectedDifficulty === 'Moderate' && uni.difficulty === 'moderate') ||
      (selectedDifficulty === 'Easy' && uni.difficulty === 'easy');
    return matchesSearch && matchesRegion && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'easy':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'federal':
        return 'text-blue-400 bg-blue-500/20';
      case 'state':
        return 'text-purple-400 bg-purple-500/20';
      case 'private':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 ${
        theme === 'dark'
          ? 'bg-black/80 border-b border-white/10'
          : 'bg-white/80 border-b border-gray-200'
      } backdrop-blur-xl`}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onOpenMenu}
            className={`p-2 rounded-xl ${
              theme === 'dark'
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className={`font-display font-bold text-lg ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Universities Guide
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 pb-24 space-y-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10'
              : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`font-display font-bold text-xl ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                2026/2027 Admission Guide
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Complete Nigerian Universities Directory
              </p>
            </div>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            230+ accredited institutions - Federal, State & Private universities with official portals and admission requirements.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Federal', count: '63+', color: 'from-blue-500 to-blue-600' },
            { label: 'State', count: '65+', color: 'from-purple-500 to-purple-600' },
            { label: 'Private', count: '110+', color: 'from-orange-500 to-orange-600' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white border border-gray-200'
              } text-center`}
            >
              <p className={`font-display font-bold text-xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {stat.count}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Official Portals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-2xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-200'
          }`}
        >
          <button
            onClick={() => toggleSection('guide')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/20">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Official JAMB Resources
              </span>
            </div>
            {expandedSection === 'guide' ? (
              <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSection === 'guide' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  <a
                    href="https://ibass.jamb.gov.ng/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50'
                        : 'bg-green-50 border border-green-200 hover:border-green-300'
                    } transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-400" />
                      <div>
                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          JAMB IBASS Portal
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Official brochure & course search
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-green-400" />
                  </a>
                  
                  <a
                    href="https://jamb.gov.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10 hover:border-white/20'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                    } transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          JAMB Official Website
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          News, registration & results
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                  </a>
                  
                  <a
                    href="https://www.nuc.edu.ng/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border border-white/10 hover:border-white/20'
                        : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                    } transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          NUC Portal
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Verify university accreditation
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Admission Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-2xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-200'
          }`}
        >
          <button
            onClick={() => toggleSection('requirements')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                2026 Admission Requirements
              </span>
            </div>
            {expandedSection === 'requirements' ? (
              <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSection === 'requirements' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {admissionRequirements.map((req, index) => {
                    const Icon = req.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {req.title}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {req.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Admission Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-2xl ${
            theme === 'dark'
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-200'
          }`}
        >
          <button
            onClick={() => toggleSection('strategy')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/20">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Admission Strategy 2026
              </span>
            </div>
            {expandedSection === 'strategy' ? (
              <ChevronUp className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSection === 'strategy' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {[
                    'Download JAMB Brochure from IBASS',
                    'Confirm your course subject combination',
                    'Choose 2-3 backup universities',
                    'Monitor school portal weekly (May-October)',
                    'Apply immediately when Post-UTME opens',
                  ].map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Verification Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-2xl ${
            theme === 'dark'
              ? 'bg-red-500/10 border border-red-500/30'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                Verification Warning
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                Always verify universities using official domains (.edu.ng, .gov.ng). Avoid blog links, WhatsApp admission agents, and "guaranteed admission" sites.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl ${
              theme === 'dark'
                ? 'bg-white/5 border border-white/10'
                : 'bg-white border border-gray-200'
            }`}>
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl ${
                showFilters
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-white/5 border border-white/10 text-gray-400'
                  : 'bg-white border border-gray-200 text-gray-500'
              } transition-colors`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-white border border-gray-200'
                } space-y-3`}>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Region
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedRegion === region
                              ? 'bg-blue-500 text-white'
                              : theme === 'dark'
                              ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Type
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedType === type
                              ? 'bg-purple-500 text-white'
                              : theme === 'dark'
                              ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Competition Level
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedDifficulty === diff
                              ? 'bg-orange-500 text-white'
                              : theme === 'dark'
                              ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Showing {filteredUniversities.length} universities
        </p>

        {/* Universities List */}
        <div className="space-y-3">
          {filteredUniversities.map((uni, index) => (
            <motion.div
              key={uni.shortName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 hover:border-white/20'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              } transition-all`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: 'Clash Display, sans-serif' }}>
                      {uni.shortName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(uni.type)}`}>
                      {uni.type.charAt(0).toUpperCase() + uni.type.slice(1)}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {uni.name}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(uni.difficulty)}`}>
                  {uni.difficulty === 'high' ? 'Competitive' : uni.difficulty === 'moderate' ? 'Moderate' : 'Easy'}
                </span>
              </div>
              
              {uni.description && (
                <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {uni.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {uni.region}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  } transition-colors`}
                >
                  <Globe className="w-3 h-3" />
                  Website
                </a>
                {uni.admissionPortal && (
                  <a
                    href={uni.admissionPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      theme === 'dark'
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    } transition-colors`}
                  >
                    <GraduationCap className="w-3 h-3" />
                    Admissions
                  </a>
                )}
                {uni.prospectus && (
                  <a
                    href={uni.prospectus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                      theme === 'dark'
                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    } transition-colors`}
                  >
                    <FileText className="w-3 h-3" />
                    Prospectus
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No universities found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Footer Attribution */}
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-xs">
            Data verified via JAMB / NUC / Official University Domains
          </p>
        </div>
      </div>
    </div>
  );
};
