import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { ForumPost, UserProfile, ForumComment, ForumReaction, ForumCategory } from '../../types';
import { getInitialForumPosts, forumCategories } from '../../constants/forumData';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTheme } from '../../context/ThemeContext';

interface ForumViewProps {
  destination: string;
  currentUser: UserProfile;
  users: UserProfile[];
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const predefinedReactions = ['👍', '❤️', '💡', '😂', '🤔'];

const Reactions: React.FC<{ 
    reactions: ForumReaction[], 
    onReact: (emoji: string) => void,
    currentUserEmail: string
}> = ({ reactions, onReact, currentUserEmail }) => {
    const [pickerOpen, setPickerOpen] = useState(false);
    const theme = useTheme();
    const pickerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [pickerRef]);

    const reactionsByEmoji = useMemo(() => {
        const groups: Record<string, string[]> = {};
        for (const reaction of reactions) {
            if (!groups[reaction.emoji]) {
                groups[reaction.emoji] = [];
            }
            groups[reaction.emoji].push(reaction.userId);
        }
        return groups;
    }, [reactions]);

    const sortedEmojis = Object.keys(reactionsByEmoji).sort((a, b) => reactionsByEmoji[b].length - reactionsByEmoji[a].length);

    return (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
            {sortedEmojis.map((emoji) => {
                const userIds = reactionsByEmoji[emoji];
                const userHasReacted = userIds.includes(currentUserEmail);
                return (
                    <button 
                        key={emoji}
                        onClick={() => onReact(emoji)}
                        className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 transition-colors ${userHasReacted ? `${theme.background.secondary} text-white border border-transparent` : 'bg-gray-700 hover:bg-gray-600 border border-transparent hover:border-gray-500'}`}
                        title={userIds.length > 1 ? `${userIds.length} users reacted with ${emoji}` : `1 user reacted with ${emoji}`}
                    >
                        <span>{emoji}</span>
                        <span className="font-semibold">{userIds.length}</span>
                    </button>
                );
            })}
            <div className="relative" ref={pickerRef}>
                <button 
                    onClick={() => setPickerOpen(p => !p)} 
                    className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white"
                    title="Add reaction"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 01-1.415-1.414 3 3 0 00-4.242 0 1 1 0 01-1.415 1.414 5 5 0 017.072 0z" clipRule="evenodd" />
                    </svg>
                </button>
                {pickerOpen && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-600 rounded-full shadow-lg p-1 flex gap-1 animate-fade-in">
                        {predefinedReactions.map(emoji => (
                             <button 
                                key={emoji}
                                onClick={() => {
                                    onReact(emoji);
                                    setPickerOpen(false);
                                }}
                                className="p-2 text-xl rounded-full hover:bg-gray-700 transition-transform hover:scale-125"
                             >
                                 {emoji}
                             </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ForumThreadCard: React.FC<{ post: ForumPost, onSelect: () => void, isUnread: boolean, author?: UserProfile }> = ({ post, onSelect, isUnread, author }) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || '?')}&background=4b5563&color=e2e8f0&size=96`;
    const theme = useTheme();
    
    return (
        <div onClick={onSelect} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:bg-gray-700/50 cursor-pointer transition-colors flex gap-4 items-start">
            {isUnread && <div className={`w-2 h-2 ${theme.background.secondary} rounded-full mt-2 flex-shrink-0`} title="Unread"></div>}
             {post.imageUrl && (
                <img src={post.imageUrl} alt="Post image" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start flex-wrap gap-x-4 gap-y-2">
                    <div className="min-w-0">
                        <h4 className="font-bold text-lg text-white truncate">{post.title}</h4>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                        <img src={author?.avatar || defaultAvatar} alt={author?.name} className="w-6 h-6 rounded-full"/>
                        <span>{author?.name}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{new Date(post.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="text-sm text-gray-400 mt-2 line-clamp-2">{post.content}</div>
                <div className="flex items-center gap-4 text-xs mt-3 text-gray-500">
                    <span>{post.comments.length} comments</span>
                    <span>{post.reactions.length} reactions</span>
                </div>
            </div>
        </div>
    );
};


export const ForumView: React.FC<ForumViewProps> = ({ destination, currentUser, users }) => {
    const forumKey = `forum-data_${destination}`;
    const [posts, setPosts] = useLocalStorage<ForumPost[]>(forumKey, getInitialForumPosts(destination));
    
    const [view, setView] = useState<'list' | 'view' | 'create'>('list');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Form state
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostCategory, setNewPostCategory] = useState<ForumCategory>('General Discussion');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState<File | null>(null);
    const [newComment, setNewComment] = useState('');

    const [activeCategory, setActiveCategory] = useState<string>('All');
    const theme = useTheme();
    
    // User Mention State
    const [mentionSuggestions, setMentionSuggestions] = useState<UserProfile[]>([]);
    const [mentionTarget, setMentionTarget] = useState<{ top: number; left: number; textarea: HTMLTextAreaElement; type: 'post' | 'comment'; } | null>(null);
    const postTextareaRef = useRef<HTMLTextAreaElement>(null);
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
    const mentionDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target as Node)) {
                setMentionTarget(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const allUsersByName = useMemo(() => new Map(users.map(u => [u.name, u])), [users]);

    const renderWithMentions = (text: string) => {
        const parts = text.split(/(@\[[^\]]+\])/g);
        return parts.map((part, index) => {
            const mentionMatch = part.match(/@\[([^\]]+)\]/);
            if (mentionMatch) {
                const name = mentionMatch[1];
                if (allUsersByName.has(name)) {
                    return <strong key={index} className="text-teal-400 bg-teal-900/50 px-1 rounded-sm">{`@${name}`}</strong>;
                }
            }
            return part;
        });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: 'post' | 'comment') => {
        const textarea = e.target;
        const value = textarea.value;

        if (type === 'post') setNewPostContent(value);
        else setNewComment(value);

        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            const query = mentionMatch[1].toLowerCase();
            const suggestions = users.filter(user =>
                user.id !== currentUser.id && (user.name.toLowerCase().includes(query) || user.email.split('@')[0].toLowerCase().includes(query))
            ).slice(0, 5);

            if (suggestions.length > 0) {
                const rect = textarea.getBoundingClientRect();
                setMentionSuggestions(suggestions);
                setMentionTarget({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, textarea, type });
            } else {
                setMentionTarget(null);
            }
        } else {
            setMentionTarget(null);
        }
    };
    
    const handleMentionSelect = (user: UserProfile) => {
        if (!mentionTarget || !mentionTarget.textarea) return;

        const { textarea, type } = mentionTarget;
        const currentText = textarea.value;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = currentText.substring(0, cursorPos);
        const mentionStartIndex = textBeforeCursor.lastIndexOf('@');

        if (mentionStartIndex === -1) {
            setMentionTarget(null);
            return;
        }

        const textAfterCursor = currentText.substring(cursorPos);
        const newText = `${textBeforeCursor.substring(0, mentionStartIndex)}@[${user.name}] ${textAfterCursor}`;
        
        if (type === 'post') setNewPostContent(newText);
        else setNewComment(newText);
        
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = mentionStartIndex + `@[${user.name}] `.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);

        setMentionTarget(null);
    };

    const handleSelectPost = (post: ForumPost) => {
        setSelectedPostId(post.id);
        setView('view');
        // Mark as read
        if (!post.readBy.includes(currentUser.email)) {
            const updatedPosts = posts.map(p => 
                p.id === post.id ? { ...p, readBy: [...p.readBy, currentUser.email] } : p
            );
            setPosts(updatedPosts);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostTitle || !newPostContent) {
            alert('Please provide a title and content for your post.');
            return;
        }

        let imageUrl: string | undefined = undefined;
        if (newPostImage) {
            imageUrl = await fileToBase64(newPostImage);
        }

        const newPost: ForumPost = {
            id: `post-${Date.now()}`,
            destination,
            authorId: currentUser.email,
            title: newPostTitle,
            category: newPostCategory,
            content: newPostContent,
            imageUrl,
            timestamp: new Date().toISOString(),
            comments: [],
            reactions: [],
            readBy: [currentUser.email]
        };
        setPosts([newPost, ...posts]);
        
        // Reset form and view
        setView('list');
        setNewPostTitle('');
        setNewPostCategory('General Discussion');
        setNewPostContent('');
        setNewPostImage(null);
    };
    
    const handleAddComment = (postId: string) => {
        if (!newComment.trim()) return;
        
        const newCommentObj: ForumComment = {
            id: `comment-${Date.now()}`,
            authorId: currentUser.email,
            content: newComment,
            timestamp: new Date().toISOString(),
            reactions: []
        };

        const updatedPosts = posts.map(p => 
            p.id === postId ? { ...p, comments: [...p.comments, newCommentObj] } : p
        );
        setPosts(updatedPosts);
        setNewComment('');
    };

    const handleReaction = (targetId: string, emoji: string, isComment: boolean) => {
        const updatedPosts = posts.map(post => {
            if (isComment) {
                const commentIndex = post.comments.findIndex(c => c.id === targetId);
                if (commentIndex > -1) {
                    const comment = post.comments[commentIndex];
                    const existingReactionIndex = comment.reactions.findIndex(r => r.userId === currentUser.email && r.emoji === emoji);
                    
                    let newReactions: ForumReaction[];
                    if (existingReactionIndex > -1) {
                        newReactions = comment.reactions.filter((_, index) => index !== existingReactionIndex);
                    } else {
                        // Allow only one reaction type per user on a single item
                        const otherReactions = comment.reactions.filter(r => r.userId !== currentUser.email);
                        newReactions = [...otherReactions, { emoji, userId: currentUser.email }];
                    }
                    
                    const updatedComments = [...post.comments];
                    updatedComments[commentIndex] = { ...comment, reactions: newReactions };
                    
                    return { ...post, comments: updatedComments };
                }
            } else if (post.id === targetId) {
                const existingReactionIndex = post.reactions.findIndex(r => r.userId === currentUser.email && r.emoji === emoji);
                
                let newReactions: ForumReaction[];
                 if (existingReactionIndex > -1) {
                    newReactions = post.reactions.filter((_, index) => index !== existingReactionIndex);
                } else {
                    // Allow only one reaction type per user on a single item
                    const otherReactions = post.reactions.filter(r => r.userId !== currentUser.email);
                    newReactions = [...otherReactions, { emoji, userId: currentUser.email }];
                }
                
                return { ...post, reactions: newReactions };
            }
            
            return post;
        });
        setPosts(updatedPosts);
    };
    
    const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [posts, selectedPostId]);
    
    const renderCreatePostView = () => (
        <div className="animate-fade-in space-y-4">
             <button onClick={() => setView('list')} className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Cancel
            </button>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 space-y-4">
                <h2 className="text-2xl font-bold text-white">Create New Post</h2>
                <input type="text" placeholder="Post Title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                <select value={newPostCategory} onChange={e => setNewPostCategory(e.target.value as ForumCategory)} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}>
                    {forumCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea ref={postTextareaRef} placeholder="What's on your mind? Use @ to mention a user." value={newPostContent} onChange={e => handleContentChange(e, 'post')} rows={6} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`} />
                <input type="file" accept="image/*" onChange={e => setNewPostImage(e.target.files?.[0] || null)} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500" />
                <div className="flex justify-end">
                    <button onClick={handleCreatePost} className={`px-6 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Submit Post</button>
                </div>
            </div>
        </div>
    );

    const renderSelectedPostView = () => {
        if (!selectedPost) return null;
        const author = users.find(u => u.email === selectedPost.authorId);
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || '?')}&background=4b5563&color=e2e8f0&size=96`;

        return (
             <div className="animate-fade-in">
                <button onClick={() => { setView('list'); setSelectedPostId(null); }} className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Forum
                </button>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-white">{selectedPost.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 border-b border-gray-700 pb-4 mb-4">
                        <img src={author?.avatar || defaultAvatar} alt={author?.name} className="w-8 h-8 rounded-full"/>
                        <span>Posted by {author?.name} on {new Date(selectedPost.timestamp).toLocaleString()}</span>
                    </div>
                    {selectedPost.imageUrl && <img src={selectedPost.imageUrl} alt="Post content" className="max-w-full md:max-w-md rounded-lg my-4"/>}
                    <div className="text-gray-300 whitespace-pre-wrap">{renderWithMentions(selectedPost.content)}</div>

                    <Reactions
                        reactions={selectedPost.reactions}
                        onReact={(emoji) => handleReaction(selectedPost.id, emoji, false)}
                        currentUserEmail={currentUser.email}
                    />

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">Comments ({selectedPost.comments.length})</h3>
                        <div className="space-y-4">
                            {selectedPost.comments.map(comment => {
                                const commentAuthor = users.find(u => u.email === comment.authorId);
                                const commentAvatar = commentAuthor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(commentAuthor?.name || '?')}&background=4b5563&color=e2e8f0&size=96`;
                                return (
                                    <div key={comment.id} className="flex gap-3">
                                        <img src={commentAvatar} alt={commentAuthor?.name} className="w-8 h-8 rounded-full mt-1 flex-shrink-0"/>
                                        <div className="flex-1 bg-gray-900/50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-400">
                                                <span className="font-bold text-gray-200">{commentAuthor?.name}</span> • {new Date(comment.timestamp).toLocaleString()}
                                            </p>
                                            <div className="text-gray-300 mt-1 whitespace-pre-wrap">{renderWithMentions(comment.content)}</div>
                                            <Reactions
                                                reactions={comment.reactions}
                                                onReact={(emoji) => handleReaction(comment.id, emoji, true)}
                                                currentUserEmail={currentUser.email}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex gap-3">
                             <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || '?')}&background=4b5563&color=e2e8f0&size=96`} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0"/>
                            <div className="flex-1 relative">
                                <textarea ref={commentTextareaRef} value={newComment} onChange={e => handleContentChange(e, 'comment')} placeholder="Add a comment... Use @ to mention a user." rows={2} className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white ${theme.ring.primary}`}></textarea>
                                <button onClick={() => handleAddComment(selectedPost.id)} className={`mt-2 px-4 py-1.5 text-xs font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>Post Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    const filteredPosts = (activeCategory === 'All' 
        ? posts 
        : posts.filter(p => p.category === activeCategory))
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const renderListView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-xl font-bold text-white">Team Forum for {destination}</h3>
                <button onClick={() => setView('create')} className={`px-4 py-2 text-sm font-medium text-white ${theme.background.primary} ${theme.background.hover} rounded-md`}>
                    New Post
                </button>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
                <button onClick={() => setActiveCategory('All')} className={`px-3 py-1 text-sm rounded-md flex-shrink-0 ${activeCategory === 'All' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>All</button>
                {forumCategories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 text-sm rounded-md flex-shrink-0 ${activeCategory === cat ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>{cat}</button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredPosts.length > 0 ? filteredPosts.map(post => (
                    <ForumThreadCard 
                        key={post.id} 
                        post={post}
                        onSelect={() => handleSelectPost(post)}
                        isUnread={!post.readBy.includes(currentUser.email)}
                        author={users.find(u => u.email === post.authorId)}
                    />
                )) : <p className="text-gray-500 text-center py-8">No posts in this category.</p>}
            </div>
        </div>
    );

    return (
        <div className="relative">
            {view === 'list' && renderListView()}
            {view === 'create' && renderCreatePostView()}
            {view === 'view' && renderSelectedPostView()}
            {mentionTarget && (
                <div 
                    ref={mentionDropdownRef}
                    style={{ top: mentionTarget.top, left: mentionTarget.left, minWidth: mentionTarget.textarea.offsetWidth }} 
                    className="absolute z-10 bg-gray-900 border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto"
                >
                    {mentionSuggestions.map(user => (
                        <button
                            key={user.id}
                            onClick={() => handleMentionSelect(user)}
                            className="w-full text-left p-2 hover:bg-gray-700 text-sm text-gray-200 flex items-center gap-2"
                        >
                             <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '?')}&background=4b5563&color=e2e8f0&size=96`} alt={user.name} className="w-6 h-6 rounded-full"/>
                            {user.name} <span className="text-gray-400">({user.email.split('@')[0]})</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};