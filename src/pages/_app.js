import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import '@/styles/theme.css';
import '@/styles/motion.css';
import useVisitorNotification from '@/lib/useVisitorNotification';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Cursor from '@/components/motion/Cursor';

import DroneProvider from '@/components/drones/DroneProvider';

export default function App({ Component, pageProps }) {
  // Track visitor and send email notifications
  useVisitorNotification();

  return (
    <>
      <SmoothScroll />
      <DroneProvider>
        <Component {...pageProps} />
      </DroneProvider>
      <Cursor />
    </>
  );
}
