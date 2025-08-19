import { Box, Container, CssBaseline, Button, Typography } from '@mui/material';
import key from '../../assets/icons/key.png';
import { useNavigate } from 'react-router-dom';

const TokenCheck = () => {
    const navigate = useNavigate();
    const gradient = '#16A34A';

    const handleTryAgain = () => {
        navigate('/forgot-password');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                p: 2
            }}
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
                        borderRadius: 2.5,
                        p: 3,
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 2.5,
                            padding: '1.6px',
                            background: '#16A34A',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }
                    }}
                >
                    {/* Key Icon */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 55, 242, 0.1)',
                            borderRadius: '50%',
                            mb: 1
                        }}
                    >
                        <img 
                            src={key} 
                            alt="Expired Token" 
                            style={{ 
                                width: '50px', 
                                height: '50px',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }} 
                        />
                    </Box>

                    {/* Title */}
                    <Typography 
                        variant="h5" 
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                        }}
                    >
                        Token Expired
                    </Typography>
                    <Typography 
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '80%',
                            mx: 'auto'
                        }}
                    >
                        This password reset link has expired. Please request a new one.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleTryAgain}
                        sx={{
                            background: gradient,
                            color: 'white',
                            px: 4,
                            '&:hover': {
                                opacity: 0.9,
                                background: gradient
                            },
                            textTransform: 'capitalize'
                        }}
                    >
                        Try Again
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default TokenCheck;