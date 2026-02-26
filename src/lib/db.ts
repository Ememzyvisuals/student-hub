import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  email: string;
  password: string;
  fullName: string;
  academicLevel: 'JSS' | 'SSS' | 'JAMB' | 'University';
  createdAt: Date;
  streak: number;
  lastActiveDate: string;
  totalQuestionsAnswered: number;
  totalCorrect: number;
}

export interface QuestionAttempt {
  id?: number;
  userId: number;
  questionId: string;
  subject: string;
  topic: string;
  difficulty: string;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface MockExamResult {
  id?: number;
  userId: number;
  subjects: string[];
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  jambScore: number;
  duration: number;
  timeSpent: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
  timestamp: Date;
  answers: Record<string, string>;
}

export interface Flashcard {
  id?: number;
  userId: number;
  front: string;
  back: string;
  subject: string;
  topic: string;
  isKnown: boolean;
  reviewLater: boolean;
  createdAt: Date;
}

export interface ForumPost {
  id?: number;
  userId: number;
  userName: string;
  userLevel: string;
  content: string;
  likes: number;
  timestamp: Date;
}

export interface ForumComment {
  id?: number;
  postId: number;
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface PostLike {
  id?: number;
  postId: number;
  userId: number;
}

export interface Badge {
  id?: number;
  userId: number;
  badgeType: string;
  earnedAt: Date;
}

export interface StudyTask {
  id?: number;
  userId: number;
  title: string;
  date: string;
  completed: boolean;
  createdAt: Date;
}

export interface BookmarkedQuestion {
  id?: number;
  userId: number;
  questionId: string;
  questionText: string;
  subject: string;
  topic: string;
  createdAt: Date;
}

export interface PomodoroSession {
  id?: number;
  userId: number;
  duration: number;
  completedAt: Date;
}

export interface Feedback {
  id?: number;
  userId: number;
  rating: number;
  review: string;
  timestamp: string;
}

export interface UploadedQuestion {
  id?: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: 'JSS' | 'SSS' | 'JAMB' | 'University';
  uploadedBy: string;
  uploadedAt: Date;
  isActive: boolean;
}

class StudentHubDB extends Dexie {
  users!: Table<User>;
  questionAttempts!: Table<QuestionAttempt>;
  mockExamResults!: Table<MockExamResult>;
  flashcards!: Table<Flashcard>;
  forumPosts!: Table<ForumPost>;
  forumComments!: Table<ForumComment>;
  postLikes!: Table<PostLike>;
  badges!: Table<Badge>;
  studyTasks!: Table<StudyTask>;
  bookmarkedQuestions!: Table<BookmarkedQuestion>;
  pomodoroSessions!: Table<PomodoroSession>;
  feedback!: Table<Feedback>;
  uploadedQuestions!: Table<UploadedQuestion>;

  constructor() {
    super('StudentHubNG');
    this.version(3).stores({
      users: '++id, email',
      questionAttempts: '++id, userId, subject, topic, timestamp',
      mockExamResults: '++id, userId, timestamp',
      flashcards: '++id, userId, subject, topic',
      forumPosts: '++id, userId, timestamp',
      forumComments: '++id, postId, userId',
      postLikes: '++id, [postId+userId]',
      badges: '++id, userId, badgeType',
      studyTasks: '++id, userId, date',
      bookmarkedQuestions: '++id, userId, questionId',
      pomodoroSessions: '++id, userId, completedAt',
      feedback: '++id, userId, timestamp',
      uploadedQuestions: '++id, level, subject, topic, difficulty, isActive'
    });
  }
}

export const db = new StudentHubDB();
