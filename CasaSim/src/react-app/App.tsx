import { BrowserRouter as Router, Routes, Route } from "react-router";
import { LocalAuthProvider } from "@/react-app/hooks/useLocalAuth";
import { AccessibilityProvider } from "@/react-app/hooks/useAccessibility";
import LoginPage from "@/react-app/pages/Login";
import DashboardPage from "@/react-app/pages/Dashboard";
import SimulationPage from "@/react-app/pages/Simulation";
import SimulationResultsPage from "@/react-app/pages/SimulationResults";
import ProjectManagementPage from "@/react-app/pages/ProjectManagement";
import SavedProjectsPage from "@/react-app/pages/SavedProjects";
import UserAdminPage from "@/react-app/pages/UserAdmin";
import SettingsPage from "@/react-app/pages/Settings";
import ChatPage from "@/react-app/pages/Chat";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";

export default function App() {
  return (
    <AccessibilityProvider>
      <LocalAuthProvider>
        <Router>
          <div className="min-h-screen app-background">
            <div className="min-h-screen app-overlay text-white font-sans">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/simulation" element={
                  <ProtectedRoute>
                    <SimulationPage />
                  </ProtectedRoute>
                } />
                <Route path="/simulation-results" element={
                  <ProtectedRoute>
                    <SimulationResultsPage />
                  </ProtectedRoute>
                } />
                <Route path="/projects" element={
                  <ProtectedRoute>
                    <ProjectManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/saved-projects" element={
                  <ProtectedRoute>
                    <SavedProjectsPage />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute>
                    <UserAdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </LocalAuthProvider>
    </AccessibilityProvider>
  );
}
