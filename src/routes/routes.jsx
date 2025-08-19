import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../components/Layout/Dashboard/Dashboard";
import EventOrganizerDashboard from "../components/DashboardLayout/EventOrganizerLayout";

import LoginPage from "../components/Login/Login";
import RegistrationPage from "../components/RegistrationPage/RegistrationPage";
import ManageAdmin from "../components/ManageAdmin/ManageAdmin";
import UploadBlog from "../components/UploadBlog/UploadBlog";
import ManageBlog from "../components/ManageBlog/ManageBlog";
import UserProfile from "../components/UserProfile/UserProfile";
import AdminInfoUpdate from "../components/AdminInfoUpdate/AdminInfoUpdate";
import AdminUpdatePassword from "../components/AdminUpdatePassword/AdminUpdatePassword";
import PrivateRoute from "./PrivateRoutes";
import AdminRoute from "./AdminRoute";
import LoginRoute from "./LoginRoute";
import Main from "../components/Layout/Main/Main";
import Home from "../pages/Home/Home/Home";
import RegisterComponent from "../components/RegisterComponent/RegisterComponent";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import TokenCheck from "../components/TokenCheck/TokenCheck";
import MyProfile from "../components/MyProfile/MyProfile";
import AdminHome from "../components/AdminHome/AdminHome";
import Blogs from "../pages/Home/Blogs/Blogs";
import BlogDetails from "../pages/Home/Blogs/BlogDetails";
import ContactPage from "../pages/ContactPage/ContactPage";
import RefundPolicy from "../pages/RefundPolicy/RefundPolicy";
import TermsOfService from "../pages/TermsOfService/TermsOfService";
import CookiesPolicy from "../pages/CookiesPolicy/CookiesPolicy";
import NotFoundPage from "../components/NotFoundPage/NotFoundPage";
import Faqs from "../pages/Faqs/Faqs";
import UserRoute from "./UserRoute";
import UserHome from "../components/UserPage/UserHome";
import ServiceHome from "../pages/Services/ServiceHome";
import AboutUs from "../pages/AboutUs/AboutUs";
import ClearDevice from "../components/ClearDevice/ClearDevice";
import EventOrganizerRoute from "./EventOrganizerRoute";
import EventOrganizerHome from "../components/EventOrganizerPage/EventOrganizerHome";
import EventOrganizerProfile from "../components/EventOrganizerPage/EventOrganizerProfile";
import Profile from "../components/UserPage/Profile";
import CreateEvent from "../components/AdminPages/CreateEvent";
import EventsPage from "../pages/EventPage/EventPage";
import EventsManagement from "../components/AdminPages/ManageEvent";
import EventDetails from "../pages/EventPage/EventDetails";
import Checkout from "../pages/Checkout/Checkout";
import OrderStatement from "../components/AdminPages/OrderStatement";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "login",
                element: (
                    <LoginRoute>
                        <LoginPage />
                    </LoginRoute>
                ),
            },
            {
                path: "forgot-password",
                element: (
                    <LoginRoute>
                        <ForgotPassword />
                    </LoginRoute>
                ),
            },
            {
                path: "reset-password",
                element: (
                    <LoginRoute>
                        <ResetPassword />
                    </LoginRoute>
                ),
            },
            {
                path: "token-check",
                element: (
                    <LoginRoute>
                        <TokenCheck />
                    </LoginRoute>
                ),
            },
            {
                path: "clear-device",
                element: (
                    <LoginRoute>
                        <ClearDevice />
                    </LoginRoute>
                ),
            },
            {
                path: "/register",
                element: <RegisterComponent />,
            },
            {
                path: "/blogs",
                element: <Blogs />,
            },
            {
                path: "/blogs-details/:title_id",
                element: <BlogDetails />,
            },
            {
                path: 'contact',
                element: <ContactPage />
            },
            {
                path: 'refund-policy',
                element: <RefundPolicy />
            },
            {
                path: 'terms',
                element: <TermsOfService />
            },
            {
                path: 'cookies',
                element: <CookiesPolicy />
            },
            {
                path: 'faqs',
                element: <Faqs />
            },
            {
                path: 'services',
                element: <ServiceHome />
            },
            {
                path: 'aboutus',
                element: <AboutUs />
            },
            // User Dashboard routes moved inside Main
            {
                path: "dashboard",
                element:
                    <PrivateRoute>
                        <UserRoute>
                            <UserHome />
                        </UserRoute>
                    </PrivateRoute>

            },
            {
                path: "edit-profile",
                element:
                    <PrivateRoute>
                        <UserRoute>
                            <Profile />
                        </UserRoute>
                    </PrivateRoute>

            },
            {
                path: "events",
                element: <EventsPage />
            },
            {
                path: "events/:id",
                element: <EventDetails />
            },
            {
                path: 'checkout',
                element: <Checkout />
            }
        ],
    },
    // Admin Dashboard (kept separate as it likely has a different layout)
    {
        path: "admin-dashboard",
        element: (
            <PrivateRoute>
                <AdminRoute>
                    <Dashboard />
                </AdminRoute>
            </PrivateRoute>
        ),
        children: [
            {
                path: "",
                element: <AdminHome />,
            },
            {
                path: "admin/profile",
                element: <MyProfile />,
            },
            {
                path: "user/manage",
                element: <ManageAdmin />,
            },
            {
                path: "user/create",
                element: <RegistrationPage />,
            },
            {
                path: "blog/upload",
                element: <UploadBlog />,
            },
            {
                path: "blog/manage",
                element: <ManageBlog />,
            },
            {
                path: "user/profile",
                element: <UserProfile />,
            },
            {
                path: "admin-info-update/:id",
                element: <AdminInfoUpdate />,
            },
            {
                path: "admin/update-password/:id",
                element: <AdminUpdatePassword />,
            },
            {
                path: "events/create",
                element: <CreateEvent />
            },
            {
                path: "events/manage",
                element: <EventsManagement />
            },
            {
                path: 'payments/statements',
                element: <OrderStatement />
            },
        ],
    },
    // Event organizer Dashboard (kept separate as it likely has a different layout)
    {
        path: "/event-organizer-dashboard",
        element: (
            <PrivateRoute>
                <EventOrganizerRoute>
                    <EventOrganizerDashboard />
                </EventOrganizerRoute>
            </PrivateRoute>
        ),
        children: [
            {
                path: "home",
                element: <EventOrganizerHome />,
            },
            {
                path: "profile",
                element: <EventOrganizerProfile />,
            },
        ],
    },
]);

export default router;