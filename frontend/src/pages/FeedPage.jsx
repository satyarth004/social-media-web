import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiEdit2, FiHeart, FiMessageCircle, FiPlusSquare, FiSend, FiTrash2, FiX } from 'react-icons/fi';
import api from '../services/api';

export default function FeedPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [relationships, setRelationships] = useState({ followers: [], following: [], mutuals: [] });
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [activeRelationshipTab, setActiveRelationshipTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stories, setStories] = useState([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const loadRelationships = async () => {
    const [relationsResponse, suggestionsResponse] = await Promise.all([
      api.get('/users/me/relationships'),
      api.get('/users/suggested')
    ]);
    setRelationships(relationsResponse.data);
    setSuggestedUsers(suggestionsResponse.data.users);
  };

  useEffect(() => {
    api.get('/posts/feed').then((res) => setPosts(res.data.posts));
    api.get('/stories').then((res) => setStories(res.data.stories));
    loadRelationships();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    formData.append('mediaType', mediaType);
    if (selectedMedia) formData.append('media', selectedMedia);

    const res = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setPosts((prev) => [res.data.post, ...prev]);
    setContent('');
    setMediaUrl('');
    setSelectedMedia(null);
  };

  const createStory = async (e) => {
    e.preventDefault();
    if (!selectedMedia && !mediaUrl.trim()) return;
    const formData = new FormData();
    formData.append('mediaType', mediaType);
    if (selectedMedia) formData.append('media', selectedMedia);
    if (mediaUrl.trim()) formData.append('mediaUrl', mediaUrl);

    const res = await api.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setStories((prev) => [res.data.story, ...prev]);
    setMediaUrl('');
    setSelectedMedia(null);
  };

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditText(post.content);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditText('');
  };

  const saveEdit = async (postId) => {
    if (!editText.trim()) return;
    const res = await api.put(`/posts/${postId}`, { content: editText });
    setPosts((prev) => prev.map((post) => (post._id === postId ? res.data.post : post)));
    cancelEdit();
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleLike = async (postId) => {
    const res = await api.post(`/posts/${postId}/like`);
    setPosts((prev) => prev.map((post) => (post._id === postId ? res.data.post : post)));
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const res = await api.post(`/posts/${postId}/comment`, { text });
    setPosts((prev) => prev.map((post) => (post._id === postId ? res.data.post : post)));
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleShare = async (postId) => {
    const res = await api.post(`/posts/${postId}/share`);
    alert(res.data.message);
  };

  const handleFollow = async (targetId) => {
    const res = await api.post(`/users/${targetId}/follow`);
    if (res.data.following) {
      setSuggestedUsers((prev) => prev.filter((item) => item._id !== targetId));
      setSearchResults((prev) => prev.filter((item) => item._id !== targetId));
    }
    await loadRelationships();
  };

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    const res = await api.get(`/users/search?q=${encodeURIComponent(value)}`);
    setSearchResults(res.data.users);
  };

  const avatar = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  return (
    <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-[0_15px_45px_rgba(2,6,23,0.35)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Stories</h3>
              <p className="text-sm text-slate-400">Fresh updates from your circle</p>
            </div>
            <button className="text-sm font-medium text-pink-400">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {stories.length > 0 ? stories.map((story) => (
              <div key={story._id} className="min-w-[88px] rounded-2xl border border-white/10 bg-slate-800/70 p-3 text-center text-sm">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-400 text-sm font-bold text-white">
                  {story.mediaType === 'video' ? '▶' : '•'}
                </div>
                <p className="truncate text-xs font-medium">{story.user?.username || 'Story'}</p>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-400">No stories yet</div>
            )}
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.4)] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:border-pink-400/30">
          <h2 className="mb-3 text-lg font-semibold">Create a post</h2>
          <form onSubmit={createPost} className="space-y-3">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 outline-none focus:border-pink-400" placeholder="What do you want to share?" />
            <div className="flex flex-col gap-3 md:flex-row">
              <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Paste image/video URL (optional)" />
              <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 outline-none">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <input type="file" accept="image/*,video/*" onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-2 text-slate-300" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <FiPlusSquare /> Add to your feed
              </div>
              <button className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-4 py-2 font-medium text-white">Publish</button>
            </div>
          </form>
        </motion.section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-[0_15px_45px_rgba(2,6,23,0.35)] backdrop-blur">
          <form onSubmit={createStory} className="mb-4 flex flex-col gap-2 rounded-2xl bg-slate-800/70 p-3">
            <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Story image/video URL (optional)" />
            <input type="file" accept="image/*,video/*" onChange={(e) => setSelectedMedia(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-2 text-slate-300" />
            <button className="rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white">Add Story</button>
          </form>
        </section>

        {posts.map((post) => (
          <motion.article key={post._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl transition-all hover:-translate-y-1 hover:border-pink-400/30">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-400 font-semibold text-white">
                  {avatar(post.user?.fullName || post.user?.username)}
                </div>
                <div>
                  <p className="font-semibold">{post.user?.fullName || post.user?.username}</p>
                  <p className="text-sm text-slate-500">@{post.user?.username}</p>
                </div>
              </div>
              {user?._id && post.user?._id === user._id && (
                <div className="flex gap-2">
                  <button onClick={() => startEdit(post)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800/80">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => deletePost(post._id)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800/80">
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
            {editingPostId === post._id ? (
              <div className="space-y-2 px-4 pb-4">
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 outline-none focus:border-pink-400" />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(post._id)} className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-3 py-2 text-sm font-medium text-white">
                    <span className="flex items-center gap-2"><FiCheck /> Save</span>
                  </button>
                  <button onClick={cancelEdit} className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-slate-300">
                    <span className="flex items-center gap-2"><FiX /> Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="px-4 pb-4 text-slate-200">{post.content}</p>
            )}
            {post.images?.length > 0 && (
              <img src={post.images[0]} alt="Post media" className="max-h-96 w-full object-cover" />
            )}
            {post.videos?.length > 0 && (
              <video controls className="max-h-96 w-full object-cover">
                <source src={post.videos[0]} />
              </video>
            )}
            <div className="flex items-center gap-5 px-4 py-3 text-slate-300">
              <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-800/80 hover:text-pink-500"><FiHeart /> {post.likes?.length || 0}</button>
              <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-800/80 hover:text-sky-500"><FiMessageCircle /> {post.comments?.length || 0}</button>
              <button onClick={() => handleShare(post._id)} className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-slate-800/80 hover:text-emerald-500"><FiSend /> Share</button>
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <textarea value={commentInputs[post._id] || ''} onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))} className="min-h-[70px] w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Write a comment..." />
              <button onClick={() => handleComment(post._id)} className="mt-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white">Comment</button>
            </div>
          </motion.article>
        ))}
      </div>

      <aside className="space-y-5">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-[0_15px_45px_rgba(2,6,23,0.35)] backdrop-blur">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-amber-400 font-semibold text-white">
              {avatar(user?.fullName || user?.username)}
            </div>
            <div>
              <p className="font-semibold text-slate-100">{user?.fullName || user?.username || 'Explorer'}</p>
              <p className="text-sm text-slate-400">@{user?.username || 'guest'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <button onClick={() => setActiveRelationshipTab(activeRelationshipTab === 'followers' ? null : 'followers')} className="rounded-2xl bg-slate-800/70 p-3 text-left text-slate-200 hover:bg-slate-800">
              Followers {relationships.followers?.length || 0}
            </button>
            <button onClick={() => setActiveRelationshipTab(activeRelationshipTab === 'following' ? null : 'following')} className="rounded-2xl bg-slate-800/70 p-3 text-left text-slate-200 hover:bg-slate-800">
              Following {relationships.following?.length || 0}
            </button>
          </div>
          {activeRelationshipTab && (
            <div className="mt-3 rounded-2xl bg-slate-800/70 p-3 text-sm">
              <p className="mb-2 font-medium text-slate-100">{activeRelationshipTab === 'followers' ? 'Followers' : 'Following'}</p>
              <div className="space-y-2">
                {(activeRelationshipTab === 'followers' ? relationships.followers : relationships.following).map((person) => (
                  <div key={person._id} className="flex items-center justify-between rounded-xl bg-slate-900/70 px-2 py-2">
                    <span className="text-slate-200">{person.fullName || person.username}</span>
                    <span className="text-slate-400">@{person.username}</span>
                  </div>
                ))}
                {(activeRelationshipTab === 'followers' ? relationships.followers : relationships.following).length === 0 && (
                  <p className="text-slate-400">No {activeRelationshipTab} yet.</p>
                )}
              </div>
            </div>
          )}
          {relationships.mutuals?.length > 0 && (
            <div className="mt-4 rounded-2xl bg-slate-800/70 p-3 text-sm">
              <p className="mb-2 font-medium text-slate-100">Following you back</p>
              <ul className="space-y-1 text-slate-400">
                {relationships.mutuals.slice(0, 3).map((person) => (
                  <li key={person._id}>• {person.fullName || person.username}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-4 shadow-[0_15px_45px_rgba(2,6,23,0.35)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">People to follow</h3>
            <span className="text-sm text-slate-400">Discover</span>
          </div>
          <input value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Search users..." className="mb-3 w-full rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-pink-400" />
          <div className="space-y-3">
            {searchResults.length > 0 && searchQuery.trim() ? (
              searchResults.map((person) => (
                <div key={person._id} className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-3">
                  <div>
                    <p className="font-medium text-slate-100">{person.fullName || person.username}</p>
                    <p className="text-sm text-slate-400">@{person.username}</p>
                  </div>
                  <button onClick={() => handleFollow(person._id)} className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-3 py-2 text-sm font-medium text-white">Follow</button>
                </div>
              ))
            ) : (
              suggestedUsers.map((person) => (
                <div key={person._id} className="flex items-center justify-between rounded-2xl bg-slate-800/70 p-3">
                  <div>
                    <p className="font-medium text-slate-100">{person.fullName || person.username}</p>
                    <p className="text-sm text-slate-400">@{person.username}</p>
                  </div>
                  <button onClick={() => handleFollow(person._id)} className="rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-3 py-2 text-sm font-medium text-white">Follow</button>
                </div>
              ))
            )}
            {suggestedUsers.length === 0 && searchResults.length === 0 && <p className="text-sm text-slate-400">You are all caught up.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
