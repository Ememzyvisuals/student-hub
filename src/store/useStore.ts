import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  fullName: string;
  academicLevel: string;
  createdAt?: Date;
  questionsAnswered?: number;
  correctAnswers?: number;
  totalQuestionsAnswered?: number;
  totalCorrect?: number;
  streak?: number;
  badges?: string[];
  mockExamsTaken?: number;
  isAdmin?: boolean;
}

interface RatingState {
  hasRated: boolean;
  maybeLater: boolean;
  lastPrompt: number | null;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Theme
  theme: 'dark' | 'light';
  
  // Rating
  rating: RatingState;
  hasRated: boolean;
  maybeLaterClicked: boolean;
  maybeLaterTimestamp: number | null;
  sessionStartTime: number;
  visitCount: number;
  mockExamsTaken: number;
  
  // API Keys
  openRouterApiKey: string;
  
  // Firebase mode
  useFirebase: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  updateUserStats: (questionsAnswered: number, correctAnswers: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setHasRated: (value: boolean) => void;
  setMaybeLater: (value: boolean) => void;
  setMaybeLaterClicked: (value: boolean) => void;
  incrementVisitCount: () => void;
  incrementMockExams: () => void;
  resetSessionStart: () => void;
  setOpenRouterApiKey: (key: string) => void;
  setUseFirebase: (value: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      theme: 'dark',
      rating: {
        hasRated: false,
        maybeLater: false,
        lastPrompt: null,
      },
      hasRated: false,
      maybeLaterClicked: false,
      maybeLaterTimestamp: null,
      sessionStartTime: Date.now(),
      visitCount: 0,
      mockExamsTaken: 0,
      openRouterApiKey: '',
      useFirebase: true,
      
      // Actions
      setUser: (user) => set({ 
        currentUser: user ? {
          ...user,
          totalQuestionsAnswered: user.questionsAnswered || 0,
          totalCorrect: user.correctAnswers || 0,
        } : null, 
        isAuthenticated: !!user 
      }),
      
      setCurrentUser: (user) => set({ 
        currentUser: user ? {
          ...user,
          totalQuestionsAnswered: user.questionsAnswered || 0,
          totalCorrect: user.correctAnswers || 0,
        } : null, 
        isAuthenticated: !!user 
      }),
      
      login: (user) => set({ 
        currentUser: {
          ...user,
          totalQuestionsAnswered: user.questionsAnswered || 0,
          totalCorrect: user.correctAnswers || 0,
        }, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        currentUser: null, 
        isAuthenticated: false 
      }),
      
      updateUserStats: (questionsAnswered, correctAnswers) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          const newQuestionsAnswered = (currentUser.questionsAnswered || 0) + questionsAnswered;
          const newCorrectAnswers = (currentUser.correctAnswers || 0) + correctAnswers;
          set({
            currentUser: {
              ...currentUser,
              questionsAnswered: newQuestionsAnswered,
              correctAnswers: newCorrectAnswers,
              totalQuestionsAnswered: newQuestionsAnswered,
              totalCorrect: newCorrectAnswers,
            }
          });
        }
      },
      
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
      
      setHasRated: (value) => set({ 
        hasRated: value,
        rating: { ...get().rating, hasRated: value }
      }),
      
      setMaybeLater: (value) => set({ 
        maybeLaterClicked: value,
        maybeLaterTimestamp: value ? Date.now() : null,
        rating: { ...get().rating, maybeLater: value, lastPrompt: Date.now() }
      }),
      
      setMaybeLaterClicked: (value) => set({ 
        maybeLaterClicked: value,
        maybeLaterTimestamp: value ? Date.now() : null
      }),
      
      incrementVisitCount: () => set((state) => ({ 
        visitCount: state.visitCount + 1,
        sessionStartTime: Date.now()
      })),
      
      incrementMockExams: () => set((state) => ({ 
        mockExamsTaken: state.mockExamsTaken + 1
      })),
      
      resetSessionStart: () => set({ sessionStartTime: Date.now() }),
      
      setOpenRouterApiKey: (key) => set({ openRouterApiKey: key }),
      
      setUseFirebase: (value) => set({ useFirebase: value }),
    }),
    {
      name: 'studenthub-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        hasRated: state.hasRated,
        rating: state.rating,
        maybeLaterClicked: state.maybeLaterClicked,
        maybeLaterTimestamp: state.maybeLaterTimestamp,
        visitCount: state.visitCount,
        mockExamsTaken: state.mockExamsTaken,
        openRouterApiKey: state.openRouterApiKey,
        useFirebase: state.useFirebase,
      }),
    }
  )
);

export default useStore;
