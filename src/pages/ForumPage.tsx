import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  User,
  Clock,
  Plus,
  X,
  ArrowLeft,
  Menu,
  Wifi,
  WifiOff
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { useStore } from '@/store/useStore';
import { db as localDb } from '@/lib/db';
import { 
  isFirebaseConfigured,
  subscribeToPosts,
  subscribeToComments,
  subscribeToUserLikes,
  createPost as firebaseCreatePost,
  toggleLikePost,
  addComment as firebaseAddComment,
  FirebasePost,
  FirebaseComment
} from '@/lib/firebase';
import { toNumericId } from '@/lib/utils';

interface ForumPageProps {
  onOpenMenu?: () => void;
}

// Unified post type
interface Post {
  id: string;
  userId: string;
  userName: string;
  userLevel: string;
  content: string;
  likes: number;
  timestamp: Date;
}

// Unified comment type
interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export function ForumPage({ onOpenMenu }: ForumPageProps) {
  const { currentUser, theme } = useStore();
  const isDark = theme === 'dark';
  const useFirebase = isFirebaseConfigured();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  const [showCreate, setShowCreate] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load posts - with real-time listener for Firebase
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (useFirebase) {
      // Firebase: Real-time listener - all users see each other's posts
      unsubscribe = subscribeToPosts((firebasePosts: FirebasePost[]) => {
        const convertedPosts: Post[] = firebasePosts.map(p => ({
          id: p.id,
          userId: p.userId,
          userName: p.userName,
          userLevel: p.userLevel,
          content: p.content,
          likes: p.likes || 0,
          timestamp: new Date(p.createdAt)
        }));
        setPosts(convertedPosts);
        setIsLoading(false);
      });
    } else {
      // IndexedDB: Local only (fallback)
      const loadLocalPosts = async () => {
        const allPosts = await localDb.forumPosts.orderBy('timestamp').reverse().toArray();
        const convertedPosts: Post[] = allPosts.map(p => ({
          id: String(p.id!),
          userId: String(p.userId),
          userName: p.userName,
          userLevel: p.userLevel,
          content: p.content,
          likes: p.likes,
          timestamp: p.timestamp
        }));
        setPosts(convertedPosts);
        setIsLoading(false);
      };
      loadLocalPosts();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [useFirebase]);

  // Load user's likes - with real-time listener for Firebase
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!currentUser) return;

    if (useFirebase) {
      // Firebase: Real-time listener for likes
      unsubscribe = subscribeToUserLikes(currentUser.id, (likedPostIds) => {
        setLikedPosts(likedPostIds);
      });
    } else {
      // IndexedDB: Local only
      const loadLocalLikes = async () => {
        const userId = toNumericId(currentUser.id);
        const likes = await localDb.postLikes.where('userId').equals(userId).toArray();
        setLikedPosts(new Set(likes.map(l => String(l.postId))));
      };
      loadLocalLikes();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.id, useFirebase]);

  // Load comments when a post is selected - with real-time listener for Firebase
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!selectedPost) {
      setComments([]);
      return;
    }

    if (useFirebase) {
      // Firebase: Real-time listener for comments
      unsubscribe = subscribeToComments(selectedPost.id, (firebaseComments: FirebaseComment[]) => {
        const convertedComments: Comment[] = firebaseComments.map(c => ({
          id: c.id,
          postId: c.postId,
          userId: c.userId,
          userName: c.userName,
          content: c.content,
          timestamp: new Date(c.createdAt)
        }));
        setComments(convertedComments);
      });
    } else {
      // IndexedDB: Local only
      const loadLocalComments = async () => {
        const postId = parseInt(selectedPost.id);
        const postComments = await localDb.forumComments.where('postId').equals(postId).toArray();
        const convertedComments: Comment[] = postComments.map(c => ({
          id: String(c.id!),
          postId: String(c.postId),
          userId: String(c.userId),
          userName: c.userName,
          content: c.content,
          timestamp: c.timestamp
        }));
        setComments(convertedComments);
      };
      loadLocalComments();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedPost?.id, useFirebase]);

  const handleCreatePost = async () => {
    if (!currentUser || !newPostContent.trim()) return;

    try {
      if (useFirebase) {
        // Firebase: Creates post that all users see in real-time
        await firebaseCreatePost(
          currentUser.id,
          currentUser.fullName,
          currentUser.academicLevel,
          newPostContent.trim()
        );
      } else {
        // IndexedDB: Local only
        await localDb.forumPosts.add({
          userId: toNumericId(currentUser.id),
          userName: currentUser.fullName,
          userLevel: currentUser.academicLevel,
          content: newPostContent.trim(),
          likes: 0,
          timestamp: new Date()
        });
        // Reload posts for local
        const allPosts = await localDb.forumPosts.orderBy('timestamp').reverse().toArray();
        setPosts(allPosts.map(p => ({
          id: String(p.id!),
          userId: String(p.userId),
          userName: p.userName,
          userLevel: p.userLevel,
          content: p.content,
          likes: p.likes,
          timestamp: p.timestamp
        })));
      }

      setNewPostContent('');
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (post: Post) => {
    if (!currentUser) return;

    try {
      if (useFirebase) {
        // Firebase: Toggle like - updates in real-time for all users
        await toggleLikePost(post.id, currentUser.id);
        // Likes will be updated via real-time listener
      } else {
        // IndexedDB: Local only
        const postId = parseInt(post.id);
        const userId = toNumericId(currentUser.id);
        const existingLike = await localDb.postLikes
          .where('[postId+userId]')
          .equals([postId, userId])
          .first();

        if (existingLike) {
          await localDb.postLikes.delete(existingLike.id!);
          await localDb.forumPosts.update(postId, { likes: Math.max(0, post.likes - 1) });
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(post.id);
            return newSet;
          });
        } else {
          await localDb.postLikes.add({ postId, userId });
          await localDb.forumPosts.update(postId, { likes: post.likes + 1 });
          setLikedPosts(prev => new Set(prev).add(post.id));
        }
        
        // Reload posts
        const allPosts = await localDb.forumPosts.orderBy('timestamp').reverse().toArray();
        setPosts(allPosts.map(p => ({
          id: String(p.id!),
          userId: String(p.userId),
          userName: p.userName,
          userLevel: p.userLevel,
          content: p.content,
          likes: p.likes,
          timestamp: p.timestamp
        })));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
  };

  const handleAddComment = async () => {
    if (!currentUser || !selectedPost || !newComment.trim()) return;

    try {
      if (useFirebase) {
        // Firebase: Add comment - visible to all users in real-time
        await firebaseAddComment(
          selectedPost.id,
          currentUser.id,
          currentUser.fullName,
          newComment.trim()
        );
      } else {
        // IndexedDB: Local only
        await localDb.forumComments.add({
          postId: parseInt(selectedPost.id),
          userId: toNumericId(currentUser.id),
          userName: currentUser.fullName,
          content: newComment.trim(),
          timestamp: new Date()
        });
        // Reload comments
        const postComments = await localDb.forumComments.where('postId').equals(parseInt(selectedPost.id)).toArray();
        setComments(postComments.map(c => ({
          id: String(c.id!),
          postId: String(c.postId),
          userId: String(c.userId),
          userName: c.userName,
          content: c.content,
          timestamp: c.timestamp
        })));
      }

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header with Menu */}
      <div className={`sticky top-0 z-30 px-4 py-3 ${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {selectedPost ? (
              <button 
                onClick={() => setSelectedPost(null)} 
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <ArrowLeft size={22} strokeWidth={1.5} />
              </button>
            ) : (
              <button 
                onClick={onOpenMenu} 
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            )}
            <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
              {selectedPost ? 'Discussion' : 'Community'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Firebase status indicator */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
              useFirebase 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {useFirebase ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{useFirebase ? 'Live' : 'Local'}</span>
            </div>
            {!selectedPost && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCreate(true)}
                className="p-2.5 rounded-xl bg-primary/20 text-primary"
              >
                <Plus size={22} strokeWidth={1.5} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Posts List */}
          {!selectedPost && (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className={isDark ? 'text-white/60' : 'text-gray-500'}>Loading discussions...</p>
                </div>
              ) : posts.length === 0 ? (
                <GlassCard className="text-center py-12" hover={false}>
                  <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-gray-300'}`} strokeWidth={1.5} />
                  <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>No discussions yet</p>
                  <Button onClick={() => setShowCreate(true)} icon={<Plus size={18} strokeWidth={1.5} />}>
                    Start a Discussion
                  </Button>
                </GlassCard>
              ) : (
                posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard onClick={() => handleViewPost(post)}>
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-white" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.userName}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                              {post.userLevel}
                            </span>
                          </div>
                          <p className={`text-sm line-clamp-3 mb-3 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleLikePost(post); }}
                              className={`flex items-center gap-1.5 transition-colors ${
                                likedPosts.has(post.id) ? 'text-red-500' : isDark ? 'text-white/50' : 'text-gray-400'
                              }`}
                            >
                              <Heart size={16} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                              <span>{post.likes}</span>
                            </button>
                            <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
                              <Clock size={14} strokeWidth={1.5} />
                              <span>{formatTime(post.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Post Detail */}
          {selectedPost && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Original Post */}
              <GlassCard hover={false}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedPost.userName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {selectedPost.userLevel}
                      </span>
                    </div>
                    <p className={`text-xs mb-3 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                      {formatTime(selectedPost.timestamp)}
                    </p>
                    <p className={`leading-relaxed ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedPost.content}
                    </p>
                    <div className={`flex items-center gap-4 mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      <button
                        onClick={() => handleLikePost(selectedPost)}
                        className={`flex items-center gap-2 ${
                          likedPosts.has(selectedPost.id) ? 'text-red-500' : isDark ? 'text-white/50' : 'text-gray-400'
                        }`}
                      >
                        <Heart size={18} fill={likedPosts.has(selectedPost.id) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        <span>{selectedPost.likes} likes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Comments */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Comments ({comments.length})
                </h3>
                <div className="space-y-3">
                  {comments.map(comment => (
                    <GlassCard key={comment.id} hover={false} className="py-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                          <User size={16} className={isDark ? 'text-white/60' : 'text-gray-400'} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{comment.userName}</p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{comment.content}</p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{formatTime(comment.timestamp)}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Add Comment */}
              <div className={`sticky bottom-0 -mx-4 px-4 py-4 border-t ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-xl`}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                    }`}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="p-3 rounded-xl bg-primary text-white disabled:opacity-50"
                  >
                    <Send size={20} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 border ${isDark ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  New Discussion
                </h2>
                <button onClick={() => setShowCreate(false)} className={isDark ? 'text-white/60' : 'text-gray-400'}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Share your question or thoughts with the community..."
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  rows={5}
                />
                <Button onClick={handleCreatePost} fullWidth disabled={!newPostContent.trim()}>
                  Post Discussion
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
