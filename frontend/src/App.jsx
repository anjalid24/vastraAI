import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

// Reset scroll position on every navigation.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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
      <Navbar />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
