import useAxios from '../../hooks/useAxios';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Stack,
    Typography
} from '@mui/material';
import {
    LocationOn,
    CalendarToday,
    ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';

const PrimaryButton = styled(Button)({
    backgroundColor: '#16A34A',
    '&:hover': {
        backgroundColor: '#138636',
    },
});

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [axiosSecure] = useAxios();
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const { user } = useAuth();

    // Fetch single event
    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/events/${id}`);
            return res.data;
        },
        onError: () => {
            setAlert({
                open: true,
                message: 'Failed to load event details. Please try again later.',
                severity: 'error',
            });
        },
    });

    const formatDate = (dateString) => {
        return dayjs(dateString).format('MMMM D, YYYY');
    };

    const formatTime = (dateString) => {
        return dayjs(dateString).format('h:mm A');
    };

    const handleEnrollNow = (e, ticket) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout', {
            state: {
                eventId: event._id,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                eventAddress: event.address,
                eventDescription: event.description,
                bannerUrl: event.banner,
                organizerName: event.organizerName,
                organizerPhoto: event.organizerPhoto,
                organizerDescription: event.organizer?.description,
                allTickets: event.tickets, // Send all tickets for selection
                isFreeEvent: event.tickets.every(t => t.price === 0) // Check if all tickets are free
            },
        });
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Skeleton variant="rectangular" height={400} />
                <Box sx={{ mt: 3 }}>
                    <Skeleton variant="text" width="60%" height={60} />
                    <Skeleton variant="text" width="40%" height={40} />
                    <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
                </Box>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load event details. Please try again later.
                </Alert>
                <PrimaryButton
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                >
                    Back to Events
                </PrimaryButton>
            </Container>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>
                )}
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="500"
                            image={event.banner}
                            alt={event.title}
                            sx={{ objectFit: 'cover' }}
                        />

                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h4" component="h1" fontWeight="bold">
                                    {event.title}
                                </Typography>
                            </Box>
                            
                            <Box
                                sx={{
                                    '& .ql-editor': {
                                        fontSize: '1rem',
                                        lineHeight: 1.5,
                                        padding: 0,
                                        color: 'text.primary',
                                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                        '& h2': {
                                            fontSize: '2rem',
                                            fontWeight: 600,
                                            mt: 6,
                                            mb: 3,
                                            letterSpacing: '-0.01em',
                                        },
                                        '& h3': {
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                            mt: 5,
                                            mb: 2,
                                            color: 'text.primary',
                                        },
                                        '& p': {
                                            mb: 3,
                                            color: 'text.secondary',
                                        },
                                        '& img': {
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: 2,
                                            my: 4,
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        },
                                        '& iframe': {
                                            width: '100%',
                                            minHeight: '400px',
                                            my: 4,
                                            border: 'none',
                                            borderRadius: 2,
                                        },
                                        '& blockquote': {
                                            borderLeft: '4px solid',
                                            borderColor: '#405aff',
                                            pl: 3,
                                            py: 1,
                                            my: 3,
                                            backgroundColor: 'background.paper',
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                        },
                                    },
                                }}
                            >
                                <ReactQuill
                                    value={event.description}
                                    readOnly={true}
                                    theme="bubble"
                                />
                            </Box>

                            <Button
                                variant="text"
                                size="small"
                                sx={{ color: '#16A34A', mb: 2 }}
                                onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                            >
                                {showPrivacyPolicy ? 'Hide' : 'View'} Description Privacy Policy
                            </Button>

                            {showPrivacyPolicy && (
                                <Box
                                    sx={{
                                        '& .ql-editor': {
                                            fontSize: '1rem',
                                            lineHeight: 1.5,
                                            padding: 0,
                                            color: 'text.primary',
                                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                            '& h2': {
                                                fontSize: '2rem',
                                                fontWeight: 600,
                                                mt: 6,
                                                mb: 3,
                                                letterSpacing: '-0.01em',
                                            },
                                            '& h3': {
                                                fontSize: '1.5rem',
                                                fontWeight: 600,
                                                mt: 5,
                                                mb: 2,
                                                color: 'text.primary',
                                            },
                                            '& p': {
                                                mb: 3,
                                                color: 'text.secondary',
                                            },
                                            '& img': {
                                                maxWidth: '100%',
                                                height: 'auto',
                                                borderRadius: 2,
                                                my: 4,
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                            },
                                            '& iframe': {
                                                width: '100%',
                                                minHeight: '400px',
                                                my: 4,
                                                border: 'none',
                                                borderRadius: 2,
                                            },
                                            '& blockquote': {
                                                borderLeft: '4px solid',
                                                borderColor: '#405aff',
                                                pl: 3,
                                                py: 1,
                                                my: 3,
                                                backgroundColor: 'background.paper',
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                            },
                                        },
                                    }}
                                >
                                    <ReactQuill
                                        value={event.policy}
                                        readOnly={true}
                                        theme="bubble"
                                    />
                                </Box>
                            )}

                            <Divider sx={{ my: 3, borderColor: '#16A34A' }} />

                            <Typography variant="h6" gutterBottom fontWeight="bold" color="#16A34A">
                                Event Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CalendarToday color="primary" sx={{ color: '#16A34A' }} />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Date & Time
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(event.date)}
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatTime(event.date)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <LocationOn color="primary" sx={{ color: '#16A34A' }} />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Location
                                            </Typography>
                                            <Typography variant="body1">
                                                {event.location}
                                            </Typography>
                                            {event.address && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {event.address}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ 
                        p: 3, 
                        position: 'sticky', 
                        top: 20, 
                        borderTop: '4px solid #16A34A',
                        borderRadius: '8px'
                    }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="#16A34A">
                            Tickets
                        </Typography>

                        {event.tickets && event.tickets.length > 0 ? (
                            <Stack spacing={2}>
                                {event.tickets.map((ticket) => (
                                    <Paper
                                        key={ticket._id}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                borderColor: '#16A34A',
                                                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {ticket.type}
                                        </Typography>
                                        <Typography variant="body1" sx={{ my: 1, color: '#16A34A', fontWeight: 'bold' }}>
                                            {ticket.price === 0 ? 'FREE' : `৳${ticket.price.toLocaleString()}`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Available: {ticket.quantity}
                                        </Typography>
                                        <PrimaryButton
                                            variant="contained"
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            onClick={(e) => handleEnrollNow(e, ticket)}
                                        >
                                            {ticket.price === 0 ? 'Register Now' : 'Get Tickets'}
                                        </PrimaryButton>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                No tickets available yet
                            </Typography>
                        )}

                        <Divider sx={{ my: 3, borderColor: '#16A34A' }} />

                        <Typography variant="h6" gutterBottom fontWeight="bold" color="#16A34A">
                            Organizer
                        </Typography>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={event.organizerPhoto}
                                alt={event.organizerName}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    border: '2px solid #16A34A'
                                }}
                            />
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {event.organizerName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.organizer?.description || 'Event Organizer'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EventDetails;