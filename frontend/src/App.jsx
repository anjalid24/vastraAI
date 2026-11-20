import { isDemo } from './services/demo.js';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

// Reset scroll position on every navigation.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // App-like screens manage their own full-height layout; skip the marketing
  // footer there to keep them focused.
  const hideFooter = ['/studio', '/dashboard', '/admin'].some((p) =>
    pathname.startsWith(p)
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}> Skip to content</a>
      <Navbar />
      <div className="prototype-notice" role="note"><strong>PORTFOLIO PREVIEW</strong><span>{isDemo ? 'No account, AI model, payments or messages. Pattern studies and moodboard changes stay in this page.' : 'Pattern generation and community are local prototypes. Account and material requests use your configured backend.'}</span></div>
      <main tabIndex={-1} id="main-content" className="flex-grow-1">
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
