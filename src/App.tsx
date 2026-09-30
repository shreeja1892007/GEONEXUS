import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RegistrationProvider } from './context/RegistrationContext';
import { GovernmentRegistrationProvider } from './context/GovernmentRegistrationContext';
import { ApplicationProvider } from './context/ApplicationContext';

// Pages — Public
import { HomePage } from './pages/HomePage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';
import { GovernmentLoginPage } from './pages/GovernmentLoginPage';

// Citizen Registration Steps
import { Step1Personal } from './pages/registration/Step1Personal';
import { Step2Aadhaar } from './pages/registration/Step2Aadhaar';
import { Step3Password } from './pages/registration/Step3Password';
import { Step4Success } from './pages/registration/Step4Success';

// Government Registration
import { Step1OfficialDetails } from './pages/government/Step1OfficialDetails';
import { Step2VerifyIdentity } from './pages/government/Step2VerifyIdentity';
import { Step3AccessStatus } from './pages/government/Step3AccessStatus';
import { Step4CreateGovPassword } from './pages/government/Step4CreateGovPassword';
import { Step5GovAccountSuccess } from './pages/government/Step5GovAccountSuccess';

// Route Guards
import { CitizenProtectedRoute } from './components/auth/CitizenProtectedRoute';
import { GovernmentProtectedRoute } from './components/auth/GovernmentProtectedRoute';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';

// Citizen Authenticated Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { ParcelExplorerPage } from './pages/citizen/ParcelExplorerPage';
import { ParcelProfilePage } from './pages/citizen/ParcelProfilePage';
import { Parcel360Page } from './pages/citizen/Parcel360Page';
import { MyPropertiesPage } from './pages/citizen/MyPropertiesPage';
import { ApplicationsPage } from './pages/citizen/ApplicationsPage';
import { NewApplicationPage } from './pages/citizen/NewApplicationPage';
import { ApplicationDetailPage } from './pages/citizen/ApplicationDetailPage';
import { TransactionsPage } from './pages/citizen/TransactionsPage';
import { DocumentsPage } from './pages/citizen/DocumentsPage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Government Authenticated Pages
import { GovernmentDashboardPlaceholder } from './pages/government/GovernmentDashboardPlaceholder';
import { GovernmentRequestsPage } from './pages/government/GovernmentRequestsPage';
import { GovernmentRequestDetailPage } from './pages/government/GovernmentRequestDetailPage';
import { GovernmentGISExplorer } from './pages/government/GovernmentGISExplorer';
import { GovernmentParcel360Page } from './pages/government/GovernmentParcel360Page';
import { GovernmentWorkflowsPage } from './pages/government/GovernmentWorkflowsPage';
import { GovernmentAnalyticsPage } from './pages/government/GovernmentAnalyticsPage';
import { GovernmentAlertsPage } from './pages/government/GovernmentAlertsPage';
import { GovernmentDocumentsPage } from './pages/government/GovernmentDocumentsPage';
import { GovernmentReportsPage } from './pages/government/GovernmentReportsPage';
import { GovernmentNotificationsPage } from './pages/government/GovernmentNotificationsPage';
import { GovernmentProfilePage } from './pages/government/GovernmentProfilePage';
import { AdminGovernmentAccessPage } from './pages/admin/AdminGovernmentAccessPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RegistrationProvider>
          <GovernmentRegistrationProvider>
            <ApplicationProvider>
              <Routes>
                {/* Landing / Home */}
                <Route path="/" element={<HomePage />} />

                {/* Citizen Portal — Public */}
                <Route path="/citizen/login" element={<CitizenLoginPage />} />
                <Route
                  path="/citizen/register"
                  element={<Navigate to="/citizen/register/personal" replace />}
                />
                <Route path="/citizen/register/personal" element={<Step1Personal />} />
                <Route path="/citizen/register/aadhaar" element={<Step2Aadhaar />} />
                <Route path="/citizen/register/password" element={<Step3Password />} />
                <Route path="/citizen/register/success" element={<Step4Success />} />

                {/* Citizen Portal — Protected */}
                <Route element={<CitizenProtectedRoute />}>
                  <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                  <Route path="/citizen/map" element={<ParcelExplorerPage />} />
                  <Route path="/citizen/parcel/:ulpin" element={<ParcelProfilePage />} />
                  <Route path="/citizen/parcel/:ulpin/360" element={<Parcel360Page />} />
                  <Route path="/citizen/properties" element={<MyPropertiesPage />} />
                  <Route path="/citizen/applications" element={<ApplicationsPage />} />
                  <Route path="/citizen/applications/new" element={<NewApplicationPage />} />
                  <Route path="/citizen/applications/:applicationId" element={<ApplicationDetailPage />} />
                  <Route path="/citizen/transactions" element={<TransactionsPage />} />
                  <Route path="/citizen/documents" element={<DocumentsPage />} />
                  <Route path="/citizen/notifications" element={<NotificationsPage />} />
                  <Route path="/citizen/profile" element={<ProfilePage />} />
                </Route>

                {/* Government Official Portal — Public */}
                <Route path="/government/login" element={<GovernmentLoginPage />} />
                <Route
                  path="/government/register"
                  element={<Navigate to="/government/register/official-details" replace />}
                />
                <Route
                  path="/government/register/official-details"
                  element={<Step1OfficialDetails />}
                />
                <Route
                  path="/government/register/verification"
                  element={<Step2VerifyIdentity />}
                />
                <Route
                  path="/government/register/status"
                  element={<Step3AccessStatus />}
                />
                <Route
                  path="/government/register/password"
                  element={<Step4CreateGovPassword />}
                />
                <Route
                  path="/government/register/success"
                  element={<Step5GovAccountSuccess />}
                />

                {/* Government Access Administration — Protected */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin/government-access" element={<AdminGovernmentAccessPage />} />
                </Route>

                {/* Government Official Portal — Protected */}
                <Route element={<GovernmentProtectedRoute />}>
                  <Route path="/government/dashboard" element={<GovernmentDashboardPlaceholder />} />
                  <Route path="/government/requests" element={<GovernmentRequestsPage />} />
                  <Route path="/government/requests/:applicationId" element={<GovernmentRequestDetailPage />} />
                  <Route path="/government/gis" element={<GovernmentGISExplorer />} />
                  <Route path="/government/parcel/:parcelId/360" element={<GovernmentParcel360Page />} />
                  <Route path="/government/workflows" element={<GovernmentWorkflowsPage />} />
                  <Route path="/government/analytics" element={<GovernmentAnalyticsPage />} />
                  <Route path="/government/alerts" element={<GovernmentAlertsPage />} />
                  <Route path="/government/documents" element={<GovernmentDocumentsPage />} />
                  <Route path="/government/reports" element={<GovernmentReportsPage />} />
                  <Route path="/government/notifications" element={<GovernmentNotificationsPage />} />
                  <Route path="/government/profile" element={<GovernmentProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ApplicationProvider>
          </GovernmentRegistrationProvider>
        </RegistrationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
