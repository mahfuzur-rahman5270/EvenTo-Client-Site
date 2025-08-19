import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import RouteLoader from "../components/CommonLoader/RouteLoader";

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if ( isAdminLoading) {
        return <RouteLoader />
    }
    if (user && isAdmin) {
        return children;
    }
    return <Navigate to='/' state={{ from: location }} replace></Navigate>
};

export default AdminRoute;