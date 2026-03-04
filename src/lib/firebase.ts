// Firebase Configuration for StudentHub NG
// Single source of truth - ONLY initialize Firebase HERE
// COMPLIANT WITH FIREBASE SECURITY RULES

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
  id: string; // The post ID from Firebase
  authorId: string; // REQUIRED: auth.currentUser.uid
  userId?: string; // Alias for authorId (backward compatibility)
  authorName: string;
  userName?: string; // Alias for authorName (backward compatibility)
  authorLevel: string;
  userLevel?: string; // Alias for authorLevel (backward compatibility)
  content: string; // REQUIRED: non-empty
  likes: number;
  createdAt: number; // REQUIRED: Date.now()
}

export interface FirebaseComment {
  id: string;
  postId: string; // REQUIRED: parent post ID
  authorId: string; // REQUIRED: auth.currentUser.uid
  userId?: string; // Alias for authorId (backward compatibility)
  authorName: string;
  userName?: string; // Alias for authorName (backward compatibility)
  content: string; // REQUIRED: non-empty
  createdAt: number; // REQUIRED: Date.now()
}

export interface FirebaseLike {
  value: true; // REQUIRED: must be exactly true
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current authenticated user ID - REQUIRED before any write
const getCurrentUserId = (): string | null => {
  if (!auth || !auth.currentUser) {
    console.error('❌ Firebase Auth: No authenticated user');
    return null;
  }
  return auth.currentUser.uid;
};

// Validate required fields for post
const validatePostData = (content: string): boolean => {
  if (!content || content.trim().length === 0) {
    console.error('❌ Validation Error: Post content cannot be empty');
    return false;
  }
  return true;
};

// Validate required fields for comment
const validateCommentData = (postId: string, content: string): boolean => {
  if (!postId) {
    console.error('❌ Validation Error: Comment must have postId');
    return false;
  }
  if (!content || content.trim().length === 0) {
    console.error('❌ Validation Error: Comment content cannot be empty');
    return false;
  }
  return true;
};

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
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      console.error('❌ Firebase Auth Error:', error.code, error.message);
      throw error;
    });
  
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
  
  // Create user in Realtime Database at /users/{uid}
  // Security Rule: uid === auth.currentUser.uid
  await set(ref(database, `users/${user.uid}`), userData)
    .catch((error) => {
      console.error('❌ Firebase Database Error:', error.code, error.message);
      throw error;
    });
  
  console.log('✅ User created:', user.uid);
  return { id: user.uid, ...userData };
};

export const firebaseSignIn = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not configured');
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
      console.error('❌ Firebase Auth Error:', error.code, error.message);
      throw error;
    });
  
  console.log('✅ User signed in:', userCredential.user.uid);
  return userCredential.user;
};

export const firebaseSignOut = async () => {
  if (!auth) throw new Error('Firebase not configured');
  await signOut(auth);
  console.log('✅ User signed out');
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
// Path: /users/{uid}
// ============================================

// Save user data to database (idempotent - safe to call multiple times)
export const saveUserToDatabase = async (
  userId: string, 
  userData: Omit<FirebaseUserData, 'id'>
): Promise<FirebaseUserData> => {
  if (!database) throw new Error('Firebase not configured');
  
  await set(ref(database, `users/${userId}`), userData)
    .catch((error) => {
      console.error('❌ Firebase Database Error:', error.message);
      throw error;
    });
  
  console.log('✅ User saved to database:', userId);
  return { id: userId, ...userData };
};

export const getUserData = async (userId: string): Promise<FirebaseUserData | null> => {
  if (!database) return null;
  
  const snapshot = await get(ref(database, `users/${userId}`))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot || !snapshot.exists()) return null;
  return { id: userId, ...snapshot.val() };
};

