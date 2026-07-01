import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock fetch globally to prevent network requests during testing
(globalThis as any).fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: '1', category: 'Government & Elected Officials', title: 'Speaker of the House', name: 'Mike Johnson', contactRoute: 'Congressional contact page', status: 'Pending' }
    ])
  })
) as unknown as typeof fetch;

describe('Redistricting Outreach Dashboard', () => {
  beforeEach(() => {
    // Reset the theme attribute before each test
    document.documentElement.setAttribute('data-theme', 'dark');
  });

  it('renders the dashboard header', () => {
    render(<App />);
    expect(screen.getByText('Redistricting Outreach Dashboard')).toBeInTheDocument();
  });

  it('toggles the theme when the theme button is clicked', () => {
    render(<App />);
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
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search contacts...');
    
    // Assuming "Mike Johnson" is in the initial data
    await waitFor(() => {
      expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
    });
    
    // Type something that doesn't exist
    fireEvent.change(searchInput, { target: { value: 'NonExistentPerson123' } });
    expect(screen.queryByText('Mike Johnson')).not.toBeInTheDocument();
    expect(screen.getByText(/No contacts found matching/i)).toBeInTheDocument();
  });
});
