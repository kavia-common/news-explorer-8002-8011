import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Color palette per work item
const COLORS = {
  primary: '#1a73e8',
  secondary: '#e8eaed',
  accent: '#ff7043',
};

// Placeholder/stub articles until backend integration
const STUB_ARTICLES = [
  {
    id: '1',
    title: 'Global Markets Rally as Tech Stocks Surge',
    category: 'Business',
    source: 'MarketWatch',
    author: 'Jane Smith',
    publishedAt: '2025-08-18T09:30:00Z',
    excerpt: 'Tech-heavy indices climbed as investors reacted to strong earnings...',
    content:
      'Tech-heavy indices climbed as investors reacted to strong earnings from major software firms. Analysts say the momentum could continue if macroeconomic indicators remain stable. In related news, regulators are considering updates to disclosure policies.',
    imageUrl: 'https://picsum.photos/seed/markets/640/360',
    url: '#',
  },
  {
    id: '2',
    title: 'Breakthrough in Battery Technology Promises Faster Charging',
    category: 'Technology',
    source: 'TechDaily',
    author: 'Alex Johnson',
    publishedAt: '2025-08-18T12:15:00Z',
    excerpt: 'A new solid-state approach reduces charging time by up to 60%...',
    content:
      'Researchers unveiled a solid-state battery prototype that significantly reduces charging time while increasing energy density. The team plans pilot production next year. Industry experts believe this could accelerate EV adoption worldwide.',
    imageUrl: 'https://picsum.photos/seed/battery/640/360',
    url: '#',
  },
  {
    id: '3',
    title: 'Local Community Garden Project Blossoms',
    category: 'Lifestyle',
    source: 'City News',
    author: 'Priya Patel',
    publishedAt: '2025-08-17T08:00:00Z',
    excerpt: 'Residents celebrate the opening of a new community green space...',
    content:
      'The community garden project, started by volunteers, has created a hub for learning and connection. Workshops on sustainable gardening are planned. Residents can reserve plots starting next month.',
    imageUrl: 'https://picsum.photos/seed/garden/640/360',
    url: '#',
  },
  {
    id: '4',
    title: 'Championship Final Ends in Dramatic Fashion',
    category: 'Sports',
    source: 'Sports Now',
    author: 'Liam O’Connor',
    publishedAt: '2025-08-16T20:45:00Z',
    excerpt: 'An extra-time winner seals the title after a tense match...',
    content:
      'The championship final kept fans on the edge of their seats with end-to-end action. A late extra-time goal clinched the title. Coaches praised the players for their resilience and tactical discipline.',
    imageUrl: 'https://picsum.photos/seed/champs/640/360',
    url: '#',
  },
];

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);
  return [value, setValue];
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This component renders the news feed layout:
   * - Header with navigation and search
   * - Sidebar with category filters and bookmarks
   * - Main feed grid of articles
   * - Modal for article details
   * Placeholder data is used until backend integration.
   * Env prep: process.env.REACT_APP_API_BASE_URL is referenced for future use.
   */
  const [theme, setTheme] = useState('light');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', []);
  const [selected, setSelected] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const categories = useMemo(
    () => ['All', 'Business', 'Technology', 'Lifestyle', 'Sports'],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUB_ARTICLES.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id);

  // PUBLIC_INTERFACE
  const toggleBookmark = (article) => {
    /**
     * Toggle bookmark for given article. Persists to localStorage.
     */
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === article.id)) {
        return prev.filter((b) => b.id !== article.id);
      }
      return [...prev, article];
    });
  };

  const openDetails = (article) => setSelected(article);
  const closeDetails = () => setSelected(null);

  return (
    <div className="App" style={{ background: 'var(--bg-primary)' }}>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        query={query}
        onQuery={(v) => setQuery(v)}
        colors={COLORS}
      />
      <div className="layout">
        <Sidebar
          categories={categories}
          active={category}
          onChange={setCategory}
          bookmarks={bookmarks}
          onOpen={openDetails}
          onToggleBookmark={toggleBookmark}
          colors={COLORS}
        />
        <main className="content">
          <Feed
            articles={filtered}
            onOpen={openDetails}
            onToggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
            colors={COLORS}
          />
        </main>
      </div>

      {selected && (
        <ArticleModal
          article={selected}
          onClose={closeDetails}
          onToggleBookmark={toggleBookmark}
          bookmarked={isBookmarked(selected.id)}
          colors={COLORS}
        />
      )}

      <Footer apiBaseUrl={API_BASE_URL} />
    </div>
  );
}