export const updateUserData = async (userId: string, data: Partial<FirebaseUserData>) => {
  if (!database) return;
  
  const currentUid = getCurrentUserId();
  if (currentUid !== userId) {
    console.error('❌ Security Error: Cannot update another user\'s data');
    return;
  }
  
  await update(ref(database, `users/${userId}`), data)
    .catch((error) => {
      console.error('❌ Firebase Update Error:', error.code, error.message);
    });
};

// Subscribe to all users (REAL-TIME for admin)
export const subscribeToUsers = (callback: (users: FirebaseUserData[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database;
  const usersRef = ref(db, 'users');
  
  onValue(usersRef, (snapshot) => {
    const users = snapshotToArray<FirebaseUserData>(snapshot);
    console.log('📥 Received users from Firebase:', users.length);
    callback(users);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', (error as any).code, error.message);
    callback([]);
  });
  
  return () => {
    off(usersRef);
    console.log('🔌 Unsubscribed from users');
  };
};

// Get all users (one-time read)
export const getAllUsers = async (): Promise<FirebaseUserData[]> => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'users'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  return snapshotToArray<FirebaseUserData>(snapshot);
};

// ============================================
// FORUM POSTS (Real-time)
// Path: /posts/{postId}
// Required fields: authorId, content, createdAt
// ============================================

export const createPost = async (
  userIdOrName: string, 
  userNameOrLevel: string, 
  userLevelOrContent: string,
  contentOptional?: string
): Promise<string> => {
  // Support both old signature (userId, userName, userLevel, content) 
  // and new signature (authorName, authorLevel, content)
  let authorName: string;
  let authorLevel: string;
  let content: string;
  
  if (contentOptional !== undefined) {
    // Old signature: createPost(userId, userName, userLevel, content)
    authorName = userNameOrLevel;
    authorLevel = userLevelOrContent;
    content = contentOptional;
  } else {
    // New signature: createPost(authorName, authorLevel, content)
    authorName = userIdOrName;
    authorLevel = userNameOrLevel;
    content = userLevelOrContent;
  }
  if (!database) throw new Error('Firebase not configured');
  
  // SECURITY CHECK: Must have authenticated user
  const authorId = getCurrentUserId();
  if (!authorId) {
    throw new Error('User must be authenticated to create a post');
  }
  
  // VALIDATION CHECK: Content must not be empty
  if (!validatePostData(content)) {
    throw new Error('Post content cannot be empty');
  }
  
  const postsRef = ref(database, 'posts');
  const newPostRef = push(postsRef);
  
  // COMPLIANT POST DATA - all required fields included
  const postData = {
    authorId,          // REQUIRED: auth.currentUser.uid
    authorName,
    authorLevel,
    content: content.trim(), // REQUIRED: non-empty string
    likes: 0,
    createdAt: Date.now()    // REQUIRED: timestamp in milliseconds
  };
  
  await set(newPostRef, postData)
    .catch((error) => {
      console.error('❌ Firebase Write Error:', error.code, error.message);
      throw error;
    });
  
  console.log('✅ Post created:', newPostRef.key);
  return newPostRef.key!;
};

// Legacy function for backward compatibility
export const createPostLegacy = async (
  userId: string, 
  userName: string, 
  userLevel: string, 
  content: string
): Promise<string> => {
  return createPost(userName, userLevel, content);
};

// Subscribe to posts (REAL-TIME - all users see each other's posts)
export const subscribeToPosts = (callback: (posts: FirebasePost[]) => void): (() => void) => {
  if (!database) {
    console.log('⚠️ Firebase not configured, returning empty posts');
    callback([]);
    return () => {};
  }
  
  const db = database;
  const postsRef = ref(db, 'posts');
  
  console.log('🔄 Subscribing to posts...');
  
  onValue(postsRef, (snapshot) => {
    const posts = snapshotToArray<Omit<FirebasePost, 'id'>>(snapshot)
      .map(post => ({
        ...post,
        // Map old field names to new ones for compatibility
        userId: (post as any).authorId || (post as any).userId,
        userName: (post as any).authorName || (post as any).userName,
        userLevel: (post as any).authorLevel || (post as any).userLevel,
        createdAt: post.createdAt || Date.now()
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
    
    console.log('📥 Received posts from Firebase:', posts.length);
    callback(posts as FirebasePost[]);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback([]);
  });
  
  return () => {
    off(postsRef);
    console.log('🔌 Unsubscribed from posts');
  };
};

// Get posts (one-time read)
export const getPosts = async (): Promise<FirebasePost[]> => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'posts'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  
  const posts = snapshotToArray<Omit<FirebasePost, 'id'>>(snapshot)
    .map(post => ({
      ...post,
      userId: (post as any).authorId || (post as any).userId,
      userName: (post as any).authorName || (post as any).userName,
      userLevel: (post as any).authorLevel || (post as any).userLevel,
      createdAt: post.createdAt || Date.now()
    }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  return posts as FirebasePost[];
};

export const deletePost = async (postId: string) => {
  if (!database) return;
  
  const authorId = getCurrentUserId();
  if (!authorId) {
    console.error('❌ Security Error: Must be authenticated to delete post');
    return;
  }
  
  const db = database;
  
  // Delete the post
  await remove(ref(db, `posts/${postId}`))
    .catch((error) => {
      console.error('❌ Firebase Delete Error:', error.code, error.message);
    });
  
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
  
  // Delete associated likes at /likes/{postId}
  await remove(ref(db, `likes/${postId}`))
    .catch((error) => {
      console.error('❌ Firebase Delete Likes Error:', error.code, error.message);
    });
  
  console.log('✅ Post deleted:', postId);
};

// ============================================
// LIKES
// Path: /likes/{postId}/{uid} = true
// Security Rule: uid === auth.currentUser.uid
// ============================================

export const toggleLikePost = async (postId: string, _userId?: string): Promise<boolean> => {
  // _userId parameter kept for backward compatibility but not used
  // We always use the authenticated user's ID for security
  if (!database) return false;
  
  // SECURITY CHECK: Must have authenticated user
  const uid = getCurrentUserId();
  if (!uid) {
    console.error('❌ Security Error: Must be authenticated to like a post');
    return false;
  }
  
  const db = database;
  
  // COMPLIANT PATH: /likes/{postId}/{uid}
  const likeRef = ref(db, `likes/${postId}/${uid}`);
  const likeSnapshot = await get(likeRef)
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!likeSnapshot) return false;
  
  // Get current likes count
  const postLikesRef = ref(db, `posts/${postId}/likes`);
  const postSnapshot = await get(postLikesRef);
  const currentLikes = postSnapshot.exists() ? postSnapshot.val() : 0;
  
  if (likeSnapshot.exists()) {
    // Unlike - remove the like
    await remove(likeRef)
      .catch((error) => {
        console.error('❌ Firebase Delete Error:', error.code, error.message);
      });
    await set(postLikesRef, Math.max(0, currentLikes - 1));
    console.log('✅ Post unliked:', postId);
    return false;
  } else {
    // Like - set value to true
    // COMPLIANT: /likes/{postId}/{uid} = true
    await set(likeRef, true)
      .catch((error) => {
        console.error('❌ Firebase Write Error:', error.code, error.message);
      });
    await set(postLikesRef, currentLikes + 1);
    console.log('✅ Post liked:', postId);
    return true;
  }
};

// Legacy function for backward compatibility
export const toggleLikePostLegacy = async (postId: string, userId: string): Promise<boolean> => {
  return toggleLikePost(postId);
};

// Check if user liked a post
export const hasUserLikedPost = async (postId: string): Promise<boolean> => {
  if (!database) return false;
  
  const uid = getCurrentUserId();
  if (!uid) return false;
  
  const likeRef = ref(database, `likes/${postId}/${uid}`);
  const snapshot = await get(likeRef)
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  return snapshot ? snapshot.exists() : false;
};

// Subscribe to user's likes (REAL-TIME)
export const subscribeToUserLikes = (_userId: string | ((likedPostIds: Set<string>) => void), callbackOrUndefined?: (likedPostIds: Set<string>) => void): (() => void) => {
  // Support both old signature (userId, callback) and new signature (callback)
  let callback: (likedPostIds: Set<string>) => void;
  
  if (typeof _userId === 'function') {
    callback = _userId;
  } else {
    callback = callbackOrUndefined!;
  }
  if (!database) {
    callback(new Set());
    return () => {};
  }
  
  const uid = getCurrentUserId();
  if (!uid) {
    callback(new Set());
    return () => {};
  }
  
  const db = database;
  const likesRef = ref(db, 'likes');
  
  onValue(likesRef, (snapshot) => {
    const likedPostIds = new Set<string>();
    if (snapshot.exists()) {
      snapshot.forEach((postChild) => {
        const postId = postChild.key!;
        // Check if this user liked this post
        if (postChild.hasChild(uid)) {
          likedPostIds.add(postId);
        }
      });
    }
    callback(likedPostIds);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback(new Set());
  });
  
  return () => {
    off(likesRef);
    console.log('🔌 Unsubscribed from likes');
  };
};

// ============================================
// COMMENTS (Real-time)
// Path: /comments/{commentId}
// Required fields: authorId, postId, content, createdAt
// ============================================

export const addComment = async (
  postId: string, 
  userIdOrName: string, 
  userNameOrContent: string,
  contentOptional?: string
): Promise<string> => {
  // Support both old signature (postId, userId, userName, content) 
  // and new signature (postId, authorName, content)
  let authorName: string;
  let content: string;
  
  if (contentOptional !== undefined) {
    // Old signature: addComment(postId, userId, userName, content)
    authorName = userNameOrContent;
    content = contentOptional;
  } else {
    // New signature: addComment(postId, authorName, content)
    authorName = userIdOrName;
    content = userNameOrContent;
  }
  if (!database) throw new Error('Firebase not configured');
  
  // SECURITY CHECK: Must have authenticated user
  const authorId = getCurrentUserId();
  if (!authorId) {
    throw new Error('User must be authenticated to add a comment');
  }
  
  // VALIDATION CHECK
  if (!validateCommentData(postId, content)) {
    throw new Error('Invalid comment data');
  }
  
  const commentsRef = ref(database, 'comments');
  const newCommentRef = push(commentsRef);
  
  // COMPLIANT COMMENT DATA - all required fields included
  const commentData = {
    authorId,               // REQUIRED: auth.currentUser.uid
    postId,                 // REQUIRED: parent post ID
    authorName,
    content: content.trim(), // REQUIRED: non-empty string
    createdAt: Date.now()    // REQUIRED: timestamp in milliseconds
  };
  
  await set(newCommentRef, commentData)
    .catch((error) => {
      console.error('❌ Firebase Write Error:', error.code, error.message);
      throw error;
    });
  
  console.log('✅ Comment created:', newCommentRef.key);
  return newCommentRef.key!;
};

// Legacy function for backward compatibility
export const addCommentLegacy = async (
  postId: string, 
  userId: string, 
  userName: string, 
  content: string
): Promise<string> => {
  return addComment(postId, userName, content);
};

// Subscribe to comments for a post (REAL-TIME)
export const subscribeToComments = (postId: string, callback: (comments: FirebaseComment[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database;
  const commentsRef = ref(db, 'comments');
  
  onValue(commentsRef, (snapshot) => {
    const comments: FirebaseComment[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.postId === postId) {
          comments.push({
            id: child.key!,
            ...data,
            // Map old field names for compatibility
            userId: data.authorId || data.userId,
            userName: data.authorName || data.userName
          });
        }
      });
    }
    comments.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    console.log('📥 Received comments for post', postId, ':', comments.length);
    callback(comments);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback([]);
  });
  
  return () => {
    off(commentsRef);
    console.log('🔌 Unsubscribed from comments');
  };
};

export const getComments = async (postId: string): Promise<FirebaseComment[]> => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'comments'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  
  const comments: FirebaseComment[] = [];
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.postId === postId) {
        comments.push({
          id: child.key!,
          ...data,
          userId: data.authorId || data.userId,
          userName: data.authorName || data.userName
        });
      }
    });
  }
  
  return comments.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
};

