import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../services/api'; // We will mock this
import { useAuth } from '../context/AuthContext'; // We will mock this

// ✅ Mocking the API service and Auth Context
vi.mock('../services/api');
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Form Interaction Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return for useAuth
    useAuth.mockReturnValue({
      login: vi.fn(),
    });
  });

  // Scenario 1: Typing Test
  it('updates input values when the user types', async () => {
    const user = userEvent.setup(); // ✅ setup() called inside test
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // ✅ Every userEvent call is awaited
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Scenario 2: Happy Path Submission
  it('calls the API with correct data on valid submit', async () => {
    const user = userEvent.setup();
    
    // Mock a successful API response
    api.post.mockResolvedValue({ data: { user: { name: 'Test' }, token: 'abc' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'user@cri8tor.com');
    await user.type(passwordInput, 'securePass');
    await user.click(submitBtn);

    // ✅ Assert using toHaveBeenCalledWith and checking object shape
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@cri8tor.com',
      password: 'securePass'
    });
  });

  // Scenario 3: Validation Failure Path
  it('shows error messages and does not call API if fields are empty', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /login/i });

    // Click without filling anything
    await user.click(submitBtn);

    // ✅ Assert error message appears (your component uses <span> for errors)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    
    // ✅ Ensure mock handler was NOT called
    expect(api.post).not.toHaveBeenCalled();
  });
});