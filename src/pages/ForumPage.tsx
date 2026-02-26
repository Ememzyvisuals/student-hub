import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Send,
  ArrowLeft,
  Menu,
  Wifi,
  WifiOff,
  Loader2,
  User,
  Clock,
  MessageCircle,
  Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { db } from '../lib/db';
import {
  subscribeToPosts,
  subscribeToComments,
  createPost,
  addComment,
  toggleLikePost,
  isFirebaseConfigured,
  deletePost as firebaseDeletePost
} from '../lib/firebase';

interface ForumPageProps {
  onOpenMenu?: () => void;
}

interface Post {
  id: string;
  odId?: number;
  odUserId?: number;
  userId: string;
  userName: string;
  userLevel: string;
  content: string;
  timestamp: number;
  likes: number;
  likedBy?: string[];
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export function ForumPage({ onOpenMenu }: ForumPageProps) {
  const { currentUser, theme } = useStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const commentsUnsubscribeRef = useRef<(() => void) | null>(null);
  const hasLoadedRef = useRef(false);

  const isDark = theme === 'dark';

  // Load posts - with timeout fallback
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Prevent double loading
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadPosts = async () => {
      setLoading(true);
      
      // Set a timeout to stop loading after 5 seconds no matter what
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        if (isFirebaseConfigured()) {
          setIsOnline(true);
          
          // Clean up previous subscription
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
          }

          unsubscribeRef.current = subscribeToPosts((firebasePosts) => {
            clearTimeout(timeoutId);
            
            const formattedPosts: Post[] = firebasePosts.map(p => ({
              id: String(p.id),
              userId: String(p.userId || ''),
              userName: p.userName || 'Anonymous',
              userLevel: p.userLevel || 'Student',
              content: p.content || '',
              timestamp: p.createdAt || Date.now(),
              likes: p.likes || 0,
              likedBy: []
            }));
            
            formattedPosts.sort((a, b) => b.timestamp - a.timestamp);
            setPosts(formattedPosts);
            setLoading(false); // ALWAYS set loading to false
          });
        } else {
          // Fallback to IndexedDB
          setIsOnline(false);
          const localPosts = await db.forumPosts.orderBy('timestamp').reverse().toArray();
          const formattedPosts: Post[] = localPosts.map(p => ({
            id: String(p.id),
            odId: p.id,
            userId: String(p.userId),
            userName: p.userName || 'Anonymous',
            userLevel: p.userLevel || 'Student',
            content: p.content,
            timestamp: p.timestamp ? new Date(p.timestamp).getTime() : Date.now(),
            likes: p.likes || 0,
            likedBy: []
          }));
          setPosts(formattedPosts);
          
          // Check liked posts from IndexedDB
          const userIdNum = typeof currentUser.id === 'number' ? currentUser.id : parseInt(String(currentUser.id)) || 0;
          const localLikes = await db.postLikes.where('userId').equals(userIdNum).toArray();
          const liked = new Set<string>(localLikes.map(l => String(l.postId)));
          setLikedPosts(liked);
          
          clearTimeout(timeoutId);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    loadPosts();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      hasLoadedRef.current = false;
    };
  }, [currentUser]);

  // Load comments for selected post
  useEffect(() => {
    if (!selectedPost) return;

    const loadComments = async () => {
      try {
        if (isFirebaseConfigured()) {
          if (commentsUnsubscribeRef.current) {
            commentsUnsubscribeRef.current();
          }

          commentsUnsubscribeRef.current = subscribeToComments(selectedPost.id, (firebaseComments) => {
            const formattedComments: Comment[] = firebaseComments.map(c => ({
              id: String(c.id),
              postId: String(c.postId || selectedPost.id),
              userId: String(c.userId || ''),
              userName: c.userName || 'Anonymous',
              content: c.content || '',
              timestamp: c.createdAt || Date.now()
            }));
            
            formattedComments.sort((a, b) => a.timestamp - b.timestamp);
            
            setComments(prev => ({
              ...prev,
              [selectedPost.id]: formattedComments
            }));
          });
        } else {
          const postIdNum = selectedPost.odId || parseInt(selectedPost.id) || 0;
          const localComments = await db.forumComments
            .where('postId')
            .equals(postIdNum)
            .toArray();
          
          const formattedComments: Comment[] = localComments.map(c => ({
            id: String(c.id),
            postId: String(c.postId),
            userId: String(c.userId),
            userName: c.userName || 'User',
            content: c.content,
            timestamp: c.timestamp ? new Date(c.timestamp).getTime() : Date.now()
          }));
          
          setComments(prev => ({
            ...prev,
            [selectedPost.id]: formattedComments
          }));
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    };

    loadComments();

    return () => {
      if (commentsUnsubscribeRef.current) {
        commentsUnsubscribeRef.current();
        commentsUnsubscribeRef.current = null;
      }
    };
  }, [selectedPost]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !currentUser || submitting) return;

    setSubmitting(true);

    try {
      if (isFirebaseConfigured()) {
        await createPost(
          String(currentUser.id),
          currentUser.fullName,
          currentUser.academicLevel,
          newPost.trim()
        );
      } else {
        const userIdNum = typeof currentUser.id === 'number' ? currentUser.id : parseInt(String(currentUser.id)) || 0;
        await db.forumPosts.add({
          userId: userIdNum,
          userName: currentUser.fullName,
          userLevel: currentUser.academicLevel,
          content: newPost.trim(),
          timestamp: new Date(),
          likes: 0
        });
        // Reload posts for offline mode
        const localPosts = await db.forumPosts.orderBy('timestamp').reverse().toArray();
        const formattedPosts: Post[] = localPosts.map(p => ({
          id: String(p.id),
          odId: p.id,
          userId: String(p.userId),
          userName: p.userName || 'Anonymous',
          userLevel: p.userLevel || 'Student',
          content: p.content,
          timestamp: p.timestamp ? new Date(p.timestamp).getTime() : Date.now(),
          likes: p.likes || 0,
          likedBy: []
        }));
        setPosts(formattedPosts);
      }
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
    
    setSubmitting(false);
  };

  const handleLike = async (post: Post) => {
    if (!currentUser) return;

    const userId = String(currentUser.id);
    const isLiked = likedPosts.has(post.id);

    // Optimistic update
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(post.id);
      } else {
        newSet.add(post.id);
      }
      return newSet;
    });

    setPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
        };
      }
      return p;
    }));

    try {
      if (isFirebaseConfigured()) {
        await toggleLikePost(post.id, userId);
      } else {
        const postIdNum = post.odId || parseInt(post.id) || 0;
        const userIdNum = typeof currentUser.id === 'number' ? currentUser.id : parseInt(String(currentUser.id)) || 0;
        
        if (isLiked) {
          await db.postLikes.where({ postId: postIdNum, userId: userIdNum }).delete();
          await db.forumPosts.update(postIdNum, { likes: Math.max(0, post.likes - 1) });
        } else {
          await db.postLikes.add({ postId: postIdNum, userId: userIdNum });
          await db.forumPosts.update(postIdNum, { likes: post.likes + 1 });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !currentUser || submitting) return;

    setSubmitting(true);

    try {
      if (isFirebaseConfigured()) {
        await addComment(
          selectedPost.id,
          String(currentUser.id),
          currentUser.fullName,
          newComment.trim()
        );
      } else {
        const postIdNum = selectedPost.odId || parseInt(selectedPost.id) || 0;
        const userIdNum = typeof currentUser.id === 'number' ? currentUser.id : parseInt(String(currentUser.id)) || 0;
        
        await db.forumComments.add({
          postId: postIdNum,
          userId: userIdNum,
          userName: currentUser.fullName,
          content: newComment.trim(),
          timestamp: new Date()
        });
        
        // Reload comments
        const localComments = await db.forumComments.where('postId').equals(postIdNum).toArray();
        const formattedComments: Comment[] = localComments.map(c => ({
          id: String(c.id),
          postId: String(c.postId),
          userId: String(c.userId),
          userName: c.userName || 'User',
          content: c.content,
          timestamp: c.timestamp ? new Date(c.timestamp).getTime() : Date.now()
        }));
        setComments(prev => ({
          ...prev,
          [selectedPost.id]: formattedComments
        }));
      }
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    
    setSubmitting(false);
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    
    try {
      if (isFirebaseConfigured()) {
        await firebaseDeletePost(postId);
      } else {
        const postIdNum = parseInt(postId) || 0;
        await db.forumPosts.delete(postIdNum);
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!selectedPost) return;
    
    try {
      const commentIdNum = parseInt(commentId) || 0;
      await db.forumComments.delete(commentIdNum);
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: prev[selectedPost.id]?.filter(c => c.id !== commentId) || []
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const isAdmin = currentUser?.email === 'ememzyvisuals@gmail.com';

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
        <div className="text-center">
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Please login to access the forum</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {selectedPost ? (
              <button
                onClick={() => setSelectedPost(null)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            ) : (
              <button
                onClick={onOpenMenu}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
              >
                <Menu className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </button>
            )}
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {selectedPost ? 'Discussion' : 'Community'}
              </h1>
              <div className="flex items-center gap-1 text-xs">
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Post Detail View */}
      {!loading && selectedPost && (
        <div className="p-4 pb-32">
          {/* Selected Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-xl rounded-2xl p-4 border mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedPost.userName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                    {selectedPost.userLevel}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(selectedPost.timestamp)}</span>
                </div>
              </div>
            </div>
            <p className={`text-base leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{selectedPost.content}</p>
            <div className={`flex items-center gap-4 mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <button
                onClick={() => handleLike(selectedPost)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  likedPosts.has(selectedPost.id)
                    ? 'bg-red-500/20 text-red-400'
                    : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
                <span className="text-sm">{selectedPost.likes}</span>
              </button>
              <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments[selectedPost.id]?.length || 0}</span>
              </div>
            </div>
          </motion.div>

          {/* Comments */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Comments ({comments[selectedPost.id]?.length || 0})
            </h3>
            
            <div className="space-y-3">
              <AnimatePresence>
                {comments[selectedPost.id]?.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-3 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{comment.userName}</span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatTime(comment.timestamp)}</span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-100 text-gray-400 hover:text-red-500'}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className={`text-sm pl-9 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{comment.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {(!comments[selectedPost.id] || comments[selectedPost.id].length === 0) && (
                <div className="text-center py-8">
                  <MessageCircle className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No comments yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Comment Input - Fixed at bottom */}
          <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t p-4 pb-safe ${isDark ? 'bg-black/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
            <div className="flex gap-3 max-w-lg mx-auto">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className={`flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-500' 
                    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submitting}
                className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List View */}
      {!loading && !selectedPost && (
        <div className="p-4 pb-32">
          {/* Create Post */}
          <div className={`backdrop-blur-xl rounded-2xl p-4 border mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community..."
              rows={3}
              className={`w-full bg-transparent resize-none focus:outline-none text-base ${
                isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim() || submitting}
                className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Post
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`backdrop-blur-xl rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.userName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                          {post.userLevel}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(post.timestamp)}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-100 text-gray-400 hover:text-red-500'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className={`text-base leading-relaxed mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{post.content}</p>
                  
                  <div className={`flex items-center gap-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                        likedPosts.has(post.id)
                          ? 'bg-red-500/20 text-red-400'
                          : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Comment</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  No posts yet
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
