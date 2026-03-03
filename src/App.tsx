import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import RatingPopup from './components/RatingPopup';
import { db } from './lib/db';
import { onAuthChange, isFirebaseConfigured, getUserData } from './lib/firebase';

// Pages
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { MockExamPage } from './pages/MockExamPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { AITutorPage } from './pages/AITutorPage';
import { ToolsPage } from './pages/ToolsPage';
import { ForumPage } from './pages/ForumPage';
import { ProfilePage } from './pages/ProfilePage';
import { NovelPage } from './pages/NovelPage';
import { AdminPage } from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import { UniversitiesPage } from './pages/UniversitiesPage';

type Page = 'home' | 'practice' | 'mock-exam' | 'flashcards' | 'ai-tutor' | 'tools' | 'universities' | 'forum' | 'profile' | 'novel' | 'admin' | 'about';

function App() {
  const { 
    currentUser, 
    theme, 
    hasRated,
    maybeLaterClicked,
    maybeLaterTimestamp,
    mockExamsTaken,
    authReady,
    setHasRated,
    setMaybeLater,
    incrementVisitCount,
    setAuthReady,
    setUser,
  } = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [sessionStart] = useState(Date.now());

  // Apply theme to document - THIS IS CRITICAL
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      body.style.backgroundColor = '#F2F2F7';
      body.style.color = '#1F2937';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
      body.style.backgroundColor = '#000000';
      body.style.color = '#FFFFFF';
    }
  }, [theme]);

  // Increment visit count on app load
  useEffect(() => {
    incrementVisitCount();
  }, [incrementVisitCount]);

  // Listen for Firebase auth state changes and set authReady
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // No Firebase - use localStorage state (already hydrated by Zustand)
      setAuthReady(true);
      console.log('✅ Auth ready (no Firebase, using localStorage)');
      return;
    }

    // Firebase is configured - listen for auth state
    console.log('🔄 Listening for Firebase auth state...');
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('🔑 Firebase auth state changed:', firebaseUser?.uid || 'null');
      
      if (firebaseUser) {
        // User is signed in via Firebase - fetch their data
        try {
          const userData = await getUserData(firebaseUser.uid);
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              fullName: userData.name,
              academicLevel: userData.level,
              questionsAnswered: userData.questionsAnswered,
              correctAnswers: userData.correctAnswers,
              streak: userData.streak,
              badges: userData.badges,
              mockExamsTaken: userData.mockExamsTaken,
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
      // Don't logout here - let localStorage state persist if Firebase user is null
      // This handles the case where user logged in via localStorage before Firebase was configured
      
      setAuthReady(true);
      console.log('✅ Auth ready (Firebase resolved)');
    });

    return () => unsubscribe();
  }, [setAuthReady, setUser]);

  // Check if should show rating popup
  useEffect(() => {
    if (!currentUser || hasRated) return;

    // If user clicked maybe later and this is a new visit, show popup
    if (maybeLaterClicked && maybeLaterTimestamp) {
      const lastVisit = new Date(maybeLaterTimestamp).toDateString();
      const today = new Date().toDateString();
      if (lastVisit !== today) {
        const timer = setTimeout(() => {
          setShowRatingPopup(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Show popup after first mock exam
    if (mockExamsTaken === 1) {
      const timer = setTimeout(() => {
        setShowRatingPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Show popup after 1 minute for first time users
    if (!maybeLaterClicked && mockExamsTaken === 0) {
      const timer = setTimeout(() => {
        setShowRatingPopup(true);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, hasRated, maybeLaterClicked, maybeLaterTimestamp, mockExamsTaken, sessionStart]);

  // Check for admin route
  useEffect(() => {
    if (window.location.hash === '#/admin-dashboard') {
      setCurrentPage('admin');
    }
  }, []);

  const handleRatingSubmit = useCallback(async (ratingValue: number, review: string) => {
    setHasRated(true);
    setShowRatingPopup(false);
    
    try {
      await db.feedback.add({
        id: Date.now(),
        rating: ratingValue,
        review,
        timestamp: new Date().toISOString(),
        userId: typeof currentUser?.id === 'string' ? parseInt(currentUser.id) || 0 : (currentUser?.id || 0)
      });
    } catch (error) {
      console.error('Failed to save rating:', error);
    }
  }, [currentUser, setHasRated]);

  const handleMaybeLater = useCallback(() => {
    setMaybeLater(true);
    setShowRatingPopup(false);
  }, [setMaybeLater]);

  const navigateTo = (page: string) => {
    setCurrentPage(page as Page);
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  // Show loading while auth state is being resolved
  if (!authReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  const renderPage = () => {
    const commonProps = { onOpenMenu: openSidebar };
    
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onOpenMenu={openSidebar} />;
      case 'practice':
        return <PracticePage {...commonProps} />;
      case 'mock-exam':
        return <MockExamPage {...commonProps} />;
      case 'flashcards':
        return <FlashcardsPage {...commonProps} />;
      case 'ai-tutor':
        return <AITutorPage {...commonProps} />;
      case 'tools':
        return <ToolsPage {...commonProps} />;
      case 'universities':
        return <UniversitiesPage {...commonProps} />;
      case 'forum':
        return <ForumPage {...commonProps} />;
      case 'profile':
        return <ProfilePage {...commonProps} />;
      case 'novel':
        return <NovelPage {...commonProps} />;
      case 'admin':
        return <AdminPage {...commonProps} />;
      case 'about':
        return <AboutPage {...commonProps} />;
      default:
        return <HomePage onNavigate={navigateTo} onOpenMenu={openSidebar} />;
    }
  };

  // Dynamic classes based on theme
  const bgClass = theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F7]';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Rating Popup */}
      <RatingPopup
        isOpen={showRatingPopup}
        onClose={() => setShowRatingPopup(false)}
        onSubmit={handleRatingSubmit}
        onMaybeLater={handleMaybeLater}
      />

      {/* Main Content */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
