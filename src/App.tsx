import React, { useState, useMemo } from 'react';
import { Search, Mail, Building, Users, Activity } from 'lucide-react';
import { contactData } from './data';
import type { Contact, ContactStatus } from './data';
import './index.css';

function App() {
  const [contacts, setContacts] = useState<Contact[]>(contactData);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (id: string) => {
    const statuses: ContactStatus[] = ['Pending', 'Drafted', 'Sent', 'Replied', 'Unresponsive'];
    setContacts(contacts.map(c => {
      if (c.id === id) {
        const currentIndex = statuses.indexOf(c.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...c, status: statuses[nextIndex] };
      }
      return c;
    }));
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      pending: contacts.filter(c => c.status === 'Pending').length,
      sent: contacts.filter(c => c.status === 'Sent' || c.status === 'Replied' || c.status === 'Unresponsive').length,
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
      <header className="header">
        <h1>Redistricting Outreach Dashboard</h1>
        <p>Tracking communication for the algorithm-based state voting districts project.</p>
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
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Click status badges to update
          </div>
        </div>

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
                      <button 
                        className={`status-badge status-${contact.status}`}
                        onClick={() => handleStatusChange(contact.id)}
                      >
                        {contact.status === 'Pending' && <div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor'}}></div>}
                        {contact.status}
                      </button>
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
      </div>
    </div>
  );
}

export default App;
