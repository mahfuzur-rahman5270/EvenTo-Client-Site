import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import RouteLoader from "../components/CommonLoader/RouteLoader";
import useEventOrganizer from "../hooks/useEventOrganizer";


// eslint-disable-next-line react/prop-types
const EventOrganizerRoute = ({ children }) => {
    const { user } = useAuth();
    const [isEventOrganizer, isEventOrganizerLoading] = useEventOrganizer();
    const location = useLocation();

    if (isEventOrganizerLoading) {
        return <RouteLoader />;
    }

    if (user && isEventOrganizer) {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default EventOrganizerRoute;