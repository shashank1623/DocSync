import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';

const ProtectedRoute = () => {
  const { user } = useUserStore();
  const token = localStorage.getItem('token');

  // If no user in Zustand and no token in localStorage, redirect to sign-in
  if (!user && !token) {
    return <Navigate to="/signin" />;
  }

  // If the user is logged in, allow access to the protected routes
  return <Outlet />;
};

export default ProtectedRoute;


