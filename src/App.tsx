import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import RatingPopup from './components/RatingPopup';
import { db } from './lib/db';

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
    setHasRated,
    setMaybeLater,
    incrementVisitCount,
  } = useStore();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [sessionStart] = useState(Date.now());

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Increment visit count on app load
  useEffect(() => {
    incrementVisitCount();
  }, [incrementVisitCount]);

  // Check if should show rating popup (1 minute spent or after maybe later + new visit or after first mock exam)
  useEffect(() => {
    if (!currentUser || hasRated) return;

    // If user clicked maybe later and this is a new visit, show popup
    if (maybeLaterClicked && maybeLaterTimestamp) {
      const lastVisit = new Date(maybeLaterTimestamp).toDateString();
      const today = new Date().toDateString();
      if (lastVisit !== today) {
        // New day, show popup after 5 seconds
        const timer = setTimeout(() => {
          setShowRatingPopup(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
      return; // Don't show popup again on same day if maybe later was clicked
    }

    // Show popup after first mock exam (immediately after increment)
    if (mockExamsTaken === 1) {
      const timer = setTimeout(() => {
        setShowRatingPopup(true);
      }, 2000); // Show 2 seconds after first mock exam
      return () => clearTimeout(timer);
    }

    // Show popup after 1 minute (60000ms) for first time users
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
    
    // Save to IndexedDB
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

  if (!currentUser) {
    return <AuthPage />;
  }

  if (currentPage === 'admin') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'ambient-bg text-white' : 'bg-[#F2F2F7] text-gray-900'}`}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
        <AdminPage onOpenMenu={openSidebar} />
      </div>
    );
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
      case 'about':
        return <AboutPage {...commonProps} />;
      default:
        return <HomePage onNavigate={navigateTo} onOpenMenu={openSidebar} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'ambient-bg text-white' : 'bg-[#F2F2F7] text-gray-900'}`}>
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
