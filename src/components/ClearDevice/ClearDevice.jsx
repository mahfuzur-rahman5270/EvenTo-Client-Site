import { Box, Container, CssBaseline, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useState } from 'react';
import banner from '../../assets/banner/Team_meeting_Two-DuQfJayS (1).svg';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// Styled ErrorAlert component
const ErrorAlert = styled(Alert)({
    marginBottom: 1,
    borderRadius: '8px',
    alignItems: 'center',
    width: '100%',
});

const ClearDevice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [axiosSecure] = useAxios();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // State for success message
    const gradient = '#16A34A';

    // Get email from location state
    const email = location.state?.userEmail || '';
    const uid = location.state?.uid || '';

    const handleCancel = () => {
        navigate('/login');
    };

    const handleCloseAlert = () => {
        setSuccess(''); // Clear success message
    };

    const handleLogoutFromAll = async () => {
        if (!email) {
            setError('No email provided. Please try logging in again.');
            return;
        }

        try {
            await axiosSecure.post('/api/logout-all', { email, uid });
            setSuccess('Successfully logged out from all devices.'); // Set success message
            setTimeout(() => {
                navigate('/login', { replace: true }); // Navigate after a delay
            }, 2000); // 2-second delay
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log out from all devices.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                p: { xs: 2, sm: 3 },
            }}
            role="main"
            aria-label="Device Limit Exceeded Page"
        >
            <CssBaseline />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        p: { xs: 3, sm: 4 },
                    }}
                >
                    {success && (
                        <Snackbar
                            open={!!success}
                            autoHideDuration={6000}
                            onClose={handleCloseAlert}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={handleCloseAlert}
                                severity="success"
                                sx={{
                                    width: '100%',
                                }}
                            >
                                {success}
                            </Alert>
                        </Snackbar>
                    )}
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.3,
                        }}
                        aria-label="Device Limit Exceeded"
                    >
                        Device Limit Exceeded
                    </Typography>
                    <img
                        src={banner}
                        alt="Device Limit Exceeded Illustration"
                        style={{
                            width: '100%',
                            maxWidth: '250px',
                            height: 'auto',
                            margin: '0 auto',
                        }}
                        loading="lazy"
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            mx: 'auto',
                            lineHeight: 1.6,
                        }}
                        aria-label="Device limit exceeded description"
                    >
                        Your account has reached the maximum number of active devices. An email has been sent with instructions. Please log out from all devices to continue.
                    </Typography>
                    {error && (
                        <ErrorAlert
                            severity="error"
                            onClose={() => setError('')}
                            sx={{
                                border: '1px solid',
                                borderColor: 'error.light',
                                backgroundColor: 'error.light',
                                color: 'error.dark',
                            }}
                        >
                            {error}
                        </ErrorAlert>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{
                                color: 'text.primary',
                                borderColor: 'grey.500',
                                px: { xs: 3, sm: 4 },
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: '6px',
                                '&:hover': {
                                    borderColor: 'grey.700',
                                    backgroundColor: 'grey.100',
                                },
                            }}
                            aria-label="Cancel and return to login"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleLogoutFromAll}
                            sx={{
                                background: gradient,
                                color: 'white',
                                px: { xs: 3, sm: 4 },
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: '6px',
                                '&:hover': {
                                    opacity: 0.9,
                                    background: gradient,
                                },
                            }}
                            aria-label="Log out from all devices"
                        >
                            Log Out from All
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default ClearDevice;