// ============================================
// MOCK EXAM RESULTS
// Path: /mockResults/{resultId}
// ============================================

export const saveMockResult = async (result: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User must be authenticated to save mock result');
  }
  
  const db = database;
  const resultsRef = ref(db, 'mockResults');
  const newResultRef = push(resultsRef);
  
  await set(newResultRef, {
    userId,
    ...result,
    createdAt: Date.now()
  }).catch((error) => {
    console.error('❌ Firebase Write Error:', error.code, error.message);
    throw error;
  });
  
  // Update user stats
  const userRef = ref(db, `users/${userId}/mockExamsTaken`);
  const snapshot = await get(userRef);
  const currentCount = snapshot.exists() ? snapshot.val() : 0;
  await set(userRef, currentCount + 1);
  
  console.log('✅ Mock result saved:', newResultRef.key);
  return newResultRef.key!;
};

// Legacy function
export const saveMockResultLegacy = async (userId: string, result: Record<string, unknown>): Promise<string> => {
  return saveMockResult(result);
};

export const getUserMockResults = async (userId: string) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'mockResults'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  
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
  
  const db = database;
  const resultsRef = ref(db, 'mockResults');
  
  onValue(resultsRef, (snapshot) => {
    const results = snapshotToArray<any>(snapshot);
    callback(results);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback([]);
  });
  
  return () => off(resultsRef);
};

