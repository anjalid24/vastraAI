import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import InputField from '../../components/Forms/InputField.jsx';
import Button from '../../components/Buttons/Button.jsx';
import communityService from '../../services/communityService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLE_CHIP, ROLE_LABELS } from '../../utils/constants.js';
import { initials, timeAgo } from '../../utils/formatters.js';

// Community feed — like / comment / bookmark / create, backed by the mock
// community service until a real /api/community module exists.
export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { communityService.feed().then(setPosts); }, []);

  const refresh = (updated) =>
    setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));

  const like = async (id) => refresh(await communityService.toggleLike(id));
  const bookmark = async (id) => refresh(await communityService.toggleBookmark(id));
  const comment = async (id, text) =>
    refresh(await communityService.addComment(id, { author: user?.name || 'Guest', text }));

  const create = async (data) => {
    const post = await communityService.createPost({
      ...data, author: user?.name || 'Guest', role: user?.role || 'brand',
    });
    setPosts((ps) => [post, ...ps]);
    setShowCreate(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Community"
        deva="समुदाय"
        title="Share your craft, celebrate the community"
        lead="Post your designs, learn from artisans and brands, and keep India's textile traditions alive."
        actions={<Button variant="primary" onClick={() => setShowCreate(true)}>＋ Create post</Button>}
      />
      <div className="container py-4" style={{ maxWidth: 720 }}>
        {!posts ? <Loader label="Loading feed…" /> : posts.map((p) => (
          <PostCard key={p.id} post={p} onLike={like} onBookmark={bookmark} onComment={comment}
            canInteract={isAuthenticated} />
        ))}
      </div>

      <CreatePostModal open={showCreate} onClose={() => setShowCreate(false)} onSubmit={create}
        authed={isAuthenticated} />
    </>
  );
}

function PostCard({ post, onLike, onBookmark, onComment, canInteract }) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="v-card p-4 mb-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="d-inline-grid rounded-circle text-white" style={{
          width: 44, height: 44, placeItems: 'center', background: 'var(--v-indigo)', fontWeight: 700 }}>
          {initials(post.author)}
        </span>
        <div>
          <div className="fw-semibold">{post.author}</div>
          <div className="d-flex align-items-center gap-2">
            <span className={ROLE_CHIP[post.role]}>{ROLE_LABELS[post.role]}</span>
            <span className="small text-muted-2">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <span className="ms-auto v-chip">{post.category}</span>
      </div>

      <h5 className="mb-2">{post.title}</h5>
      <p className="text-muted-2">{post.description}</p>
      {post.image && <img src={post.image} alt="" className="img-fluid rounded-3 mb-3" />}

      <div className="d-flex gap-1 border-top pt-3">
        <ActionBtn active={post.likedByMe} onClick={() => canInteract && onLike(post.id)} disabled={!canInteract}>
          ❤️ {post.likes}
        </ActionBtn>
        <ActionBtn onClick={() => setShowComments((s) => !s)}>💬 {post.comments.length}</ActionBtn>
        <ActionBtn active={post.bookmarkedByMe} onClick={() => canInteract && onBookmark(post.id)} disabled={!canInteract}>
          {post.bookmarkedByMe ? '🔖 Saved' : '🔖 Save'}
        </ActionBtn>
        <ActionBtn className="ms-auto text-muted-2">⚑ Report</ActionBtn>
      </div>

      {showComments && (
        <div className="mt-3">
          {post.comments.map((c, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <span className="d-inline-grid rounded-circle text-white flex-shrink-0" style={{
                width: 30, height: 30, placeItems: 'center', background: 'var(--v-emerald-600)',
                fontSize: '.7rem', fontWeight: 700 }}>{initials(c.author)}</span>
              <div className="bg-cream rounded-3 px-3 py-2 flex-grow-1">
                <div className="small fw-semibold">{c.author} <span className="text-muted-2 fw-normal">· {timeAgo(c.at)}</span></div>
                <div className="small">{c.text}</div>
              </div>
            </div>
          ))}
          {canInteract ? (
            <form onSubmit={submitComment} className="d-flex gap-2 mt-2">
              <input className="form-control form-control-sm" placeholder="Add a comment…"
                value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <button className="btn btn-primary btn-sm" type="submit">Post</button>
            </form>
          ) : (
            <p className="small text-muted-2 mb-0">Log in to join the conversation.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, active, onClick, disabled, className = '' }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`btn btn-sm rounded-pill ${active ? 'btn-light border border-2' : 'btn-light'} ${className}`}
      style={active ? { borderColor: 'var(--v-indigo)' } : undefined}>
      {children}
    </button>
  );
}

function CreatePostModal({ open, onClose, onSubmit, authed }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'Design' });
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
    setForm({ title: '', description: '', category: 'Design' });
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a post" size="lg"
      footer={<>
        <Button variant="outline-primary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={!authed}>Publish</Button>
      </>}>
      {!authed ? (
        <p className="text-muted-2 mb-0">Please log in to share a post with the community.</p>
      ) : (
        <form onSubmit={submit}>
          <InputField label="Title" name="title" value={form.title} onChange={onChange}
            placeholder="Give your post a title" required />
          <InputField as="textarea" label="Description" name="description" rows={4}
            value={form.description} onChange={onChange} placeholder="Tell the story behind your design…" />
          <InputField as="select" label="Category" name="category" value={form.category} onChange={onChange}>
            {['Design', 'Bandhani', 'Ikat', 'Patola', 'Materials', 'Question'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </InputField>
        </form>
      )}
    </Modal>
  );
}
