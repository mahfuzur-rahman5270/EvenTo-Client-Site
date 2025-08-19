import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Grid,
    CssBaseline,
    InputLabel,
    Alert,
    CircularProgress,
    Paper,
    styled,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import GetDeviceInfo from '../GetDeviceInfo/GetDeviceInfo';
import { Helmet } from 'react-helmet';
import banner from '../../assets/banner/Agent_Monochromatic-BIhLzTcD.svg';
import SocialLogIn from './SocialLogIn';

// Constants
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET || 'your_secret_key';
const COOKIE_OPTIONS = { expires: 7, secure: true, sameSite: 'strict' };

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
        transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
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

const ErrorAlert = styled(Alert)({
    mb: 1,
    borderRadius: '8px',
    alignItems: 'center',
});

const BannerImage = styled('img')({
    width: '100%',
    height: 'auto',
    maxHeight: '500px',
    objectFit: 'contain',
});

export default function AuthComponent() {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [axiosSecure, axiosError] = useAxios();
    const { signIn } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const from = useMemo(() => location.state?.from?.pathname || '/', [location.state]);

    // Memoized device info to prevent unnecessary recalculations
    const deviceInfo = useMemo(() => ({
        ...GetDeviceInfo(),
        lastLogin: new Date().toISOString()
    }), []);

    // Watch form values
    const formValues = watch();

    // Handle axios errors
    useEffect(() => {
        if (!axiosError) return;

        const errorMessage = axiosError?.response?.data?.message || 'An error occurred';
        setError(errorMessage);

        if (axiosError?.response?.status === 403 && axiosError?.response?.data?.redirectTo) {
            navigate(axiosError.response.data.redirectTo, {
                replace: true,
                state: {
                    userEmail: axiosError.response.data.userEmail,
                    uid: axiosError.response.data.uid,
                    from: location.state?.from || '/'
                }
            });
        }
    }, [axiosError, navigate, location.state]);

    // Load saved credentials from cookies
    useEffect(() => {
        const loadCredentials = () => {
            const storedEmail = Cookies.get('genericUID');
            const storedPassword = Cookies.get('genericUSER');

            if (storedEmail) {
                try {
                    const decryptedEmail = CryptoJS.AES.decrypt(storedEmail, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    if (decryptedEmail) {
                        setValue('email', decryptedEmail);
                        setValue('rememberMe', true);
                        setRememberMe(true);
                    }
                } catch (err) {
                    console.error('Failed to decrypt email cookie:', err);
                    Cookies.remove('genericUID');
                }
            }

            if (storedPassword) {
                try {
                    const decryptedPassword = CryptoJS.AES.decrypt(storedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
                    if (decryptedPassword) {
                        setValue('password', decryptedPassword);
                    }
                } catch (err) {
                    console.error('Failed to decrypt password cookie:', err);
                    Cookies.remove('genericUSER');
                }
            }
        };

        loadCredentials();
    }, [setValue]);

    // Handle form submission
    const onSubmit = useCallback(async (data) => {
        setError('');
        setLoading(true);

        try {
            // Client-side validation
            if (data.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Get or create device ID
            let deviceId = Cookies.get('deviceId');
            if (!deviceId) {
                deviceId = CryptoJS.lib.WordArray.random(16).toString();
                Cookies.set('deviceId', deviceId, { ...COOKIE_OPTIONS, expires: 365 });
            }

            // Make login request
            const response = await axiosSecure.post('/api/login', {
                email: data.email,
                password: data.password,
                deviceInfo: { ...deviceInfo, deviceId },
            });
            if (!response.data.success) {
                throw new Error(response.data.message || 'Login failed');
            }

            // Handle remember me functionality
            if (data.rememberMe) {
                const encryptedEmail = CryptoJS.AES.encrypt(data.email, SECRET_KEY).toString();
                const encryptedPassword = CryptoJS.AES.encrypt(data.password, SECRET_KEY).toString();
                Cookies.set('genericUID', encryptedEmail, COOKIE_OPTIONS);
                Cookies.set('genericUSER', encryptedPassword, COOKIE_OPTIONS);
            } else {
                Cookies.remove('genericUID');
                Cookies.remove('genericUSER');
            }

            // Store token and sign in
            localStorage.setItem('access-token', response.data.token);
            await signIn(data.email, data.password);

            // Redirect to intended page or home
            navigate(from, { replace: true });

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    }, [axiosSecure, deviceInfo, navigate, from, signIn]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleRememberMeChange = useCallback((event) => {
        setRememberMe(event.target.checked);
    }, []);

    // Check if form is valid and remember me is checked
    const isFormValid = rememberMe &&
        formValues.email &&
        formValues.password &&
        formValues.password.length >= 6 &&
        !errors.email &&
        !errors.password;

    return (
        <Box
            sx={{
                py: 6,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'background.default',
            }}
        >
            <Helmet>
                <title>Login - Evento</title>
            </Helmet>
            <Container maxWidth="lg">
                <CssBaseline />
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BannerImage src={banner} alt="Login Banner" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ backgroundColor: 'background.paper', borderRadius: '5px', p: { xs: 1, md: 4 } }}>
                            {error && (
                                <ErrorAlert severity="error" onClose={() => setError('')}>
                                    {error}
                                </ErrorAlert>
                            )}
                            <Box sx={{ textAlign: 'start', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Welcome Back
                                </Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        background: '#16A34A',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        py: 1,
                                        fontSize: '1.8rem',
                                    }}
                                >
                                    Sign In your account
                                </Typography>
                            </Box>
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Box sx={{ mb: 1 }}>
                                    <InputLabel
                                        htmlFor="email"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': {
                                                background: '#16A34A',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            },
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
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <InputLabel
                                        htmlFor="password"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': {
                                                background: '#16A34A',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            },
                                        }}
                                    >
                                        Password *
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        size="small"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={togglePasswordVisibility}
                                                        edge="end"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: 'primary.main',
                                                            },
                                                        }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    {...register('rememberMe')}
                                                    defaultChecked={!!Cookies.get('genericUID')}
                                                    color="success"
                                                    size="small"
                                                    onChange={handleRememberMeChange}
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: 'green',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant="body2" color="text.primary">
                                                    Remember me
                                                </Typography>
                                            }
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to="/forgot-password">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    background: '#16A34A',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                Forgot password?
                                            </Typography>
                                        </Link>
                                    </Grid>
                                </Grid>
                                <GradientButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={!isFormValid || loading}
                                    sx={{ mb: 2 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: 'grey.500' }} />
                                    ) : (
                                        'Sign In'
                                    )}
                                </GradientButton>
                                <Box>
                                    <SocialLogIn />
                                </Box>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                                    Don&apos;t have an account?{' '}
                                    <Link to="/register">
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontWeight: 600,
                                                background: '#16A34A',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            Sign Up
                                        </Typography>
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}