import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
    children: React.ReactNode
}

export const ProtectedRoute = ({ children }:  Props) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};
