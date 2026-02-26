// Firebase Configuration for StudentHub NG
// Single source of truth - ONLY initialize Firebase HERE

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as AuthUser
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  DataSnapshot
} from 'firebase/database';

// Firebase configuration - uses environment variables ONLY
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.databaseURL
  );
};

// Initialize Firebase ONCE - prevent duplicate initialization
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;

if (isFirebaseConfigured()) {
  try {
    // Check if already initialized
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    console.log('✅ Firebase initialized successfully (Realtime Database)');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
  }
} else {
  console.log('⚠️ Firebase not configured - running in offline mode with IndexedDB');
}

// Export Firebase instances
export { app, auth, database as db };

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface FirebaseUserData {
  id: string;
  name: string;
  email: string;
  level: string;
  createdAt: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  mockExamsTaken: number;
}

export interface FirebasePost {
  id: string;
  userId: string;
  userName: string;
  userLevel: string;
  content: string;
  likes: number;
  createdAt: number;
}

export interface FirebaseComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Convert Firebase snapshot to array with IDs
const snapshotToArray = <T>(snapshot: DataSnapshot): (T & { id: string })[] => {
  if (!snapshot.exists()) return [];
  
  const items: (T & { id: string })[] = [];
  snapshot.forEach((child) => {
    items.push({
      id: child.key!,
      ...child.val()
    });
  });
  return items;
};

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export const firebaseSignUp = async (
  email: string, 
  password: string, 
  name: string, 
  level: string
): Promise<FirebaseUserData> => {
  if (!auth || !database) throw new Error('Firebase not configured');
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userData: Omit<FirebaseUserData, 'id'> = {
    name,
    email,
    level,
    createdAt: Date.now(),
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    badges: [],
    mockExamsTaken: 0
  };
  
  // Create user in Realtime Database
  await set(ref(database, `users/${user.uid}`), userData);
  
  return { id: user.uid, ...userData };
};

export const firebaseSignIn = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not configured');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const firebaseSignOut = async () => {
  if (!auth) throw new Error('Firebase not configured');
  await signOut(auth);
};

export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// ============================================
// USER FUNCTIONS (Real-time)
// ============================================

export const getUserData = async (userId: string): Promise<FirebaseUserData | null> => {
  if (!database) return null;
  const snapshot = await get(ref(database, `users/${userId}`));
  return snapshot.exists() ? { id: userId, ...snapshot.val() } : null;
};

export const updateUserData = async (userId: string, data: Partial<FirebaseUserData>) => {
  if (!database) return;
  await update(ref(database, `users/${userId}`), data);
};

// Subscribe to all users (REAL-TIME for admin)
export const subscribeToUsers = (callback: (users: FirebaseUserData[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const usersRef = ref(db, 'users');
  
  onValue(usersRef, (snapshot) => {
    const users = snapshotToArray<FirebaseUserData>(snapshot);
    callback(users);
  });
  
  return () => off(usersRef);
};

// Get all users (one-time read)
export const getAllUsers = async (): Promise<FirebaseUserData[]> => {
  if (!database) return [];
  const snapshot = await get(ref(database, 'users'));
  return snapshotToArray<FirebaseUserData>(snapshot);
};

// ============================================
// FORUM POSTS (Real-time)
// ============================================

export const createPost = async (
  userId: string, 
  userName: string, 
  userLevel: string, 
  content: string
): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const postsRef = ref(database, 'posts');
  const newPostRef = push(postsRef);
  
  const postData = {
    userId,
    userName,
    userLevel,
    content,
    likes: 0,
    createdAt: Date.now()
  };
  
  await set(newPostRef, postData);
  return newPostRef.key!;
};

// Subscribe to posts (REAL-TIME - all users see each other's posts)
export const subscribeToPosts = (callback: (posts: FirebasePost[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const postsRef = ref(db, 'posts');
  
  onValue(postsRef, (snapshot) => {
    const posts = snapshotToArray<Omit<FirebasePost, 'id'>>(snapshot)
      .map(post => ({
        ...post,
        createdAt: post.createdAt || Date.now()
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first
    
    callback(posts as FirebasePost[]);
  });
  
  return () => off(postsRef);
};

// Get posts (one-time read)
export const getPosts = async (): Promise<FirebasePost[]> => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'posts'));
  const posts = snapshotToArray<Omit<FirebasePost, 'id'>>(snapshot)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  return posts as FirebasePost[];
};

export const deletePost = async (postId: string) => {
  if (!database) return;
  
  const db = database; // Store reference
  
  // Delete the post
  await remove(ref(db, `posts/${postId}`));
  
  // Delete associated comments
  const commentsSnapshot = await get(ref(db, 'comments'));
  if (commentsSnapshot.exists()) {
    const deletePromises: Promise<void>[] = [];
    commentsSnapshot.forEach((child) => {
      if (child.val().postId === postId) {
        deletePromises.push(remove(ref(db, `comments/${child.key}`)));
      }
    });
    await Promise.all(deletePromises);
  }
  
  // Delete associated likes
  const likesSnapshot = await get(ref(db, 'likes'));
  if (likesSnapshot.exists()) {
    const deletePromises: Promise<void>[] = [];
    likesSnapshot.forEach((child) => {
      if (child.key?.startsWith(`${postId}_`)) {
        deletePromises.push(remove(ref(db, `likes/${child.key}`)));
      }
    });
    await Promise.all(deletePromises);
  }
};

// Like/unlike a post
export const toggleLikePost = async (postId: string, userId: string): Promise<boolean> => {
  if (!database) return false;
  
  const db = database; // Store reference
  const likeKey = `${postId}_${userId}`;
  const likeRef = ref(db, `likes/${likeKey}`);
  const likeSnapshot = await get(likeRef);
  
  const postLikesRef = ref(db, `posts/${postId}/likes`);
  const postSnapshot = await get(postLikesRef);
  const currentLikes = postSnapshot.exists() ? postSnapshot.val() : 0;
  
  if (likeSnapshot.exists()) {
    // Unlike
    await remove(likeRef);
    await set(postLikesRef, Math.max(0, currentLikes - 1));
    return false;
  } else {
    // Like
    await set(likeRef, { postId, userId, createdAt: Date.now() });
    await set(postLikesRef, currentLikes + 1);
    return true;
  }
};

// Check if user liked a post
export const hasUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
  if (!database) return false;
  const likeRef = ref(database, `likes/${postId}_${userId}`);
  const snapshot = await get(likeRef);
  return snapshot.exists();
};

// Subscribe to user's likes
export const subscribeToUserLikes = (userId: string, callback: (likedPostIds: Set<string>) => void): (() => void) => {
  if (!database) {
    callback(new Set());
    return () => {};
  }
  
  const db = database; // Store reference
  const likesRef = ref(db, 'likes');
  
  onValue(likesRef, (snapshot) => {
    const likedPostIds = new Set<string>();
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.userId === userId) {
          likedPostIds.add(data.postId);
        }
      });
    }
    callback(likedPostIds);
  });
  
  return () => off(likesRef);
};

