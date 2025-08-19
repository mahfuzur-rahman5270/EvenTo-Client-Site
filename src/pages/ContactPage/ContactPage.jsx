import { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Container,
    IconButton,
    styled,
    Skeleton,
    InputLabel,
    CircularProgress,
    Alert,
    Snackbar,
    useTheme,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import contactBanner from '../../assets/banner/contact-DcieejIc.svg';
import { Close } from '@mui/icons-material';

// Styled Components
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

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: '5px',
    fontWeight: 500,
    fontSize: '0.875rem',
    '&.Mui-focused': {
        color: theme.palette.text.primary,
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
                border: 'none', // Explicitly remove any border on hover
            },
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove default border when focused
        },
        '&.Mui-error:before': {
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        },
    },
};

const ContactPage = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        phone: false,
        message: false,
    });
    const [notification, setNotification] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const validatePhone = (phone) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const validateForm = () => {
        const newErrors = {
            name: !formData.name.trim(),
            email: !validateEmail(formData.email),
            phone: formData.phone.trim() && !validatePhone(formData.phone),
            message: !formData.message.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'https://api.web3forms.com/submit',
                {
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    subject: 'New Contact Form Submission - Evento',
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                },
                {
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                }
            );

            if (response.data.success) {
                setNotification({
                    open: true,
                    severity: 'success',
                    message: 'Your message has been sent successfully! We will get back to you soon.',
                });
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            setNotification({
                open: true,
                severity: 'error',
                message:
                    error.response?.data?.message ||
                    'Failed to send message. Please try again later or contact us directly at contact@Evento.com',
            });
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default }}>
            <Helmet>
                <title>Contact us - Evento</title>
                <meta
                    name="description"
                    content="Get in touch with Evento. Send us your questions, feedback, or inquiries about our services."
                />
            </Helmet>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={notification.severity}
                    action={
                        <IconButton aria-label="close notification" color="inherit" size="small" onClick={handleCloseNotification}>
                            <Close fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Map */}
            <Box
                sx={{
                    overflow: 'hidden',
                    height: { xs: '300px', md: '400px' },
                    mx: { xs: -2, md: 0 },
                    boxShadow: { md: '0 5px 32px rgba(31, 38, 135, 0.1)' },
                }}
            >
                {!mapLoaded && <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.2636267647463!2d90.31902762519162!3d23.88026872858199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c37ee749ff91%3A0x3ba6f00f068d5883!2sYunus%20Khan%20Scholar%20Garden%202(A)%20-%20DIU!5e0!3m2!1sen!2sbd!4v1749358441766!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: mapLoaded ? 'none' : 'blur(5px)', transition: 'filter 0.5s ease' }}
                    allowFullScreen=""
                    loading="lazy"
                    onLoad={() => setMapLoaded(true)}
                    title="Evento Location"
                />
            </Box>

            <Box sx={{ py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="stretch">
                        {/* Contact Image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={contactBanner}
                                    alt="Contact Evento"
                                    loading="lazy"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Contact Form */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: { xs: 2, md: 5 },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                        mb: 4,
                                        fontSize: '1.5rem',
                                        color: 'text.primary',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    Get in touch with us
                                </Typography>

                                <form onSubmit={handleSubmit} noValidate>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <StyledInputLabel required>Full Name</StyledInputLabel>
                                            <TextField
                                                fullWidth
                                                name="name"
                                                size="small"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                error={errors.name}
                                                helperText={errors.name ? 'Please enter your name' : ''}
                                                required
                                                sx={gradientBorderStyles}
                                                aria-label="Full Name"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledInputLabel required>Email Address</StyledInputLabel>
                                            <TextField
                                                fullWidth
                                                name="email"
                                                size="small"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                                helperText={errors.email ? 'Please enter a valid email' : ''}
                                                required
                                                sx={gradientBorderStyles}
                                                aria-label="Email Address"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledInputLabel>Phone Number</StyledInputLabel>
                                            <TextField
                                                fullWidth
                                                name="phone"
                                                size="small"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                error={errors.phone}
                                                helperText={errors.phone ? 'Please enter a valid phone number' : ''}
                                                sx={gradientBorderStyles}
                                                aria-label="Phone Number"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledInputLabel required>Your Message</StyledInputLabel>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                multiline
                                                rows={5}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                error={errors.message}
                                                helperText={errors.message ? 'Please enter your message' : ''}
                                                required
                                                sx={gradientBorderStyles}
                                                aria-label="Your Message"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 2 }}>
                                            <GradientButton
                                                type="submit"
                                                fullWidth
                                                endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : ''}
                                                disabled={isSubmitting}
                                                aria-label={isSubmitting ? 'Sending message' : 'Send message'}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </GradientButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ContactPage;