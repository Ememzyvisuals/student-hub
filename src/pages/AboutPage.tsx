import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Globe, 
  Bot, 
  Building2, 
  GraduationCap,
  Users,
  Target,
  Heart,
  MessageCircle,
  ExternalLink,
  Star,
  Zap,
  Shield,
  Wifi,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface AboutPageProps {
  onOpenMenu: () => void;
}

export default function AboutPage({ onOpenMenu }: AboutPageProps) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications built with cutting-edge technologies.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building2,
      title: 'Business Management Systems',
      description: 'Custom software solutions to streamline your business operations and boost productivity.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bot,
      title: 'AI-Powered Bots',
      description: 'Intelligent chatbots and automation tools for customer service, education, and more.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Applications',
      description: 'Cross-platform mobile apps that deliver exceptional user experiences.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const appFeatures = [
    { icon: Wifi, text: 'Works 100% Offline' },
    { icon: Shield, text: 'No Ads, No Fees' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Award, text: 'JAMB Ready' }
  ];

  const stats = [
    { value: '10K+', label: 'Questions' },
    { value: '50+', label: 'Topics' },
    { value: '4', label: 'Levels' },
    { value: '100%', label: 'Free' }
  ];

  const openWhatsApp = () => {
    window.open('https://wa.me/2349047115612?text=Hello%20EMEMZYVISUALS!%20I%20found%20you%20through%20StudentHub%20NG.', '_blank');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between px-4 h-14">
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
          <h1 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>About</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="pb-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative px-6 py-16 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display font-black text-4xl text-white mb-3"
            >
              STUDENTHUB NG
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg font-medium mb-8"
            >
              The Best Free Study Platform in Nigeria
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-4 gap-3"
            >
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* App Features */}
        <section className="px-4 py-8">
          <div className="grid grid-cols-2 gap-3">
            {appFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-2xl p-4 border flex items-center gap-3`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`${isDark ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-white/10' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} rounded-3xl p-6 border`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h2 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Mission</h2>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
              StudentHub NG was created to democratize education in Nigeria. We believe every student deserves access to quality learning resources, regardless of their financial situation. Our platform provides comprehensive study materials, practice questions, and AI-powered tutoring - completely free of charge.
            </p>
          </motion.div>
        </section>

        {/* Target Audience */}
        <section className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-3xl p-6 border`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h2 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Who We Serve</h2>
            </div>
            <div className="space-y-3">
              {['JSS Students (Junior Secondary School)', 'SSS Students (Senior Secondary School)', 'JAMB Candidates', 'University Students'].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2} />
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Developer Section */}
        <section className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00ek00MCA0MGg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative p-6">
              {/* Developer Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs">
                  DEVELOPER
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>

              {/* Developer Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                  <Code className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-white">EMEMZYVISUALS</h2>
                  <p className="text-blue-400 font-semibold">DIGITALS</p>
                  <p className="text-gray-400 text-sm mt-1">Full-Stack Developer & Digital Solutions Expert</p>
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                <p className="text-gray-300 italic text-center">
                  "Transforming ideas into powerful digital solutions that drive success."
                </p>
              </div>

              {/* Services */}
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Services Offered
              </h3>
              <div className="space-y-3 mb-6">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                        <service.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{service.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact CTA */}
              <motion.button
                onClick={openWhatsApp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/30"
              >
                <MessageCircle className="w-6 h-6" strokeWidth={2} />
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-center text-gray-400 text-sm mt-4">
                +234 904 711 5612
              </p>
            </div>
          </motion.div>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} rounded-3xl p-6 border`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h2 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Work With Us?</h2>
            </div>
            <div className="space-y-3">
              {[
                'Premium Quality at Affordable Prices',
                'Fast Delivery & Timely Communication',
                'Modern Technologies & Best Practices',
                '24/7 Support & Maintenance',
                'Customized Solutions for Your Needs'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-center"
          >
            <h2 className="font-display font-bold text-2xl text-white mb-3">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-white/80 mb-6">
              Let's bring your digital vision to life. Contact EMEMZYVISUALS DIGITALS today!
            </p>
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={openWhatsApp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" strokeWidth={2} />
                <span>Start a Conversation</span>
              </motion.button>
              <a
                href="https://wa.me/2349047115612"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">wa.me/2349047115612</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <div className="px-4 py-8 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            StudentHub NG v1.0.0
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-300'} mt-1`}>
            Made with love in Nigeria
          </p>
        </div>
      </div>
    </div>
  );
}