// ============================================
// COMMENTS (Real-time)
// ============================================

export const addComment = async (
  postId: string, 
  userId: string, 
  userName: string, 
  content: string
): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const commentsRef = ref(database, 'comments');
  const newCommentRef = push(commentsRef);
  
  await set(newCommentRef, {
    postId,
    userId,
    userName,
    content,
    createdAt: Date.now()
  });
  
  return newCommentRef.key!;
};

// Subscribe to comments for a post (REAL-TIME)
export const subscribeToComments = (postId: string, callback: (comments: FirebaseComment[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const commentsRef = ref(db, 'comments');
  
  onValue(commentsRef, (snapshot) => {
    const comments: FirebaseComment[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.postId === postId) {
          comments.push({
            id: child.key!,
            ...data
          });
        }
      });
    }
    comments.sort((a, b) => b.createdAt - a.createdAt);
    callback(comments);
  });
  
  return () => off(commentsRef);
};

export const getComments = async (postId: string): Promise<FirebaseComment[]> => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'comments'));
  const comments: FirebaseComment[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.postId === postId) {
        comments.push({ id: child.key!, ...data });
      }
    });
  }
  
  return comments.sort((a, b) => b.createdAt - a.createdAt);
};

// ============================================
// MOCK EXAM RESULTS
// ============================================

export const saveMockResult = async (userId: string, result: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const db = database; // Store reference
  const resultsRef = ref(db, 'mockResults');
  const newResultRef = push(resultsRef);
  
  await set(newResultRef, {
    userId,
    ...result,
    createdAt: Date.now()
  });
  
  // Update user stats
  const userRef = ref(db, `users/${userId}/mockExamsTaken`);
  const snapshot = await get(userRef);
  const currentCount = snapshot.exists() ? snapshot.val() : 0;
  await set(userRef, currentCount + 1);
  
  return newResultRef.key!;
};

export const getUserMockResults = async (userId: string) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'mockResults'));
  const results: any[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.userId === userId) {
        results.push({ id: child.key!, ...data });
      }
    });
  }
  
  return results.sort((a, b) => b.createdAt - a.createdAt);
};

