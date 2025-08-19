import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link as MuiLink,
    CssBaseline,
    InputLabel,
    Container,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Paper,
    Grid
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import banner from '../../assets/banner/presentation_Flatline-TKXLWdGJ.svg';
import RouteLoader from '../CommonLoader/RouteLoader';
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

const ResetPassword = () => {
    const [axiosSecure] = useAxios();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const gradientText = {
        background: '#16A34A',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    useEffect(() => {
        const controller = new AbortController();

        const verifyToken = async () => {
            if (!token || !id) {
                navigate(`/token-check?code=${id || 'invalid'}`, { replace: true });
                return;
            }

            try {
                const { data } = await axiosSecure.get(`/api/users/verify-reset-token`, {
                    params: { token, id },
                    signal: controller.signal
                });

                if (data.valid) {
                    setIsVerifying(false);
                } else {
                    navigate(`/token-check?code=${id}`, { replace: true });
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Token verification failed:', error);
                    navigate(`/token-check?code=${id}`, { replace: true });
                }
            }
        };

        verifyToken();

        return () => controller.abort();
    }, [token, id, navigate, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Both fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await axiosSecure.post('/api/users/reset-password', {
                token,
                password
            });

            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <Box>
                <RouteLoader />
            </Box>
        );
    }

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
                <title>Reset Password - Evento</title>
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
                                alt="Reset Password Banner"
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
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Password Reset Successful
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Your password has been updated successfully. Redirecting to login...
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
                                            Reset Password
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            mb: 3,
                                            color: '#777',
                                        }}>
                                            Create a new password for your account
                                        </Typography>
                                    </Box>
                                    <Box component="form" onSubmit={handleSubmit} noValidate>
                                        <Box sx={{ mb: 3 }}>
                                            <InputLabel
                                                htmlFor="password"
                                                sx={{
                                                    color: 'text.primary',
                                                    mb: 1,
                                                    fontWeight: 500,
                                                    '&.Mui-focused': gradientText
                                                }}
                                            >
                                                New Password *
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="password"
                                                name="password"
                                                size="small"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                autoFocus
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                sx={gradientBorderStyles}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                                aria-label="toggle password visibility"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    '&:hover': {
                                                                        color: 'primary.main'
                                                                    }
                                                                }}
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <InputLabel
                                                htmlFor="confirmPassword"
                                                sx={{
                                                    color: 'text.primary',
                                                    mb: 1,
                                                    fontWeight: 500,
                                                    '&.Mui-focused': gradientText
                                                }}
                                            >
                                                Confirm New Password *
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                size="small"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                sx={gradientBorderStyles}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                                aria-label="toggle confirm password visibility"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    '&:hover': {
                                                                        color: 'primary.main'
                                                                    }
                                                                }}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                        </Box>

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
                                                'Reset Password'
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

export default ResetPassword;