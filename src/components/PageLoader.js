import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    'Initializing connection...',
    'Compiling shaders...',
    'Loading quantum state...',
    'Decrypting payload...',
    'Establishing secure channel...',
    'Bootstrapping environment...',
    'Synchronizing data streams...',
    'Optimizing neural pathways...',
    'Rendering interface...',
    'Almost there...',
  ];

  useEffect(() => {
    let messageInterval;
    let progressInterval;
    let messageIndex = 0;

    const handleStart = (url) => {
      if (url !== router.asPath) {
        setLoading(true);
        setProgress(0);
        setLoadingText(loadingMessages[0]);
        messageIndex = 0;

        // Cycle through loading messages
        messageInterval = setInterval(() => {
          messageIndex = (messageIndex + 1) % loadingMessages.length;
          setLoadingText(loadingMessages[messageIndex]);
        }, 200);

        // Simulate progress
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 15;
          });
        }, 150);
      }
    };

    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      }, 300);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-container">
        <div className="loader-terminal">
          <div className="loader-header">
            <div className="loader-controls">
              <span className="control control-close"></span>
              <span className="control control-minimize"></span>
              <span className="control control-maximize"></span>
            </div>
            <div className="loader-title">system@loading:~$</div>
          </div>
          
          <div className="loader-body">
            <div className="loader-ascii">
              <pre className="ascii-art">
{`  ██▓     ▒█████   ▄▄▄      ▓█████▄  ██▓ ███▄    █   ▄████ 
  ▓██▒    ▒██▒  ██▒▒████▄    ▒██▀ ██▌▓██▒ ██ ▀█   █  ██▒ ▀█▒
  ▒██░    ▒██░  ██▒▒██  ▀█▄  ░██   █▌▒██▒▓██  ▀█ ██▒▒██░▄▄▄░
  ▒██░    ▒██   ██░░██▄▄▄▄██ ░▓█▄   ▌░██░▓██▒  ▐▌██▒░▓█  ██▓
  ░██████▒░ ████▓▒░ ▓█   ▓██▒░▒████▓ ░██░▒██░   ▓██░░▒▓███▀▒
  ░ ▒░▓  ░░ ▒░▒░▒░  ▒▒   ▓▒█░ ▒▒▓  ▒ ░▓  ░ ▒░   ▒ ▒  ░▒   ▒ 
  ░ ░ ▒  ░  ░ ▒ ▒░   ▒   ▒▒ ░ ░ ▒  ▒  ▒ ░░ ░░   ░ ▒░  ░   ░ 
    ░ ░   ░ ░ ░ ▒    ░   ▒    ░ ░  ░  ▒ ░   ░   ░ ░ ░ ░   ░ 
      ░  ░    ░ ░        ░  ░   ░     ░           ░       ░ `}
              </pre>
            </div>

            <div className="loader-status">
              <div className="status-line">
                <span className="prompt">→</span>
                <span className="status-text">{loadingText}</span>
                <span className="cursor-blink">_</span>
              </div>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    <div className="progress-glitch"></div>
                  </div>
                </div>
                <div className="progress-text">
                  {Math.round(Math.min(progress, 100))}%
                </div>
              </div>

              <div className="loader-metrics">
                <span className="metric">
                  <span className="metric-label">CPU:</span>
                  <span className="metric-value">{Math.floor(Math.random() * 40 + 60)}%</span>
                </span>
                <span className="metric">
                  <span className="metric-label">MEM:</span>
                  <span className="metric-value">{Math.floor(Math.random() * 30 + 50)}%</span>
                </span>
                <span className="metric">
                  <span className="metric-label">NET:</span>
                  <span className="metric-value">{Math.floor(Math.random() * 500 + 100)}ms</span>
                </span>
              </div>
            </div>

            <div className="loader-scanline"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
