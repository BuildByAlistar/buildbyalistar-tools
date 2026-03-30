import { Navigate, Route, Routes } from "react-router-dom";
import PlatformShell from "../components/layout/PlatformShell";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../modules/auth/LoginPage";
import ContentToolsPage from "../modules/content/ContentToolsPage";
import DashboardPage from "../modules/dashboard/DashboardPage";
import HomePage from "../modules/home/HomePage";
import ImageToolsPage from "../modules/image/ImageToolsPage";
import PdfToolsPage from "../modules/pdf/PdfToolsPage";
import TemplatesPage from "../modules/templates/TemplatesPage";
import TemplateLibraryPage from "../modules/templates/TemplateLibraryPage";
import ProposalGeneratorPage from "../modules/templates/tools/proposal-generator/ProposalGeneratorPage";
import InvitationGeneratorPage from "../modules/templates/tools/invitation-generator/InvitationGeneratorPage";
import EmailGeneratorPage from "../modules/templates/tools/email-generator/EmailGeneratorPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PlatformShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/library" element={<TemplateLibraryPage />} />
        <Route path="/templates/proposal-generator" element={<ProposalGeneratorPage />} />
        <Route path="/templates/invitation-generator" element={<InvitationGeneratorPage />} />
        <Route path="/templates/email-generator" element={<EmailGeneratorPage />} />
        <Route path="/pdf" element={<PdfToolsPage />} />
        <Route path="/image" element={<ImageToolsPage />} />
        <Route path="/content" element={<ContentToolsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
