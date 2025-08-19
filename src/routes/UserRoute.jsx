import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RouteLoader from "../components/CommonLoader/RouteLoader";
import useUser from "../hooks/useUser";


// eslint-disable-next-line react/prop-types
const UserRoute = ({ children }) => {
    const { user } = useAuth();
    const [isUser, isUserLoading,] = useUser();
    const location = useLocation();

    if (isUserLoading) {
        return <RouteLoader />;
    }

    if (user && isUser) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default UserRoute;