import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    CardMedia,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Alert as MuiAlert,
    Avatar,
    Skeleton,
    Paper,
    Stack,
    TextField,
    styled,
    Modal,
    Fade,
    Backdrop,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Security, ConfirmationNumber, LocationOn, CalendarToday, Add, Remove } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';
import { Helmet } from 'react-helmet';
import useUser from '../../hooks/useUser';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';

const PrimaryButton = styled(Button)(() => ({
    backgroundColor: '#16A34A',
    '&:hover': {
        backgroundColor: '#138636',
    },
    borderRadius: '5px',
    padding: '8px 24px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const TicketCard = styled(Paper)(({ theme, selected }) => ({
    padding: theme.spacing(2),
    border: `2px solid ${selected ? '#16A34A' : theme.palette.divider}`,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    backgroundColor: selected ? '#F0FFF4' : theme.palette.background.paper,
    '&:hover': {
        borderColor: '#16A34A',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
        transform: 'translateY(-2px)',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
}));

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    padding: theme.spacing(4),
    outline: 'none',
}));

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [axiosSecure] = useAxios();
    const { user } = useAuth();
    const [isUser, isUserLoading] = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [agree, setAgree] = useState(false);
    const [ticketQuantities, setTicketQuantities] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userDetails, setUserDetails] = useState({
        phone: user?.phoneNumber || '',
        designation: '',
        institute: '',
    });

    const event = location.state;

    // Initialize ticket quantities
    useEffect(() => {
        if (event?.allTickets) {
            const initialQuantities = {};
            event.allTickets.forEach(ticket => {
                initialQuantities[ticket._id] = event.selectedTicket?.ticketId === ticket._id ? event.selectedTicket.quantity : 0;
            });
            setTicketQuantities(initialQuantities);
        }
    }, [event]);

    // Calculate prices
    const { total } = useMemo(() => {
        if (!event || !event.allTickets) return { subtotal: 0, total: 0 };

        const sub = event.allTickets.reduce((sum, ticket) => {
            return sum + (ticket.price * (ticketQuantities[ticket._id] || 0));
        }, 0);

        return {
            subtotal: sub,
            total: sub,
        };
    }, [event, ticketQuantities]);

    // Redirect if no event state
    useEffect(() => {
        if (!event) navigate('/events');
    }, [event, navigate]);

    const handleOpenModal = (ticket) => {
        setSelectedTicket(ticket);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedTicket(null);
    };

    const handleQuantityChange = (ticketId, value) => {
        const numValue = parseInt(value) || 0;
        setTicketQuantities(prev => ({
            ...prev,
            [ticketId]: Math.max(0, Math.min(numValue, event.allTickets.find(t => t._id === ticketId).quantity))
        }));
    };

    const handleAddTicket = () => {
        if (!userDetails.phone || !userDetails.designation || !userDetails.institute) {
            setError('Please fill in all required fields');
            return;
        }
        handleQuantityChange(selectedTicket._id, (ticketQuantities[selectedTicket._id] || 0) + 1);
        handleCloseModal();
    };

    const handleDecrement = (ticketId) => {
        setTicketQuantities(prev => ({
            ...prev,
            [ticketId]: Math.max(0, (prev[ticketId] || 0) - 1)
        }));
    };

    const handleEnroll = async () => {
        if (!user || !isUser) {
            setError('Please log in as a user to purchase tickets');
            return;
        }
        if (!Object.values(ticketQuantities).some(qty => qty > 0)) {
            setError('Please select at least one ticket');
            return;
        }
        if (!event.isFreeEvent && !agree) {
            setError('Please agree to the terms and privacy policy');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const selectedTickets = event.allTickets.filter(t => ticketQuantities[t._id] > 0)
                .map(t => ({
                    ticketId: t._id,
                    quantity: ticketQuantities[t._id]
                }));

            if (event.isFreeEvent) {
                await axiosSecure.post('/api/event-registrations', {
                    eventId: event.eventId,
                    tickets: selectedTickets,
                    email: user.email,
                    paymentStatus: 'free',
                    amount: 0,
                    userDetails,
                });
                navigate(`/events/${event.eventId}`, { state: { registered: true } });
            } else {
                const body = {
                    eventId: event.eventId,
                    tickets: selectedTickets,
                    amount: total.toFixed(2),
                    customerName: user.displayName || '',
                    customerEmail: user.email,
                    customerPhone: userDetails.phone,
                    userDetails,
                };
                console.log('Enrollment data:', body); // Updated to include userDetails in console.log
                const { data } = await axiosSecure.post('/api/payments/sslcommerz/initiate', body);
                window.location.href = data.GatewayPageURL;
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to process registration');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('MMMM D, YYYY');
    };

    const formatTime = (dateString) => {
        return dayjs(dateString).format('h:mm A');
    };

    if (!event) {
        return (
            <Container sx={{ py: 4 }}>
                <MuiAlert severity="error">No event selected.</MuiAlert>
            </Container>
        );
    }

    if (isUserLoading) {
        return (
            <Box sx={{ minHeight: '100vh' }}>
                <SectionTitle
                    title="Checkout"
                    bgColor="#EFF6FF"
                    paddingY={3}
                    titleVariant="h3"
                    titleFontWeight="700"
                    breadcrumbs={[
                        { label: 'Evento', href: '/' },
                        { label: 'Events', href: '/events' },
                        { label: 'Checkout', href: '/checkout' },
                    ]}
                />
                <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 2 }, pb: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
                    <Skeleton variant="text" width={300} height={40} sx={{ mb: 2, mx: 'auto' }} />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Paper sx={{ flex: 1, p: 3 }}>
                            <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
                            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                                <Box>
                                    <Skeleton variant="text" width={150} height={20} />
                                    <Skeleton variant="text" width={100} height={16} />
                                </Box>
                            </Box>
                        </Paper>
                        <Paper sx={{ flex: 1, p: 3 }}>
                            <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
                            <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
                            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1.5 }} />
                            <Skeleton variant="rectangular" height={48} sx={{ mb: 3 }} />
                        </Paper>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Helmet>
                <title>Checkout - Evento</title>
            </Helmet>
            <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 2 }, pb: { xs: 4, md: 8 }, px: { xs: 2, md: 3 } }}>
                <Typography sx={{ mt: 4, fontWeight: 600, fontSize: { xs: '1.8rem', md: '2rem' }, textAlign: 'center', mb: 4, color: '#1A202C' }}>
                    Complete Your Registration
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Event Summary */}
                    <Paper sx={{ flex: 1, p: 4, borderRadius: '5px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#16A34A' }} gutterBottom>
                            Event Details
                        </Typography>

                        <CardMedia
                            component="img"
                            height="220"
                            image={event.bannerUrl || '/default-event.jpg'}
                            alt={event.eventTitle}
                            sx={{ borderRadius: '12px', mb: 3, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                        />

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1A202C' }} gutterBottom>
                            {event.eventTitle}
                        </Typography>

                        <Box
                            sx={{
                                '& .ql-editor': {
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    padding: 0,
                                    color: 'text.primary',
                                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                                    '& p': {
                                        mb: 3,
                                        color: 'text.secondary',
                                    },
                                },
                            }}
                        >
                            <ReactQuill
                                value={event.eventDescription}
                                readOnly={true}
                                theme="bubble"
                            />
                        </Box>

                        <Divider sx={{ my: 3, borderColor: '#16A34A' }} />

                        <List dense>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#F0FFF4', width: 32, height: 32 }}>
                                        <CalendarToday fontSize="small" sx={{ color: '#16A34A' }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Date & Time"
                                    secondary={`${formatDate(event.eventDate)} at ${formatTime(event.eventDate)}`}
                                    primaryTypographyProps={{ fontWeight: 600, color: '#1A202C' }}
                                    secondaryTypographyProps={{ color: 'text.secondary' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#F0FFF4', width: 32, height: 32 }}>
                                        <LocationOn fontSize="small" sx={{ color: '#16A34A' }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Location"
                                    secondary={
                                        <>
                                            {event.eventLocation}
                                            {event.eventAddress && (
                                                <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                    {event.eventAddress}
                                                </Typography>
                                            )}
                                        </>
                                    }
                                    primaryTypographyProps={{ fontWeight: 600, color: '#1A202C' }}
                                    secondaryTypographyProps={{ color: 'text.secondary' }}
                                />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 3, borderColor: '#16A34A' }} />

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#16A34A' }} gutterBottom>
                            Organizer
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                src={event.organizerPhoto}
                                alt={event.organizerName}
                                sx={{ width: 56, height: 56, mr: 2, border: '2px solid #16A34A' }}
                            />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A202C' }}>
                                    {event.organizerName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.organizerDescription || 'Event Organizer'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Ticket Selection & Payment Section */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 4, mb: 3, position: 'sticky', top: 20, borderTop: '4px solid #16A34A', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#16A34A' }} gutterBottom>
                                Select Your Tickets
                            </Typography>

                            {error && (
                                <MuiAlert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: '8px' }}>
                                    {error}
                                </MuiAlert>
                            )}

                            <Stack spacing={2} sx={{ mb: 3 }}>
                                {event.allTickets?.map(ticket => (
                                    <TicketCard key={ticket._id} selected={ticketQuantities[ticket._id] > 0}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A202C' }}>
                                                {ticket.type}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Available: {ticket.quantity}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#16A34A', fontWeight: 600 }}>
                                                {ticket.price === 0 ? 'FREE' : `৳${ticket.price.toLocaleString()}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconButton
                                                onClick={() => handleDecrement(ticket._id)}
                                                disabled={ticketQuantities[ticket._id] <= 0}
                                                size="small"
                                                sx={{ bgcolor: '#F0FFF4', '&:hover': { bgcolor: '#E6FFED' } }}
                                            >
                                                <Remove fontSize="small" sx={{ color: '#16A34A' }} />
                                            </IconButton>
                                            <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                                                {ticketQuantities[ticket._id] || 0}
                                            </Typography>
                                            <IconButton
                                                onClick={() => handleOpenModal(ticket)}
                                                disabled={ticketQuantities[ticket._id] >= ticket.quantity}
                                                size="small"
                                                sx={{ bgcolor: '#F0FFF4', '&:hover': { bgcolor: '#E6FFED' } }}
                                            >
                                                <Add fontSize="small" sx={{ color: '#16A34A' }} />
                                            </IconButton>
                                        </Box>
                                    </TicketCard>
                                ))}
                            </Stack>

                            <Modal
                                open={openModal}
                                onClose={handleCloseModal}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={openModal}>
                                    <ModalBox>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1A202C' }}>
                                            Add {selectedTicket?.type} Ticket
                                        </Typography>

                                        {/* User Info Section */}
                                        <Box sx={{ mb: 3, p: 2, backgroundColor: '#F0FFF4', borderRadius: '8px' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#16A34A' }}>
                                                Your Information
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Name: {user?.displayName || 'Not provided'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Email: {user?.email || 'Not provided'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={2}>
                                            <TextField
                                                label="Phone Number"
                                                value={userDetails.phone}
                                                onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                                                fullWidth
                                                required
                                                type="tel"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">+880</InputAdornment>,
                                                }}
                                            />
                                            <TextField
                                                label="Designation"
                                                value={userDetails.designation}
                                                onChange={(e) => setUserDetails({ ...userDetails, designation: e.target.value })}
                                                fullWidth
                                                required
                                            />
                                            <TextField
                                                label="Institute"
                                                value={userDetails.institute}
                                                onChange={(e) => setUserDetails({ ...userDetails, institute: e.target.value })}
                                                fullWidth
                                                required
                                            />
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleCloseModal}
                                                    fullWidth
                                                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                                                >
                                                    Cancel
                                                </Button>
                                                <PrimaryButton
                                                    variant="contained"
                                                    onClick={handleAddTicket}
                                                    fullWidth
                                                >
                                                    Add Ticket
                                                </PrimaryButton>
                                            </Box>
                                        </Stack>
                                    </ModalBox>
                                </Fade>
                            </Modal>

                            {Object.values(ticketQuantities).some(qty => qty > 0) && (
                                <>
                                    <Divider sx={{ my: 3, borderColor: '#16A34A' }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#16A34A' }}>
                                        Selected Tickets
                                    </Typography>
                                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                                        {event.allTickets
                                            .filter(ticket => ticketQuantities[ticket._id] > 0)
                                            .map(ticket => (
                                                <Box key={ticket._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A202C' }}>
                                                        {ticket.type} × {ticketQuantities[ticket._id]}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#16A34A' }}>
                                                        ৳{(ticket.price * ticketQuantities[ticket._id]).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            ))}
                                    </Stack>
                                </>
                            )}

                            {!event.isFreeEvent && Object.values(ticketQuantities).some(qty => qty > 0) && (
                                <Stack spacing={2} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A202C' }}>
                                            Total:
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#16A34A' }}>
                                            ৳{total.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}

                            {!event.isFreeEvent && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={agree}
                                            onChange={(e) => setAgree(e.target.checked)}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'Agree to terms and privacy policy' }}
                                            sx={{ color: '#16A34A', '&.Mui-checked': { color: '#16A34A' } }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ color: '#1A202C' }}>
                                            I agree to the{' '}
                                            <a href="/terms" target="_blank" rel="noopener" style={{ color: '#16A34A', fontWeight: 600 }}>
                                                Terms
                                            </a>{' '}
                                            and{' '}
                                            <a href="/privacy" target="_blank" rel="noopener" style={{ color: '#16A34A', fontWeight: 600 }}>
                                                Privacy Policy
                                            </a>
                                        </Typography>
                                    }
                                    sx={{ mb: 3, mt: 2 }}
                                />
                            )}

                            <PrimaryButton
                                fullWidth
                                variant="contained"
                                size="medium"
                                disabled={!isUser || !Object.values(ticketQuantities).some(qty => qty > 0) || (!event.isFreeEvent && !agree) || loading}
                                onClick={handleEnroll}
                                startIcon={<ConfirmationNumber />}
                            >
                                {loading ? 'Processing...' : event.isFreeEvent ? 'Register Now' : 'Proceed to Payment'}
                            </PrimaryButton>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Security sx={{ mr: 1, fontSize: 20, color: '#16A34A' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Secure checkout · SSL encrypted
                                </Typography>
                            </Box>

                            {!isUser && !isUserLoading && (
                                <MuiAlert severity="warning" sx={{ mt: 3, borderRadius: '8px' }}>
                                    Please log in to purchase tickets
                                </MuiAlert>
                            )}
                        </Paper>
                    </Box>
                </Box>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        <Box component="span" sx={{ fontWeight: 600 }}>
                            Need help?
                        </Box>{' '}
                        Contact us at{' '}
                        <a href="mailto:support@evento.com" style={{ color: '#16A34A', fontWeight: 600 }}>
                            support@evento.com
                        </a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Checkout;