// ============================================
// FLASHCARDS
// Path: /flashcards/{flashcardId}
// ============================================

export const saveFlashcard = async (flashcard: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User must be authenticated to save flashcard');
  }
  
  const flashcardsRef = ref(database, 'flashcards');
  const newFlashcardRef = push(flashcardsRef);
  
  await set(newFlashcardRef, {
    userId,
    ...flashcard,
    createdAt: Date.now()
  }).catch((error) => {
    console.error('❌ Firebase Write Error:', error.code, error.message);
    throw error;
  });
  
  console.log('✅ Flashcard saved:', newFlashcardRef.key);
  return newFlashcardRef.key!;
};

export const getUserFlashcards = async (userId: string) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'flashcards'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  
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
  await update(ref(database, `flashcards/${flashcardId}`), data)
    .catch((error) => {
      console.error('❌ Firebase Update Error:', error.code, error.message);
    });
};

export const deleteFlashcard = async (flashcardId: string) => {
  if (!database) return;
  await remove(ref(database, `flashcards/${flashcardId}`))
    .catch((error) => {
      console.error('❌ Firebase Delete Error:', error.code, error.message);
    });
};

// ============================================
// RATINGS (Persistent - survives refresh)
// Path: /ratings/{ratingId}
// ============================================

export interface FirebaseRating {
  id?: string;
  odId?: number;
  userId: string;
  rating: number;
  review: string;
  createdAt: number;
}

