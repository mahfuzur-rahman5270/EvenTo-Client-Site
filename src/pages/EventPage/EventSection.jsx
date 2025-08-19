import useAxios from '../../hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Skeleton,
    Typography
} from '@mui/material';
import {
    LocationOn,
    LocalOffer,
    Event
} from '@mui/icons-material';

const EventSection = () => {
    const [axiosSecure] = useAxios();
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    // Fetch events
    const { data: events = [], isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/events');
            return res.data.filter((event) => event.status === 'upcoming');
        },
        onError: () => {
            setAlert({
                open: true,
                message: 'Failed to load events. Please try again later.',
                severity: 'error',
            });
        },
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.getDate();
    };

    const formatMonth = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('default', { month: 'short' });
    };

    const getMinPrice = (tickets) => {
        if (!tickets || tickets.length === 0) return 'Free';
        const minPrice = Math.min(...tickets.map(ticket => ticket.price));
        return `৳${minPrice.toLocaleString()}`;
    };

    if (isError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, px: 12 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load events. Please refresh the page or try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 4, px: 14 }}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <div className="grid grid-cols-1 pb-6 text-center">
                    <Typography sx={{ mt: 4, fontWeight: 600, fontSize: '2rem' }}>Explore Upcomings!</Typography>
                    <p>Explore the Universe of Events at Your Fingertips.</p>
                </div>
            </Box>
            <Container maxWidth="xl">
                {alert.open && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert({ ...alert, open: false })}
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <Skeleton variant="rectangular" height={200} />
                                    <CardContent>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : events.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Event color="disabled" sx={{ fontSize: 60 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No upcoming events found
                                </Typography>
                            </Box>
                        </Grid>
                    ) : (
                        events.map((event) => (
                            <Grid item xs={12} sm={6} md={4} key={event._id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <CardActionArea
                                        href={`/events/${event._id}`}
                                        sx={{ flexGrow: 1 }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={event.banner}
                                            alt={event.title}
                                            sx={{
                                                objectFit: 'cover',
                                                height: '210px',
                                                width: '100%'
                                            }}
                                        />

                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                                noWrap
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {event.title}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                                                <Box sx={{ textAlign: 'center', bgcolor: 'black', color: 'white', p: 1, borderRadius: 1.5, px: 1.5 }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {formatDate(event.date)}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {formatMonth(event.date)}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        overflow: 'hidden'
                                                    }}>
                                                        <LocationOn
                                                            color="success"
                                                            fontSize="small"
                                                            sx={{ mr: 1, flexShrink: 0 }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            noWrap
                                                        >
                                                            {event.location}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocalOffer
                                                            color="success"
                                                            fontSize="small"
                                                            sx={{ mr: 1 }}
                                                        />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Price Start From {getMinPrice(event.tickets)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default EventSection;