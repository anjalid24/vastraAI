import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import DesignStudio from '../pages/DesignStudio/DesignStudio.jsx';
import Community from '../pages/Community/Community.jsx';
import Encyclopedia from '../pages/Encyclopedia/Encyclopedia.jsx';
import EncyclopediaArticle from '../pages/Encyclopedia/EncyclopediaArticle.jsx';
import Marketplace from '../pages/Marketplace/Marketplace.jsx';
import Materials from '../pages/Materials/Materials.jsx';
import Pricing from '../pages/Pricing/Pricing.jsx';
import Subscription from '../pages/Subscription/Subscription.jsx';
import Profile from '../pages/Profile/Profile.jsx';
import Admin from '../pages/Admin/Admin.jsx';
import NotFound from '../pages/NotFound.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';

// Single source of truth for the app's routes. Public pages are open;
// protected pages sit behind ProtectedRoute (some role-restricted).
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/community" element={<Community />} />
      <Route path="/encyclopedia" element={<Encyclopedia />} />
      <Route path="/encyclopedia/:slug" element={<EncyclopediaArticle />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/subscription" element={<Subscription />} />

      {/* Authenticated */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studio"
        element={
          <ProtectedRoute>
            <DesignStudio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