// Subscribe to all mock results (for admin)
export const subscribeToMockResults = (callback: (results: any[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const resultsRef = ref(db, 'mockResults');
  
  onValue(resultsRef, (snapshot) => {
    const results = snapshotToArray<any>(snapshot);
    callback(results);
  });
  
  return () => off(resultsRef);
};

// ============================================
// FLASHCARDS
// ============================================

export const saveFlashcard = async (userId: string, flashcard: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const flashcardsRef = ref(database, 'flashcards');
  const newFlashcardRef = push(flashcardsRef);
  
  await set(newFlashcardRef, {
    userId,
    ...flashcard,
    createdAt: Date.now()
  });
  
  return newFlashcardRef.key!;
};

export const getUserFlashcards = async (userId: string) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'flashcards'));
  const flashcards: any[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.userId === userId) {
        flashcards.push({ id: child.key!, ...data });
      }
    });
  }
  
  return flashcards;
};

export const updateFlashcard = async (flashcardId: string, data: Record<string, unknown>) => {
  if (!database) return;
  await update(ref(database, `flashcards/${flashcardId}`), data);
};

export const deleteFlashcard = async (flashcardId: string) => {
  if (!database) return;
  await remove(ref(database, `flashcards/${flashcardId}`));
};

// ============================================
// FEEDBACK
// ============================================

export const saveFeedback = async (userId: string, rating: number, review: string): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const feedbackRef = ref(database, 'feedback');
  const newFeedbackRef = push(feedbackRef);
  
  await set(newFeedbackRef, {
    userId,
    rating,
    review,
    createdAt: Date.now()
  });
  
  return newFeedbackRef.key!;
};

export const getAllFeedback = async () => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'feedback'));
  return snapshotToArray<any>(snapshot).sort((a, b) => b.createdAt - a.createdAt);
};

// Subscribe to feedback (for admin)
export const subscribeToFeedback = (callback: (feedback: any[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const feedbackRef = ref(db, 'feedback');
  
  onValue(feedbackRef, (snapshot) => {
    const feedback = snapshotToArray<any>(snapshot).sort((a, b) => b.createdAt - a.createdAt);
    callback(feedback);
  });
  
  return () => off(feedbackRef);
};

// ============================================
// UPLOADED QUESTIONS (Admin)
// ============================================

export const uploadQuestion = async (question: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const questionsRef = ref(database, 'uploadedQuestions');
  const newQuestionRef = push(questionsRef);
  
  await set(newQuestionRef, {
    ...question,
    uploadedAt: Date.now(),
    isActive: true
  });
  
  return newQuestionRef.key!;
};

export const uploadQuestionsBulk = async (questions: Array<Record<string, unknown>>): Promise<string[]> => {
  const results = await Promise.all(questions.map(q => uploadQuestion(q)));
  return results;
};

export const getAllUploadedQuestions = async () => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'uploadedQuestions'));
  return snapshotToArray<any>(snapshot);
};

export const subscribeToUploadedQuestions = (callback: (questions: any[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database; // Store reference
  const questionsRef = ref(db, 'uploadedQuestions');
  
  onValue(questionsRef, (snapshot) => {
    const questions = snapshotToArray<any>(snapshot);
    callback(questions);
  });
  
  return () => off(questionsRef);
};

export const updateUploadedQuestion = async (questionId: string, data: Record<string, unknown>) => {
  if (!database) return;
  await update(ref(database, `uploadedQuestions/${questionId}`), data);
};

export const deleteUploadedQuestion = async (questionId: string) => {
  if (!database) return;
  await remove(ref(database, `uploadedQuestions/${questionId}`));
};

// ============================================
// USER PRESENCE (Real-time online status)
// ============================================

export const setUserOnline = async (userId: string) => {
  if (!database) return;
  await set(ref(database, `presence/${userId}`), {
    online: true,
    lastSeen: Date.now()
  });
};

export const setUserOffline = async (userId: string) => {
  if (!database) return;
  await update(ref(database, `presence/${userId}`), {
    online: false,
    lastSeen: Date.now()
  });
};

export const subscribeToOnlineUsers = (callback: (count: number) => void): (() => void) => {
  if (!database) {
    callback(0);
    return () => {};
  }
  
  const db = database; // Store reference
  const presenceRef = ref(db, 'presence');
  
  onValue(presenceRef, (snapshot) => {
    let count = 0;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.online && data.lastSeen > fiveMinutesAgo) {
          count++;
        }
      });
    }
    
    callback(count);
  });
  
  return () => off(presenceRef);
};

// ============================================
// ANALYTICS
// ============================================

export const updateAnalytics = async (field: string, value: number) => {
  if (!database) return;
  
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = ref(database, `analytics/${today}/${field}`);
  const snapshot = await get(analyticsRef);
  const currentValue = snapshot.exists() ? snapshot.val() : 0;
  await set(analyticsRef, currentValue + value);
};

export const getAnalytics = async (days: number = 7) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'analytics'));
  if (!snapshot.exists()) return [];
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const analytics: any[] = [];
  snapshot.forEach((child) => {
    const dateStr = child.key!;
    if (new Date(dateStr) >= startDate) {
      analytics.push({
        id: dateStr,
        date: dateStr,
        ...child.val()
      });
    }
  });
  
  return analytics;
};
