import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './components/ui/ToastContext';
import { OfflineProvider } from './context/OfflineContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';

// Lazy-loaded page components for fast initial load time
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateTrip = lazy(() => import('./pages/CreateTrip'));
const MyTrips = lazy(() => import('./pages/MyTrips'));
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder'));
const ItineraryView = lazy(() => import('./pages/ItineraryView'));
const ActivitySearch = lazy(() => import('./pages/ActivitySearch'));
const BudgetView = lazy(() => import('./pages/BudgetView'));
const SharedItinerary = lazy(() => import('./pages/SharedItinerary'));
const Profile = lazy(() => import('./pages/Profile'));
const Community = lazy(() => import('./pages/Community'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AutoPlanner = lazy(() => import('./pages/AutoPlanner'));
const PlacesToVisit = lazy(() => import('./pages/PlacesToVisit'));
const CitySearch = lazy(() => import('./pages/CitySearch'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

function PageLoader() {
  return (
    <div className="page-loading">
      <div className="spinner"></div>
      <p>Loading GlobeTrotter...</p>
    </div>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        <ErrorBoundary title="Page Load Warning">
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <OfflineProvider>
        <AuthProvider>
          <LanguageProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/share/:shareId" element={<Layout><SharedItinerary /></Layout>} />
                  <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
                  <Route path="/terms" element={<Layout><TermsOfService /></Layout>} />

                  {/* Public landing page — redirects to /dashboard if already logged in */}
                  <Route path="/" element={<LandingPage />} />

                  <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                  <Route path="/planner" element={<ProtectedRoute><Layout><AutoPlanner /></Layout></ProtectedRoute>} />
                  <Route path="/places" element={<ProtectedRoute><Layout><PlacesToVisit /></Layout></ProtectedRoute>} />
                  <Route path="/city-search" element={<ProtectedRoute><Layout><CitySearch /></Layout></ProtectedRoute>} />
                  <Route path="/trips" element={<ProtectedRoute><Layout><MyTrips /></Layout></ProtectedRoute>} />
                  <Route path="/trips/new" element={<ProtectedRoute><Layout><CreateTrip /></Layout></ProtectedRoute>} />
                  <Route path="/create-trip" element={<ProtectedRoute><Layout><CreateTrip /></Layout></ProtectedRoute>} />
                  <Route path="/trips/:tripId" element={<ProtectedRoute><Layout><ItineraryView /></Layout></ProtectedRoute>} />
                  <Route path="/trips/:tripId/builder" element={<ProtectedRoute><Layout><ItineraryBuilder /></Layout></ProtectedRoute>} />
                  <Route path="/trips/:tripId/budget" element={<ProtectedRoute><Layout><BudgetView /></Layout></ProtectedRoute>} />
                  <Route path="/activities" element={<ProtectedRoute><Layout><ActivitySearch /></Layout></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
                  <Route path="/community" element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />

                  {/* Catch-all: show a proper 404 page instead of silently redirecting */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </OfflineProvider>
    </ToastProvider>
  );
}

