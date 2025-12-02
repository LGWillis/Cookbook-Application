import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock;

// A simple test component to render inside the router
function TestPage() {
  return <div>Test Page</div>;
}

describe('App', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to unauthenticated
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the app component', () => {
    renderWithRouter(<App />);
    // Check for the logo text which should always be present
    expect(screen.getByText(/cookbook/i)).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('shows logout button when authenticated', () => {
    localStorageMock.getItem.mockImplementation((key) => 
      key === 'access' ? 'mock-token' : null
    );
    renderWithRouter(<App />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
