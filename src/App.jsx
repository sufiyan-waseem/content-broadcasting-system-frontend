import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import UploadContentPage from '@/pages/teacher/UploadContentPage';
import MyContentPage from '@/pages/teacher/MyContentPage';
import PrincipalDashboard from '@/pages/principal/PrincipalDashboard';
import PendingApprovalsPage from '@/pages/principal/PendingApprovalsPage';
import AllContentPage from '@/pages/principal/AllContentPage';
import LiveBroadcastPage from '@/pages/public/LiveBroadcastPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,   // 1 minute
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route: redirect if already logged in */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* Public live broadcast page (no auth required) */}
              <Route path="/live/:teacherId" element={<LiveBroadcastPage />} />

              {/* Teacher routes */}
              <Route element={<ProtectedRoute allowedRole="teacher" />}>
                <Route element={<AppLayout />}>
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/upload" element={<UploadContentPage />} />
                  <Route path="/teacher/content" element={<MyContentPage />} />
                </Route>
              </Route>

              {/* Principal routes */}
              <Route element={<ProtectedRoute allowedRole="principal" />}>
                <Route element={<AppLayout />}>
                  <Route path="/principal" element={<PrincipalDashboard />} />
                  <Route path="/principal/approvals" element={<PendingApprovalsPage />} />
                  <Route path="/principal/content" element={<AllContentPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
