import { Box, Paper, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet";


const EventOrganizerHome = () => {
    const { user } = useAuth();

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return "Good morning";
        if (currentHour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <Box sx={{ minHeight: '100vh', p: 2 }}>
            <Helmet>
                <title>Admin Home - Evento</title>
            </Helmet>

            {/* Header Section */}
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    {getGreeting()}, {' '}
                    <Box
                        component="span"
                        sx={{
                            background: 'linear-gradient(to left, #f472b6, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline'
                        }}
                    >
                        {user?.displayName || "Admin"}!
                    </Box>
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem'
                    }}
                >
                    Manage your Evento platform with ease
                </Typography>
            </Paper>
        </Box>
    );
};

export default EventOrganizerHome;