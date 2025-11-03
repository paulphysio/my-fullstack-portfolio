import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Typewriter from '../Typewriter';

describe('Typewriter Component', () => {
  it('renders without crashing', () => {
    render(<Typewriter text="Hello" speed={10} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays text progressively', async () => {
    render(<Typewriter text="Test" speed={10} />);
    const element = screen.getByRole('status');
    
    await waitFor(
      () => {
        expect(element.textContent).toContain('Test');
      },
      { timeout: 1000 }
    );
  });

  it('shows cursor by default', () => {
    const { container } = render(<Typewriter text="Hello" />);
    expect(container.querySelector('.cursor')).toBeInTheDocument();
  });

  it('handles multiple lines', async () => {
    render(<Typewriter text={['Line 1', 'Line 2']} speed={10} />);
    
    await waitFor(
      () => {
        const element = screen.getByRole('status');
        expect(element.textContent).toContain('Line 1');
        expect(element.textContent).toContain('Line 2');
      },
      { timeout: 2000 }
    );
  });

  it('calls onComplete callback', async () => {
    const onComplete = vi.fn();
    render(<Typewriter text="Done" speed={10} onComplete={onComplete} />);
    
    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });
});
