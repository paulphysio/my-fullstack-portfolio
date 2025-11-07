import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import '@/styles/theme.css';
import useVisitorNotification from '@/lib/useVisitorNotification';

export default function App({ Component, pageProps }) {
  // Track visitor and send email notifications
  useVisitorNotification();
  
  return <Component {...pageProps} />;
}
