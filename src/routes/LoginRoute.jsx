import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import RouteLoader from '../components/CommonLoader/RouteLoader';


// eslint-disable-next-line react/prop-types
const LoginRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <RouteLoader />
    }
    if (user) {
        return <Navigate to='/' state={{ from: location }} replace />;
    }
    return children;
};

export default LoginRoute;