export const saveRating = async (rating: number, review: string): Promise<string | null> => {
  if (!database) {
    console.warn('⚠️ Firebase not configured - cannot save rating');
    return null;
  }

  const userId = getCurrentUserId();
  if (!userId) {
    console.error('❌ User must be authenticated to save rating');
    return null;
  }

  try {
    const ratingsRef = ref(database, 'ratings');
    const newRatingRef = push(ratingsRef);
    const ratingData = {
      userId,
      rating,
      review,
      createdAt: Date.now()
    };

    await set(newRatingRef, ratingData);
    console.log('✅ Rating saved to Firebase:', newRatingRef.key);
    return newRatingRef.key;
  } catch (error) {
    console.error('❌ Error saving rating:', error);
    return null;
  }
};

export const subscribeToRatings = (callback: (ratings: FirebaseRating[]) => void): (() => void) => {
  if (!database) {
    console.warn('⚠️ Firebase not configured - cannot subscribe to ratings');
    callback([]);
    return () => {};
  }

  const db = database;
  const ratingsRef = ref(db, 'ratings');
  
  onValue(ratingsRef, (snapshot) => {
    const ratings: FirebaseRating[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        ratings.push({
          id: childSnapshot.key || '',
          odId: parseInt(childSnapshot.key || '0') || 0,
          userId: data.userId,
          rating: data.rating,
          review: data.review || '',
          createdAt: data.createdAt
        });
      });
    }
    console.log('📥 Received ratings from Firebase:', ratings.length);
    callback(ratings.sort((a, b) => b.createdAt - a.createdAt));
  }, (error) => {
    console.error('❌ Error subscribing to ratings:', error);
    callback([]);
  });

  return () => {
    off(ratingsRef);
    console.log('🔌 Unsubscribed from ratings');
  };
};

