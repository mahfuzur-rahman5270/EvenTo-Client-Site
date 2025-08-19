import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link as MuiLink,
    CssBaseline,
    InputLabel,
    Container,
    Alert,
    CircularProgress,
    Paper,
    Grid
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import banner from '../../assets/banner/session_Flatline-BtSQKd16.svg';
import useAxios from '../../hooks/useAxios';

// Styled components
const GradientButton = styled(Button)(({ theme }) => ({
    background: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    textTransform: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        background: 'oklch(52.7% 0.154 150.069)',
    },
    '&:active': {
        transform: 'translateY(0)'
    },
    '&.Mui-disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500]
    }
}));

const gradientBorderStyles = {
    '& .MuiOutlinedInput-root': {
        position: 'relative',
        borderRadius: '5px',
        '& fieldset': {
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.12)',
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '5px',
            padding: '1.6px',
            background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0,
            transition: 'opacity 0.3s ease',
        },
        '&:hover:before, &.Mui-focused:before': {
            opacity: 1,
        },
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none',
        },
        '&.Mui-error:before': {
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        },
    },
};

const ForgotPassword = () => {
    const [axiosSecure] = useAxios();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const gradientText = {
        background: '#16A34A',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await axiosSecure.post('/api/users/forgot-password', { email });
            setSuccess(true);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                py: 6,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'background.default'
            }}
        >
            <Helmet>
                <title>Forgot Password - Evento</title>
            </Helmet>
            <Container maxWidth="lg">
                <CssBaseline />
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                src={banner}
                                alt="Forgot Password Banner"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '500px',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: 'background.paper',
                                borderRadius: '5px',
                                p: { xs: 1, md: 4 },
                            }}
                        >
                            {success ? (
                                <Box sx={{
                                    textAlign: 'center',
                                    p: 3,
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(76, 175, 80, 0.3)'
                                }}>
                                    <MailOutline sx={{
                                        fontSize: 60,
                                        mb: 2,
                                        ...gradientText
                                    }} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Password Reset Sent
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        We&apos;ve sent an email to <strong>{email}</strong> with instructions to reset your password.
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Didn&apos;t receive the email? Check your spam folder or{' '}
                                        <MuiLink
                                            component="button"
                                            onClick={handleSubmit}
                                            sx={{
                                                ...gradientText,
                                                fontWeight: 600,
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                        >
                                            resend
                                        </MuiLink>
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    {error && (
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 3,
                                                borderRadius: '8px',
                                                alignItems: 'center'
                                            }}
                                            onClose={() => setError("")}
                                        >
                                            {error}
                                        </Alert>
                                    )}
                                    <Box sx={{ textAlign: 'start', mb: 2 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                background: '#16A34A',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                py: 1,
                                                fontSize: '1.8rem'
                                            }}
                                        >
                                            Forgot Password
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            mb: 3,
                                            color: '#777',
                                        }}>
                                            No worries, we&apos;ll send you reset instructions
                                        </Typography>
                                    </Box>
                                    <Box component="form" onSubmit={handleSubmit} noValidate>
                                        <InputLabel
                                            htmlFor="email"
                                            sx={{
                                                color: 'text.primary',
                                                mb: 1,
                                                fontWeight: 500,
                                                '&.Mui-focused': gradientText
                                            }}
                                        >
                                            Email Address *
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            size="small"
                                            type="email"
                                            autoComplete="email"
                                            autoFocus
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            sx={gradientBorderStyles}
                                        />
                                        <GradientButton
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            disabled={isLoading}
                                            sx={{ mt: 2 }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress size={24} sx={{ color: 'grey.500' }} />
                                            ) : (
                                                'Send Reset Link'
                                            )}
                                        </GradientButton>
                                    </Box>
                                </>
                            )}
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                                Remember your password?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/login"
                                    sx={{
                                        ...gradientText,
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Sign in
                                </MuiLink>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ForgotPassword;  