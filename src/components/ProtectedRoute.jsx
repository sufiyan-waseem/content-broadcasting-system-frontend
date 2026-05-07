import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ allowedRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'principal' ? '/principal' : '/teacher'} replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'principal' ? '/principal' : '/teacher'} replace />;
  }

  return <Outlet />;
};