export const getUserRating = async (userId: string): Promise<FirebaseRating | null> => {
  if (!database) return null;

  try {
    const ratingsRef = ref(database, 'ratings');
    const snapshot = await get(ratingsRef);
    
    if (snapshot.exists()) {
      let userRating: FirebaseRating | null = null;
      snapshot.forEach((child) => {
        const data = child.val();
        if (data.userId === userId) {
          userRating = {
            id: child.key || '',
            userId: data.userId,
            rating: data.rating,
            review: data.review || '',
            createdAt: data.createdAt
          };
        }
      });
      return userRating;
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting user rating:', error);
    return null;
  }
};

// ============================================
// FEEDBACK (Legacy - kept for backward compatibility)
// Path: /feedback/{feedbackId}
// ============================================

export const saveFeedback = async (rating: number, review: string): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User must be authenticated to save feedback');
  }
  
  const feedbackRef = ref(database, 'feedback');
  const newFeedbackRef = push(feedbackRef);
  
  await set(newFeedbackRef, {
    userId,
    rating,
    review,
    createdAt: Date.now()
  }).catch((error) => {
    console.error('❌ Firebase Write Error:', error.code, error.message);
    throw error;
  });
  
  console.log('✅ Feedback saved:', newFeedbackRef.key);
  return newFeedbackRef.key!;
};

// Legacy function
export const saveFeedbackLegacy = async (userId: string, rating: number, review: string): Promise<string> => {
  return saveFeedback(rating, review);
};

export const getAllFeedback = async () => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'feedback'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  return snapshotToArray<any>(snapshot).sort((a, b) => b.createdAt - a.createdAt);
};

