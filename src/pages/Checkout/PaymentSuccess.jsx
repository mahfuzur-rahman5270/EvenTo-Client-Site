import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    styled,
} from '@mui/material';
import { CheckCircle, ArrowForward, LibraryBooks } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

// Styled components
const GradientButton = styled(Button)(({ theme }) => ({
    background: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    ,
    '&:hover': {
        background: 'oklch(52.7% 0.154 150.069)',
    },
    '&:disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

const OutlineButton = styled(Button)(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    borderRadius: '8px',
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: 'rgba(64, 90, 255, 0.05)',
    },
}));

// Animation for the success icon
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const transactionId = query.get('transactionId');

    useEffect(() => {
        if (!transactionId) {
            navigate('/courses');
        }
    }, [transactionId, navigate]);

    const handleContinue = () => navigate('/dashboard');
    const handleBrowseCourses = () => navigate('/');

    return (
        <Container maxWidth="md" sx={{
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
        }}>
            <Box sx={{
                p: { xs: 3, md: 6 },
                width: '100%',
                maxWidth: 600,
                textAlign: 'center',
            }}>
                {/* Animated Success Icon */}
                <Box sx={{
                    width: 90,
                    height: 90,
                    mx: 'auto',
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                    borderRadius: '50%',
                    animation: `${pulse} 1.5s ease-in-out infinite`,
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                }}>
                    <CheckCircle sx={{
                        fontSize: 60,
                        color: 'white'
                    }} />
                </Box>

                {/* Success Message */}
                <Typography  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                    fontSize: { xs: '1.25rem', md: '1.8rem' }
                }}>
                    Payment Successful!
                </Typography>

                <Typography variant="body1" sx={{
                    mb: 3,
                    color: 'text.secondary',
                    fontSize: '1rem',
                    maxWidth: '80%',
                    mx: 'auto'
                }}>
                    Thank you for your purchase. Your course is now available in your dashboard.
                </Typography>

                {/* Transaction Details */}
                <Paper elevation={0} sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: 'action.hover',
                    textAlign: 'left'
                }}>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary'
                    }}>
                        Transaction Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="body1" sx={{
                            minWidth: 140,
                            fontWeight: 500,
                            color: 'text.secondary'
                        }}>
                            Transaction ID:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {transactionId}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="body1" sx={{
                            minWidth: 140,
                            fontWeight: 500,
                            color: 'text.secondary'
                        }}>
                            Date:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Box>
                </Paper>

                {/* Action Buttons */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'center',
                    mt: 4
                }}>
                    <GradientButton
                        size="large"
                        onClick={handleContinue}
                        endIcon={<ArrowForward />}
                        sx={{
                            flex: 1,
                        }}
                    >
                        Go to My Courses
                    </GradientButton>

                    <OutlineButton
                        size="large"
                        onClick={handleBrowseCourses}
                        startIcon={<LibraryBooks />}
                        sx={{
                            flex: 1,
                        }}
                    >
                        Go To Home
                    </OutlineButton>
                </Box>
            </Box>

            {/* Additional Help Section */}
            <Box sx={{
                mt: 6,
                textAlign: 'center',
                maxWidth: 600,
                width: '100%'
            }}>
                <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    mb: 1
                }}>
                    Need help with your purchase?
                </Typography>
                <Button
                    variant="text"
                    size="medium"
                    sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                >
                    Contact Support
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentSuccess;