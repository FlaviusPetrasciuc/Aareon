import { render, screen, fireEvent } from '@testing-library/react';
import JobDescriptionPage from './page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: mockStorage, writable: true });

beforeEach(() => mockStorage.clear());

test('renders the page heading', () => {
  render(<JobDescriptionPage />);
  expect(screen.getByText('Create new job posting')).toBeInTheDocument();
});

test('Next button is disabled when form is empty', () => {
  render(<JobDescriptionPage />);
  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).toBeDisabled();
});

test('Next button is enabled when summary has content', () => {
  render(<JobDescriptionPage />);
  const textareas = screen.getAllByRole('textbox');
  fireEvent.change(textareas[0], { target: { value: 'Some summary text' } });
  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).not.toBeDisabled();
});

test('Next button is enabled when responsibilities has content', () => {
  render(<JobDescriptionPage />);
  const textareas = screen.getAllByRole('textbox');
  fireEvent.change(textareas[1], { target: { value: 'Some responsibilities' } });
  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).not.toBeDisabled();
});

test('switching to NL changes heading text', () => {
  render(<JobDescriptionPage />);
  const nlButton = screen.getByRole('button', { name: 'NL' });
  fireEvent.click(nlButton);
  expect(screen.getByText('Nieuwe vacature aanmaken')).toBeInTheDocument();
});