// Subscribe to feedback (for admin)
export const subscribeToFeedback = (callback: (feedback: any[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database;
  const feedbackRef = ref(db, 'feedback');
  
  onValue(feedbackRef, (snapshot) => {
    const feedback = snapshotToArray<any>(snapshot).sort((a, b) => b.createdAt - a.createdAt);
    callback(feedback);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback([]);
  });
  
  return () => off(feedbackRef);
};

// ============================================
// UPLOADED QUESTIONS (Admin)
// Path: /uploadedQuestions/{questionId}
// ============================================

export const uploadQuestion = async (question: Record<string, unknown>): Promise<string> => {
  if (!database) throw new Error('Firebase not configured');
  
  const uploadedBy = getCurrentUserId();
  if (!uploadedBy) {
    throw new Error('User must be authenticated to upload questions');
  }
  
  const questionsRef = ref(database, 'uploadedQuestions');
  const newQuestionRef = push(questionsRef);
  
  await set(newQuestionRef, {
    ...question,
    uploadedBy,
    uploadedAt: Date.now(),
    isActive: true
  }).catch((error) => {
    console.error('❌ Firebase Write Error:', error.code, error.message);
    throw error;
  });
  
  console.log('✅ Question uploaded:', newQuestionRef.key);
  return newQuestionRef.key!;
};

export const uploadQuestionsBulk = async (questions: Array<Record<string, unknown>>): Promise<string[]> => {
  const results = await Promise.all(questions.map(q => uploadQuestion(q)));
  console.log('✅ Bulk upload complete:', results.length, 'questions');
  return results;
};

export const getAllUploadedQuestions = async () => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'uploadedQuestions'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return [];
  return snapshotToArray<any>(snapshot);
};

export const subscribeToUploadedQuestions = (callback: (questions: any[]) => void): (() => void) => {
  if (!database) {
    callback([]);
    return () => {};
  }
  
  const db = database;
  const questionsRef = ref(db, 'uploadedQuestions');
  
  onValue(questionsRef, (snapshot) => {
    const questions = snapshotToArray<any>(snapshot);
    console.log('📥 Received uploaded questions from Firebase:', questions.length);
    callback(questions);
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback([]);
  });
  
  return () => {
    off(questionsRef);
    console.log('🔌 Unsubscribed from uploaded questions');
  };
};

export const updateUploadedQuestion = async (questionId: string, data: Record<string, unknown>) => {
  if (!database) return;
  await update(ref(database, `uploadedQuestions/${questionId}`), data)
    .catch((error) => {
      console.error('❌ Firebase Update Error:', error.code, error.message);
    });
};

export const deleteUploadedQuestion = async (questionId: string) => {
  if (!database) return;
  await remove(ref(database, `uploadedQuestions/${questionId}`))
    .catch((error) => {
      console.error('❌ Firebase Delete Error:', error.code, error.message);
    });
  console.log('✅ Question deleted:', questionId);
};

// ============================================
// USER PRESENCE (Real-time online status)
// Path: /presence/{uid}
// ============================================

export const setUserOnline = async (_userId?: string) => {
  // _userId parameter kept for backward compatibility but we use getCurrentUserId()
  if (!database) return;
  
  const userId = getCurrentUserId();
  if (!userId) return;
  
  await set(ref(database, `presence/${userId}`), {
    online: true,
    lastSeen: Date.now()
  }).catch((error) => {
    console.error('❌ Firebase Write Error:', error.code, error.message);
  });
};

export const setUserOffline = async () => {
  if (!database) return;
  
  const userId = getCurrentUserId();
  if (!userId) return;
  
  await update(ref(database, `presence/${userId}`), {
    online: false,
    lastSeen: Date.now()
  }).catch((error) => {
    console.error('❌ Firebase Update Error:', error.code, error.message);
  });
};

export const subscribeToOnlineUsers = (callback: (count: number) => void): (() => void) => {
  if (!database) {
    callback(0);
    return () => {};
  }
  
  const db = database;
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
  }, (error) => {
    console.error('❌ Firebase Subscribe Error:', error.code, error.message);
    callback(0);
  });
  
  return () => off(presenceRef);
};

// ============================================
// ANALYTICS
// Path: /analytics/{date}/{field}
// ============================================

export const updateAnalytics = async (field: string, value: number) => {
  if (!database) return;
  
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = ref(database, `analytics/${today}/${field}`);
  
  const snapshot = await get(analyticsRef)
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot) return;
  
  const currentValue = snapshot.exists() ? snapshot.val() : 0;
  await set(analyticsRef, currentValue + value)
    .catch((error) => {
      console.error('❌ Firebase Write Error:', error.code, error.message);
    });
};

export const getAnalytics = async (days: number = 7) => {
  if (!database) return [];
  
  const snapshot = await get(ref(database, 'analytics'))
    .catch((error) => {
      console.error('❌ Firebase Read Error:', error.code, error.message);
      return null;
    });
  
  if (!snapshot || !snapshot.exists()) return [];
  
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
