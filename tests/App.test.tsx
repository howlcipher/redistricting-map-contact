import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import React from 'react';

// Mock fetch globally to prevent network requests during testing
const mockContacts = [
  { id: '1', category: 'Government & Elected Officials', title: 'Speaker of the House', name: 'Mike Johnson', contactRoute: 'Contact form', status: 'Pending' },
  { id: '2', category: 'Independent Media & Organizations', title: 'Host', name: 'John Oliver', contactRoute: 'info@hbo.com', status: 'Replied', replyMessage: 'We will cover this' }
];

(globalThis as any).fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockContacts)
  })
) as unknown as typeof fetch;

describe('Redistricting Outreach Dashboard', () => {
  beforeEach(() => {
    // Reset the theme attribute before each test
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderAppAndWait = async () => {
    const utils = render(<App />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading contacts/i)).not.toBeInTheDocument();
    });
    return utils;
  };

  it('renders the dashboard header and loads contacts', async () => {
    await renderAppAndWait();
    expect(screen.getByText('Redistricting Outreach Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
    expect(screen.getByText('John Oliver')).toBeInTheDocument();
  });

  it('toggles the theme when the theme button is clicked', async () => {
    await renderAppAndWait();
    const toggleButton = screen.getByLabelText('Toggle theme');
    
    // Initial state should be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // Click to toggle to light
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    
    // Click to toggle back to dark
    fireEvent.click(toggleButton);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('filters contacts based on search query', async () => {
    await renderAppAndWait();
    const searchInput = screen.getByPlaceholderText('Search contacts...');
    
    // Type a query that matches one contact
    fireEvent.change(searchInput, { target: { value: 'Mike' } });
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
    expect(screen.queryByText('John Oliver')).not.toBeInTheDocument();
    
    // Type something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'NonExistentPerson123' } });
    expect(screen.queryByText('Mike Johnson')).not.toBeInTheDocument();
    expect(screen.getByText(/No contacts found matching/i)).toBeInTheDocument();
  });

  it('displays the View button for Replied contacts and opens modal', async () => {
    await renderAppAndWait();
    
    // Find the view button for the replied contact
    const viewButtons = screen.getAllByTitle('View/Edit Response');
    expect(viewButtons.length).toBeGreaterThan(0);
    
    // Click the view button
    fireEvent.click(viewButtons[0]);
    
    // Verify modal opens with the message
    expect(screen.getByText('Response from John Oliver')).toBeInTheDocument();
    expect(screen.getByText('We will cover this')).toBeInTheDocument();
  });

  it('renders login form and logs in as Admin', async () => {
    await renderAppAndWait();
    
    // Initially Add Contact shouldn't be visible
    expect(screen.queryByText('Add Contact')).not.toBeInTheDocument();
    
    // Click login
    fireEvent.click(screen.getByText('Login'));
    
    // Wait for the modal and type the token
    const tokenInput = screen.getByPlaceholderText('ghp_...');
    fireEvent.change(tokenInput, { target: { value: 'test-token' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Token'));
    
    // Wait for Add Contact to appear
    await waitFor(() => {
      expect(screen.getByText('Add Contact')).toBeInTheDocument();
    });
  });

  it('opens Add Contact modal when Admin', async () => {
    await renderAppAndWait();
    
    // Login flow
    fireEvent.click(screen.getByText('Login'));
    const tokenInput = screen.getByPlaceholderText('ghp_...');
    fireEvent.change(tokenInput, { target: { value: 'test-token' } });
    fireEvent.click(screen.getByText('Save Token'));
    
    await waitFor(() => {
      expect(screen.getByText('Add Contact')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Add Contact'));
    
    expect(screen.getByText('Add New Contact')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Independent Media & Organizations')).toBeInTheDocument();
  });
});
