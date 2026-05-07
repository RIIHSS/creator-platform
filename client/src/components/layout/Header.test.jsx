import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest'; // Using vitest (standard for Vite)
import '@testing-library/jest-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

// 1. Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Header Component', () => {
  
  // Test Case 1: Uses getByText and jest-dom matcher
  it('renders the branding logo text', () => {
    // Mock state: Logged Out
    useAuth.mockReturnValue({
      isAuthenticated: () => false,
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoElement = screen.getByText(/Creator Platform/i);
    expect(logoElement).toBeInTheDocument();
  });

  // Test Case 2: Uses getByRole (Accessibility query)
  it('renders a navigation landmark', () => {
    useAuth.mockReturnValue({
      isAuthenticated: () => false,
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  // Test Case 3: Verifies user-visible behavior when Logged In
  it('displays personalized greeting and Logout button when authenticated', () => {
    // Mock state: Logged In
    useAuth.mockReturnValue({
      isAuthenticated: () => true,
      user: { name: 'John Doe' },
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Verify user name is shown
    expect(screen.getByText(/Hi, John Doe/i)).toBeInTheDocument();
    
    // Verify Logout button exists using getByRole
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();
  });

  // Test Case 4: Verifies Login/Register are shown when Logged Out
  it('shows Login and Register links when not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: () => false,
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    
    // Ensure Dashboard is NOT visible
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });
});