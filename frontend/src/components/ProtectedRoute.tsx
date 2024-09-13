import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from '@/stores/useUserStore';

const ProtectedRoute = () => {
  const { user } = useUserStore();
  const token = localStorage.getItem('token');

  // If there is no user in Zustand or token, redirect to sign-in
  if (!user || !token) {
    return <Navigate to="/signin" />;
  }

  // Otherwise, allow access to the protected routes
  return <Outlet />;
};

export default ProtectedRoute;

