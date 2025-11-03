import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import CommandPalette from '../CommandPalette';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

describe('CommandPalette Component', () => {
  const mockRouter = {
    push: vi.fn(),
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  it('does not render when closed', () => {
    const { container } = render(<CommandPalette isOpen={false} onClose={() => {}} />);
    expect(container.querySelector('.command-palette')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<CommandPalette isOpen={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Command input')).toBeInTheDocument();
  });

  it('displays available commands', () => {
    render(<CommandPalette isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('open projects')).toBeInTheDocument();
    expect(screen.getByText('show contact')).toBeInTheDocument();
    expect(screen.getByText('about me')).toBeInTheDocument();
  });

  it('filters commands based on input', () => {
    render(<CommandPalette isOpen={true} onClose={() => {}} />);
    const input = screen.getByLabelText('Command input');
    
    fireEvent.change(input, { target: { value: 'project' } });
    
    expect(screen.getByText('open projects')).toBeInTheDocument();
    expect(screen.queryByText('show contact')).not.toBeInTheDocument();
  });

  it('navigates on command selection', () => {
    render(<CommandPalette isOpen={true} onClose={() => {}} />);
    const projectCommand = screen.getByText('open projects');
    
    fireEvent.click(projectCommand);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/projects');
  });

  it('closes on escape key', () => {
    const onClose = vi.fn();
    render(<CommandPalette isOpen={true} onClose={onClose} />);
    
    fireEvent.keyDown(window, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    const { container } = render(<CommandPalette isOpen={true} onClose={onClose} />);
    const overlay = container.querySelector('.command-palette-overlay');
    
    fireEvent.click(overlay);
    
    expect(onClose).toHaveBeenCalled();
  });
});
