import { Box, Container, Typography, Button, Link as MuiLink } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import errorImg from '../../assets/error/error-BjkQyYw8.png'
import logo from '../../assets/logo/single logo.png'

// Custom theme with green primary color
const theme = createTheme({
    palette: {
        primary: {
            main: '#16A34A',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F8F9FA',
            contrastText: '#1F2A44',
        },
        background: {
            paper: '#FFFFFF',
            default: 'rgba(22, 163, 74, 0.05)',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '5px',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '6px 16px',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                        backgroundColor: '#13893D',
                    },
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: { xs: '1.875rem', md: '2.25rem' }, // Matches text-3xl, md:text-4xl
        },
        body1: {
            fontWeight: 400,
        },
        caption: {
            fontWeight: 400,
        },
    },
});

const ErrorPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    py: 10,
                    px: { xs: 3, md: 15 },
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Container maxWidth="xl">
                    {/* Logo */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Link to="/" aria-label="Go to homepage">
                            <img
                                src={logo}
                                alt=" Evento Logo"
                                style={{ maxWidth: '200px', margin: '0 auto' }}
                            />
                        </Link>
                    </Box>

                    {/* Error Content */}
                    <Box sx={{ textAlign: 'center', my: 'auto' }}>
                        <img
                            src={errorImg}
                            alt="Page Not Found"
                            style={{ maxWidth: '300px', margin: '0 auto' }}
                        />
                        <Typography variant="h1" sx={{ mt: 3, mb: 4 }}>
                            Page Not Found?
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}
                        >
                            Whoops, this is embarrassing. <br /> Looks like the page you were looking for wasn’t found.
                        </Typography>
                        <Button
                            component={Link}
                            href="/"
                            variant="contained"
                            sx={{ px: 3}}
                            aria-label="Back to Home"
                        >
                            Back to Home
                        </Button>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Typography variant="caption" color="text.secondary">
                            © {new Date().getFullYear()}  Evento. Design & Develop with{' '}
                            {' '}
                            by{' '}
                            <MuiLink
                                href="https://github.com/tonmoy-Org"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                            >
                                Md Tanvir Hasan Tonmoy
                            </MuiLink>.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ErrorPage;