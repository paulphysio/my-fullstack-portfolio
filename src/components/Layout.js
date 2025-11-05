import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CommandPalette from './CommandPalette';
import PageLoader from './PageLoader';

export default function Layout({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className={`app-container theme-${theme}`}>
      <header className="main-header">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-bracket">{'['}</span>
            <span className="logo-text">PM</span>
            <span className="logo-bracket">{']'}</span>
          </Link>

          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${router.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button 
              className="command-trigger"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
            >
              <kbd>Ctrl</kbd>+<kbd>K</kbd>
            </button>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <p>&copy; 2024 Paul Madu. Built with Next.js, React & Terminal vibes.</p>
          </div>
          <div className="footer-section">
            <a href="https://github.com/paulphysio" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/paul-madu-a69235222" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://x.com/physiodev_1" target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="mailto:obinnap350@gmail.com">Email</a>
          </div>
        </div>
      </footer>

      <PageLoader />

      <CommandPalette 
        isOpen={paletteOpen} 
        onClose={() => setPaletteOpen(false)} 
      />

      {/* Background effects */}
      <div className="matrix-bg" aria-hidden="true"></div>
    </div>
  );
}
