import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Mail, Building, Users, Activity, Sun, Moon, Code, Lock, Unlock, Loader2, Landmark, Megaphone, MessageSquare, X, RotateCcw, Check } from 'lucide-react';
import type { Contact, ContactStatus } from './data';
import './index.css';

const REPO_OWNER = 'howlcipher';
const REPO_NAME = 'redistricting-map-contact';
const FILE_PATH = 'public/data.json';

function App() {
  // --- Core Application State ---
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // GitHub Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [githubToken, setGithubToken] = useState(localStorage.getItem('gh_token') || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Message Modal State
  const [selectedMessageContact, setSelectedMessageContact] = useState<Contact | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Updates the global data-theme attribute on the root HTML element
   * to trigger CSS variable swaps for light/dark mode.
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Fetches the initial data payload on component mount.
   * If logged in (githubToken exists), bypasses cache and hits the GitHub API 
   * to get the most up-to-date data.json file directly from the repo.
   */
  useEffect(() => {
    // Fetch from GitHub API if authenticated, else fetch static
    const timestamp = new Date().getTime();
    const fetchUrl = githubToken 
      ? `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=main&t=${timestamp}` 
      : `${import.meta.env.BASE_URL}data.json?t=${timestamp}`;

    const headers: HeadersInit = githubToken ? { Authorization: `token ${githubToken}` } : {};

    fetch(fetchUrl, { headers })
      .then(res => res.json())
      .then(data => {
        if (githubToken && data.content) {
          // Decode base64 if coming from GH API
          const decoded = decodeURIComponent(escape(atob(data.content)));
          setContacts(JSON.parse(decoded));
        } else {
          setContacts(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load contacts:', err);
        setIsLoading(false);
      });
  }, [githubToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gh_token', githubToken);
    setShowAuthModal(false);
    window.location.reload(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_token');
    setGithubToken('');
    window.location.reload();
  };

  /**
   * Commits and pushes the modified contacts list back to GitHub.
   * It performs a GET request to fetch the latest file SHA to prevent 409 commit conflicts,
   * then encodes the updated JSON to Base64 and executes a PUT request.
   * 
   * @param updatedContacts The new array of contacts to persist.
   */
  const updateStatusOnGithub = async (updatedContacts: Contact[]) => {
    if (!githubToken) return;
    setIsSaving(true);
    try {
      // 1. Get current SHA
      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: { Authorization: `token ${githubToken}` }
      });
      const fileData = await res.json();
      const sha = fileData.sha;

      // 2. Prepare content
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedContacts, null, 2))));

      // 3. PUT request
      const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update contact status',
          content: content,
          sha: sha
        })
      });
      
      if (!putRes.ok) {
        throw new Error(`GitHub API returned ${putRes.status}`);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save to GitHub:', err);
      alert('Failed to save changes. Check your token permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Debounces the GitHub API push to prevent 409 conflicts from rapid clicking.
   */
  const queueSaveToGithub = (updatedContacts: Contact[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      updateStatusOnGithub(updatedContacts);
    }, 750);
  };

  /**
   * Cycles a contact's outreach status sequentially:
   * Pending -> Drafted -> Sent -> Replied -> Unresponsive -> Undeliverable
   * Updates state optimistically before pushing to GitHub.
   * 
   * @param id The unique identifier of the contact.
   */
  const handleStatusChange = (id: string) => {
    if (!githubToken) {
      alert("You must be logged in as an Admin to change statuses. Click Login in the top right.");
      return;
    }
    
    setContacts(prev => {
      const statuses: ContactStatus[] = ['Pending', 'Drafted', 'Sent', 'Replied', 'Unresponsive', 'Undeliverable'];
      const updatedContacts = prev.map(c => {
        if (c.id === id) {
          const currentIndex = statuses.indexOf(c.status);
          const nextIndex = (currentIndex + 1) % statuses.length;
          return { ...c, status: statuses[nextIndex] };
        }
        return c;
      });
      
      queueSaveToGithub(updatedContacts);
      return updatedContacts;
    });
  };

  /**
   * Saves the public response text for a 'Replied' contact and persists it to GitHub.
   */
  const saveMessage = () => {
    if (!githubToken || !selectedMessageContact) return;
    
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedMessageContact.id) {
        return { ...c, replyMessage: editingMessage || '' };
      }
      return c;
    });
    
    setContacts(updatedContacts);
    updateStatusOnGithub(updatedContacts);
    setSelectedMessageContact(null);
    setEditingMessage(null);
  };

  /**
   * Memoized filtered list of contacts matching the search query 
   * across Name, Title, and Category.
   */
  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return [];
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  /**
   * Memoized dashboard statistics to prevent unnecessary recalculation on every render.
   */
  const stats = useMemo(() => {
    if (!Array.isArray(contacts)) return { total: 0, pending: 0, sent: 0, replied: 0 };
    return {
      total: contacts.length,
      pending: contacts.filter(c => c.status === 'Pending').length,
      sent: contacts.filter(c => c.status === 'Sent' || c.status === 'Replied' || c.status === 'Unresponsive' || c.status === 'Undeliverable').length,
      replied: contacts.filter(c => c.status === 'Replied').length
    };
  }, [contacts]);

  // Group contacts by category
  const groupedContacts = useMemo(() => {
    const groups = {} as Record<string, Contact[]>;
    filteredContacts.forEach(c => {
      if (!groups[c.category]) {
        groups[c.category] = [];
      }
      groups[c.category].push(c);
    });
    return groups;
  }, [filteredContacts]);

  return (
    <div className="dashboard-container">
      {saveSuccess && (
        <div className="toast-notification">
          <Check size={16} /> Saved to Database
        </div>
      )}

      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Admin Login</h2>
            <p>Enter a GitHub Personal Access Token with repo access to edit statuses.</p>
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                value={githubToken} 
                onChange={(e) => setGithubToken(e.target.value)} 
                placeholder="ghp_..." 
                className="auth-input"
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAuthModal(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Save Token</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMessageContact && (
        <div className="modal-overlay" onClick={() => setSelectedMessageContact(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '600px' }}>
            <button 
              onClick={() => setSelectedMessageContact(null)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={24} />
            </button>
            <h2>Response from {selectedMessageContact.name}</h2>
            <p>{selectedMessageContact.title}</p>
            
            {githubToken ? (
              <div style={{ marginTop: '1.5rem' }}>
                <textarea 
                  value={editingMessage || ''} 
                  onChange={(e) => setEditingMessage(e.target.value)} 
                  placeholder="Paste their response here..." 
                  className="auth-input"
                  style={{ minHeight: '150px', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                />
                <div className="modal-actions">
                  <button onClick={() => setSelectedMessageContact(null)} className="btn-cancel">Cancel</button>
                  <button onClick={saveMessage} className="btn-save">
                    {isSaving ? <Loader2 size={16} className="spin" style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> : null}
                    Save Message
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '1.5rem', background: 'var(--input-bg)', border: '2px solid var(--card-border)', padding: '1rem', borderRadius: '2px', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                {selectedMessageContact.replyMessage || (
                  <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    No public response message has been attached yet.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="header">
        <div className="header-actions">
          {githubToken ? (
             <button onClick={handleLogout} className="icon-btn auth-btn" aria-label="Logout" title="Logout">
              <Unlock size={18} /> Admin
             </button>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="icon-btn auth-btn" aria-label="Login" title="Login">
              <Lock size={18} /> Login
            </button>
          )}
          <button 
            className="icon-btn theme-toggle" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <h1>Redistricting Outreach Dashboard</h1>
        <p style={{ marginTop: '0.5rem' }}>
          Tracking communication for the <a href="https://howlcipher.github.io/redistricting-map/" target="_blank" rel="noreferrer" className="highlight-link">algorithm-based state voting districts</a> project.
        </p>
        
        <div className="header-links">
          <a href="https://github.com/howlcipher/redistricting-map-contact" target="_blank" rel="noreferrer" className="repo-link">
            <Code size={16} /> View on GitHub
          </a>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Contacts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Outreach</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.sent}</div>
          <div className="stat-label">Messages Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.replied}</div>
          <div className="stat-label">Responses Received</div>
        </div>
      </div>

      <div className="table-container">
        <div className="controls">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isSaving && <Loader2 size={14} className="spin" />}
            {githubToken ? 'Click status badges to update' : 'Read-only mode (Login to edit)'}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={24} className="spin" style={{ margin: '0 auto 1rem' }} />
            Loading contacts...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Contact Details</th>
                <th>Contact Route</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedContacts).map(([category, catContacts]) => (
                <React.Fragment key={category}>
                  <tr className="category-row">
                    <td colSpan={3}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {category === 'Government & Elected Officials' && <Building size={16} />}
                        {category === 'Media & Data Analytics' && <Activity size={16} />}
                        {category === 'Independent Media & Organizations' && <Users size={16} />}
                        {category === 'Political Parties' && <Landmark size={16} />}
                        {category === 'Candidates for Office' && <Megaphone size={16} />}
                        {category}
                      </div>
                    </td>
                  </tr>
                  {catContacts.map(contact => (
                    <tr key={contact.id}>
                      <td>
                        <div className="contact-name">{contact.name}</div>
                        <div className="contact-title">{contact.title}</div>
                      </td>
                      <td>
                        <div className="contact-route">
                          <Mail size={14} style={{ color: 'var(--accent-color)' }}/> 
                          {contact.contactRoute}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <button 
                            className={`status-badge status-${contact.status}`}
                            onClick={() => handleStatusChange(contact.id)}
                            style={{ cursor: githubToken ? 'pointer' : 'default' }}
                            title={githubToken ? 'Click to change status' : 'Login to change status'}
                          >
                            {contact.status === 'Pending' && <div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor'}}></div>}
                            {contact.status}
                          </button>
                          
                          {contact.status === 'Replied' && (
                            <button 
                              className="icon-btn" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                              onClick={() => {
                                setSelectedMessageContact(contact);
                                setEditingMessage(contact.replyMessage || '');
                              }}
                              title="View/Edit Response"
                            >
                              <MessageSquare size={14} /> View
                            </button>
                          )}

                          {githubToken && contact.status !== 'Pending' && (
                            <button 
                              className="icon-btn" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                              onClick={() => {
                                setContacts(prev => {
                                  const updatedContacts = prev.map(c => 
                                    c.id === contact.id ? { ...c, status: 'Pending' as ContactStatus } : c
                                  );
                                  queueSaveToGithub(updatedContacts);
                                  return updatedContacts;
                                });
                              }}
                              title="Revert to Pending"
                            >
                              <RotateCcw size={14} /> Revert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No contacts found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