function Header({ theme, toggleTheme, query, onQuery, colors }) {
  return (
    <header className="header" role="banner" aria-label="Top navigation">
      <div className="brand">
        <span className="logo" aria-hidden="true">
          📰
        </span>
        <h1 className="app-title">News Explorer</h1>
      </div>
      <div className="search">
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search articles, authors, sources..."
          aria-label="Search news"
        />
      </div>
      <nav className="nav" aria-label="Primary">
        <a className="nav-link active" href="#latest">
          Latest
        </a>
        <a className="nav-link" href="#trending">
          Trending
        </a>
        <a className="nav-link" href="#bookmarks">
          Bookmarks
        </a>
      </nav>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title="Toggle theme"
        style={{
          backgroundColor: colors.primary,
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}

function Sidebar({
  categories,
  active,
  onChange,
  bookmarks,
  onOpen,
  onToggleBookmark,
  colors,
}) {
  return (
    <aside className="sidebar" aria-label="Filters and bookmarks">
      <div className="panel">
        <h2 className="panel-title">Filters</h2>
        <ul className="category-list">
          {categories.map((c) => (
            <li key={c}>
              <button
                className={`chip ${c === active ? 'chip-active' : ''}`}
                onClick={() => onChange(c)}
                aria-pressed={c === active}
                style={{
                  borderColor: c === active ? colors.primary : 'var(--border-color)',
                  color: c === active ? colors.primary : 'inherit',
                  background: c === active ? 'rgba(26, 115, 232, 0.06)' : 'transparent',
                }}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h2 className="panel-title">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="muted">No bookmarks yet.</p>
        ) : (
          <ul className="bookmark-list">
            {bookmarks.map((b) => (
              <li key={b.id} className="bookmark-item">
                <button className="bookmark-open" onClick={() => onOpen(b)}>
                  {b.title}
                </button>
                <button
                  className="bookmark-remove"
                  onClick={() => onToggleBookmark(b)}
                  aria-label="Remove bookmark"
                  title="Remove bookmark"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function Feed({ articles, onOpen, onToggleBookmark, isBookmarked, colors }) {
  return (
    <section className="feed" aria-label="News feed">
      {articles.length === 0 ? (
        <p className="muted" style={{ padding: '1rem' }}>
          No articles match your search or filters.
        </p>
      ) : (
        <div className="grid">
          {articles.map((a) => (
            <ArticleCard
              key={a.id}
              article={a}
              onOpen={onOpen}
              onToggleBookmark={onToggleBookmark}
              bookmarked={isBookmarked(a.id)}
              colors={colors}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleCard({ article, onOpen, onToggleBookmark, bookmarked, colors }) {
  const date = new Date(article.publishedAt).toLocaleString();
  return (
    <article className="card">
      <div className="card-media">
        <img src={article.imageUrl} alt="" loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="badge" style={{ background: colors.secondary, color: '#333' }}>
            {article.category}
          </span>
          <span className="muted">{date}</span>
        </div>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-excerpt">{article.excerpt}</p>
      </div>
      <div className="card-actions">
        <button className="btn" onClick={() => onOpen(article)} aria-label="Open details">
          Read
        </button>
        <button
          className={`btn ${bookmarked ? 'btn-accent' : 'btn-outline'}`}
          onClick={() => onToggleBookmark(article)}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          style={{
            borderColor: colors.accent,
            color: bookmarked ? '#fff' : colors.accent,
            background: bookmarked ? colors.accent : 'transparent',
          }}
        >
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>
    </article>
  );
}

function ArticleModal({ article, onClose, onToggleBookmark, bookmarked, colors }) {
  const date = new Date(article.publishedAt).toLocaleString();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Article details">
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{article.title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-meta">
          <span className="badge" style={{ background: COLORS.secondary, color: '#333' }}>
            {article.category}
          </span>
          <span className="muted">
            {article.source} · {article.author} · {date}
          </span>
        </div>
        <div className="modal-media">
          <img src={article.imageUrl} alt="" />
        </div>
        <div className="modal-content">
          <p>{article.content}</p>
        </div>
        <div className="modal-actions">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: colors.primary }}
          >
            Open Source
          </a>
          <button
            className={`btn ${bookmarked ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => onToggleBookmark(article)}
            aria-pressed={bookmarked}
            style={{
              borderColor: colors.accent,
              color: bookmarked ? '#fff' : colors.accent,
              background: bookmarked ? colors.accent : 'transparent',
            }}
          >
            {bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer({ apiBaseUrl }) {
  return (
    <footer className="footer" aria-label="Footer">
      <span className="muted">
        API: {apiBaseUrl || 'Not configured (set REACT_APP_API_BASE_URL in .env)'}
      </span>
      <span className="muted">•</span>
      <span className="muted">© {new Date().getFullYear()} News Explorer</span>
    </footer>
  );
}

export default App;
