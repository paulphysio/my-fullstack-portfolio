// Custom hook to track site visits and send notifications
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function useVisitorNotification() {
  const router = useRouter();
  const notifiedPages = useRef(new Set());

  useEffect(() => {
    const sendNotification = async () => {
      // Only send notification once per page per session
      const currentPath = router.asPath;
      
      if (notifiedPages.current.has(currentPath)) {
        return;
      }

      // Skip notification in development mode unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_DEV_NOTIFICATIONS) {
        return;
      }

      try {
        const response = await fetch('/api/visitor-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: currentPath,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          notifiedPages.current.add(currentPath);
        }
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Failed to send visitor notification:', error);
      }
    };

    // Send notification after a short delay to ensure page is loaded
    const timer = setTimeout(sendNotification, 2000);

    return () => clearTimeout(timer);
  }, [router.asPath]);
}
