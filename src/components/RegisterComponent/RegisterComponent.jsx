import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Checkbox,
    Link,
    InputLabel,
    Alert,
    CircularProgress,
    Paper,
    Grid,
    CssBaseline,
    Snackbar,
    Tabs,
    Tab,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import banner from '../../assets/banner/Startup_Flatline-B8AgMtsE.svg';
import useAxios from '../../hooks/useAxios';

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

const RegisterComponent = () => {
    const [axiosSecure] = useAxios();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [role, setRole] = useState('User');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        countryCode: '+880',
        address: '',
        password: '',
        confirmPassword: '',
        agree: false,
        organization: '',
    });

    const gradientText = {
        background: '#16A34A',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'agree' ? checked : value
        }));
    };

    const handlePhoneChange = (value, country) => {
        setFormData((prev) => ({
            ...prev,
            phoneNumber: value,
            countryCode: country.dialCode
        }));
    };

    const handleRoleChange = (event, newRole) => {
        setRole(newRole);
    };

    const validateForm = () => {
        if (!formData.name) {
            setAlert({
                open: true,
                message: 'Name is required',
                severity: 'error'
            });
            return false;
        }
        if (!formData.email) {
            setAlert({
                open: true,
                message: 'Email is required',
                severity: 'error'
            });
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setAlert({
                open: true,
                message: 'Please enter a valid email',
                severity: 'error'
            });
            return false;
        }
        if (!formData.phoneNumber) {
            setAlert({
                open: true,
                message: 'Phone number is required',
                severity: 'error'
            });
            return false;
        }
        if (!formData.address) {
            setAlert({
                open: true,
                message: 'Address is required',
                severity: 'error'
            });
            return false;
        }
        if (formData.password.length < 6) {
            setAlert({
                open: true,
                message: 'Password must be at least 6 characters',
                severity: 'error'
            });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setAlert({
                open: true,
                message: 'Passwords do not match',
                severity: 'error'
            });
            return false;
        }
        if (!formData.agree) {
            setAlert({
                open: true,
                message: 'You must agree to the terms and conditions',
                severity: 'error'
            });
            return false;
        }
        if (role === 'Event Organizer' && !formData.organization) {
            setAlert({
                open: true,
                message: 'Organization name is required for Event Organizers',
                severity: 'error'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ ...alert, open: false });

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formattedPhone = formData.phoneNumber.startsWith('+')
                ? formData.phoneNumber
                : `+${formData.phoneNumber}`;

            const saveUser = {
                displayName: formData.name,
                email: formData.email,
                phoneNumber: formattedPhone,
                address: formData.address,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                role: role,
                agree: formData.agree,
                ...(role === 'Event Organizer' && { organization: formData.organization }),
            };

            const response = await axiosSecure.post('/api/users/create', saveUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            if (response.status === 201) {
                setAlert({
                    open: true,
                    message: 'Registration successful! You can now sign in.',
                    severity: 'success'
                });
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    countryCode: '+880',
                    address: '',
                    password: '',
                    confirmPassword: '',
                    agree: false,
                    organization: '',
                });
                setRole('User');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                "An error occurred. Please try again.";
            setAlert({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    return (
        <Box sx={{
            py: 6,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.default'
        }}>
            <Helmet>
                <title>Register - Evento</title>
            </Helmet>
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
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
                                alt="Register Banner"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '600px',
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
                            <Box sx={{ textAlign: 'start', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Create Your Account
                                </Typography>
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
                                    Sign Up
                                </Typography>
                            </Box>
                            <Tabs
                                value={role}
                                onChange={handleRoleChange}
                                sx={{
                                    mb: 2,
                                    '& .MuiTabs-flexContainer': {
                                        justifyContent: 'start',
                                    },
                                    '& .MuiTab-root': {
                                        color: 'text.secondary',
                                        textTransform: 'none',
                                        '&.Mui-selected': {
                                            color: '#16A34A',
                                            textTransform: 'none',
                                        },
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#16A34A',
                                    },
                                }}
                            >
                                <Tab label="User" value="User" />
                                <Tab label="Event Organizer" value="Event Organizer" />
                            </Tabs>
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Box sx={{ mb: 1 }}>
                                    <InputLabel
                                        htmlFor="name"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': gradientText
                                        }}
                                    >
                                        Full Name *
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        size="small"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                {role === 'Event Organizer' && (
                                    <Box sx={{ mb: 1 }}>
                                        <InputLabel
                                            htmlFor="organization"
                                            sx={{
                                                color: 'text.primary',
                                                mb: 1,
                                                fontWeight: 500,
                                                '&.Mui-focused': gradientText
                                            }}
                                        >
                                            Organization Name *
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            id="organization"
                                            name="organization"
                                            size="small"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            required
                                            sx={gradientBorderStyles}
                                        />
                                    </Box>
                                )}
                                <Box sx={{ mb: 1 }}>
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
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <InputLabel
                                        htmlFor="phoneNumber"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': gradientText
                                        }}
                                    >
                                        Phone Number *
                                    </InputLabel>
                                    <Box sx={{
                                        '& .react-tel-input': {
                                            '& .form-control': {
                                                width: '100%',
                                                height: '40px',
                                                fontSize: '1rem',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(0, 0, 0, 0.23)',
                                                padding: '16.5px 14px 16.5px 58px',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    borderColor: 'rgba(0, 0, 0, 0.87)',
                                                },
                                                '&:focus': {
                                                    borderColor: '#405aff',
                                                    boxShadow: '0 0 0 2px rgba(64, 90, 255, 0.2)',
                                                },
                                            },
                                            '& .flag-dropdown': {
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                borderRadius: '8px 0 0 8px',
                                            },
                                            '& .selected-flag': {
                                                paddingLeft: '12px',
                                                '&:hover, &:focus': {
                                                    backgroundColor: 'transparent',
                                                },
                                            },
                                        },
                                        position: 'relative',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            borderRadius: '8px',
                                            padding: '1.6px',
                                            background: '#16A34A',
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                            pointerEvents: 'none',
                                            zIndex: 1,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover:before': {
                                            opacity: 1,
                                        },
                                        '&:focus-within:before': {
                                            opacity: 1,
                                        }
                                    }}>
                                        <PhoneInput
                                            country={'bd'}
                                            preferredCountries={['bd', 'us', 'gb', 'ca', 'au']}
                                            value={formData.phoneNumber}
                                            onChange={handlePhoneChange}
                                            inputProps={{
                                                name: 'phoneNumber',
                                                required: true,
                                                autoFocus: false
                                            }}
                                            disableDropdown={false}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <InputLabel
                                        htmlFor="address"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': gradientText
                                        }}
                                    >
                                        Address *
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        id="address"
                                        name="address"
                                        size="small"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <InputLabel
                                        htmlFor="password"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': gradientText
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
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
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
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <InputLabel
                                        htmlFor="confirmPassword"
                                        sx={{
                                            color: 'text.primary',
                                            mb: 1,
                                            fontWeight: 500,
                                            '&.Mui-focused': gradientText
                                        }}
                                    >
                                        Confirm Password *
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        size="small"
                                        type={showConfirm ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirm(!showConfirm)}
                                                        edge="end"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: 'primary.main'
                                                            }
                                                        }}
                                                    >
                                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={gradientBorderStyles}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Checkbox
                                        name="agree"
                                        checked={formData.agree}
                                        onChange={handleChange}
                                        color="success"
                                        size='small'
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'success.main',
                                            },
                                            padding: 0,
                                            marginRight: 1
                                        }}
                                        required
                                    />
                                    <Typography variant="body2" color="text.primary">
                                        I agree to the <Link href="/terms" sx={{ ...gradientText, fontWeight: 600 }}>terms and conditions</Link>
                                    </Typography>
                                </Box>
                                <GradientButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={!formData.agree || loading}
                                    sx={{ mb: 2 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: 'grey 500' }} />
                                    ) : (
                                        "Create Account"
                                    )}
                                </GradientButton>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        sx={{
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            },
                                            ...gradientText
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RegisterComponent;