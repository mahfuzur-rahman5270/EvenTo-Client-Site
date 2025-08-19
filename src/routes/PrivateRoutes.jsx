import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RouteLoader from "../components/CommonLoader/RouteLoader";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <RouteLoader />
    }
    if (user?.email) {
        return children;
    }
    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoute;