import { Box, Paper, Typography, Avatar, Button, Card, CardContent, Tabs, Tab, Badge, Divider, Grid } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet";
import { Mail, Phone, Person, QrCode, CalendarToday, History, Edit } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import {QRCodeSVG} from 'qrcode.react';

const UserHome = () => {
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const [axiosSecure] = useAxios();

    // Fetch purchased events
    const { data: purchasedEvents = [], isLoading, isError } = useQuery({
        queryKey: ['customer', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/api/order/customer/${user?.email}`);
            return res.data || [];
        },
        enabled: !!user?.email,
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return "Good morning";
        if (currentHour < 18) return "Good afternoon";
        return "Good evening";
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <Box sx={{ backgroundColor: 'grey.50', minHeight: '100vh', px: { xs: 2, md: 17.5 }, py: 4 }}>
            <Helmet>
                <title>User Home - Evento</title>
            </Helmet>

            {/* Profile Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
                    <Card sx={{
                        borderRadius: 3,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'linear-gradient(to right, #f0fdf4, white)'
                    }}>
                        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                            <Box sx={{
                                                backgroundColor: '#16A34A',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid white'
                                            }}>
                                                <Edit fontSize="small" />
                                            </Box>
                                        }
                                    >
                                        <Avatar
                                            src={user?.photoURL || "https://www.gravatar.com/avatar/65ce5e9ab0120c0dc411d4c128ccda20?d=https%3A%2F%2Fimg.icons8.com%2Fbubbles%2F100%2F000000%2Fuser.png&s=240"}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: '3px solid #16A34A'
                                            }}
                                        />
                                    </Badge>
                                </Grid>

                                <Grid item xs={12} sm={9} sx={{ display: { xs: 'block', md: 'none' } }}>
                                    <Typography variant="h6" align="right" fontWeight="bold" color="text.primary">
                                        {getGreeting()}, {user?.displayName || "User"}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                        <Badge sx={{
                                            backgroundColor: '#dcfce7',
                                            color: '#166534',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Mail fontSize="small" sx={{ mr: 0.5 }} />
                                            {user?.email || "No email"}
                                        </Badge>
                                        <Badge sx={{
                                            backgroundColor: '#dcfce7',
                                            color: '#166534',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                            {user?.phoneNumber || "None"}
                                        </Badge>
                                    </Box>
                                </Grid>

                                <Grid item md={10} sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="h4" fontWeight="bold" sx={{
                                                maxWidth: 600,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: 'text.primary',
                                                mb: 1
                                            }}>
                                                {getGreeting()}, {user?.displayName || "User"}
                                            </Typography>
                                            <Box sx={{ mt: 1.5 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Mail fontSize="small" sx={{
                                                        mr: 1.5,
                                                        color: '#16A34A',
                                                        backgroundColor: '#dcfce7',
                                                        borderRadius: '50%',
                                                        p: 0.5
                                                    }} />
                                                    <Typography variant="body1" component="span" sx={{ color: 'text.secondary' }}>
                                                        {user?.email || "No email"}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Phone fontSize="small" sx={{
                                                        mr: 1.5,
                                                        color: '#16A34A',
                                                        backgroundColor: '#dcfce7',
                                                        borderRadius: '50%',
                                                        p: 0.5
                                                    }} />
                                                    <Typography variant="body1" component="span" sx={{ color: 'text.secondary' }}>
                                                        {user?.phoneNumber || "None"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    sx={{
                                                        backgroundColor: '#16A34A',
                                                        '&:hover': {
                                                            backgroundColor: '#15803d'
                                                        },
                                                        px: 3,
                                                        borderRadius: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    startIcon={<Edit />}
                                                    onClick={handleEditProfile}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 3 }}>
                                            <Card sx={{
                                                backgroundColor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                textAlign: 'center',
                                                minWidth: 140,
                                                borderRadius: 2
                                            }}>
                                                <CardContent sx={{ p: 2 }}>
                                                    <Typography variant="body2" color="#166534">Your Total Orders:</Typography>
                                                    <Typography variant="h5" color="#16A34A" fontWeight="bold" sx={{ mt: 1 }}>
                                                        {purchasedEvents?.count || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            <Card sx={{
                                                backgroundColor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                textAlign: 'center',
                                                minWidth: 140,
                                                borderRadius: 2
                                            }}>
                                                <CardContent sx={{ p: 2 }}>
                                                    <Typography variant="body2" color="#166534">Your Total Tickets:</Typography>
                                                    <Typography variant="h5" color="#16A34A" fontWeight="bold" sx={{ mt: 1 }}>
                                                        {purchasedEvents?.data?.reduce((total, event) => total + event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0), 0) || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Divider sx={{ display: { xs: 'block', md: 'none' }, borderColor: '#e5e7eb' }} />

                        <Box sx={{ p: 2, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 2 }}>
                            <Button
                                variant="contained"
                                size="medium"
                                sx={{
                                    backgroundColor: '#16A34A',
                                    '&:hover': {
                                        backgroundColor: '#15803d'
                                    },
                                    borderRadius: 2
                                }}
                                startIcon={<Edit />}
                                onClick={handleEditProfile}
                            >
                                Edit
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Box>

            {/* Tabs Section */}
            <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
                <Paper sx={{
                    mb: 3,
                    border: 'none',
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#16A34A',
                                height: 3
                            }
                        }}
                    >
                        <Tab
                            icon={<QrCode fontSize="small" />}
                            iconPosition="start"
                            label="TICKIPASS"
                            sx={{
                                color: tabValue === 0 ? '#16A34A' : 'text.secondary',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                minHeight: 48,
                                '&.Mui-selected': {
                                    color: '#16A34A'
                                }
                            }}
                        />
                        <Tab
                            icon={<CalendarToday fontSize="small" />}
                            iconPosition="start"
                            label="ORDERS"
                            sx={{
                                color: tabValue === 1 ? '#16A34A' : 'text.secondary',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                minHeight: 48,
                                '&.Mui-selected': {
                                    color: '#16A34A'
                                }
                            }}
                        />
                        <Tab
                            icon={<History fontSize="small" />}
                            iconPosition="start"
                            label="HISTORY"
                            sx={{
                                color: tabValue === 2 ? '#16A34A' : 'text.secondary',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                minHeight: 48,
                                '&.Mui-selected': {
                                    color: '#16A34A'
                                }
                            }}
                        />
                    </Tabs>
                </Paper>

                <Box sx={{ pt: 1 }}>
                    {tabValue === 0 && (
                        <Box>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">Upcoming Event Passes</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                    Easy access to tickets | simple to scan or download as a PDF!
                                </Typography>
                            </Box>

                            {isLoading ? (
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                                    Loading tickets...
                                </Typography>
                            ) : isError ? (
                                <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>
                                    Failed to load tickets. Please try again later.
                                </Typography>
                            ) : purchasedEvents?.data?.length > 0 ? (
                                <Grid container spacing={3}>
                                    {purchasedEvents.data.map((event) => (
                                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                                            <Card sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: 'background.paper'
                                            }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                                                        {event.eventId.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                        {new Date(event.eventId.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        <Person fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                        {event.eventId.location}
                                                    </Typography>
                                                    {event.tickets.map((ticket) => (
                                                        <Box key={ticket.ticketId} sx={{ mb: 2 }}>
                                                            <Typography variant="body1" fontWeight="medium">
                                                                {ticket.type} Ticket (x{ticket.quantity})
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Price: {ticket.price} {event.currency}
                                                            </Typography>
                                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                                                <QRCodeSVG
                                                                    value={`Ticket ID: ${ticket.ticketId}, Event: ${event.eventId.title}, Type: ${ticket.type}, Quantity: ${ticket.quantity}`}
                                                                    size={150}
                                                                    bgColor="#ffffff"
                                                                    fgColor="#000000"
                                                                />
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                        Transaction ID: {event.transactionId}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Purchased on: {new Date(event.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Card sx={{
                                    backgroundColor: 'background.paper',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    textAlign: 'center',
                                    p: 6,
                                    border: '2px dashed #e5e7eb'
                                }}>
                                    <Box sx={{ mb: 4 }}>
                                        <img
                                            src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/cart-empty.png"
                                            alt="Empty cart"
                                            style={{ maxWidth: 160, opacity: 0.7 }}
                                        />
                                    </Box>
                                    <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
                                        You have no tickets to show.
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" gutterBottom sx={{ maxWidth: 500, mx: 'auto' }}>
                                        You haven't purchased any ticket yet. Explore our exciting events and get your tickets now to enjoy amazing experiences.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#16A34A',
                                            '&:hover': {
                                                backgroundColor: '#15803d'
                                            },
                                            px: 4,
                                            py: 0.8,
                                            borderRadius: 1,
                                            mt: 3,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Browse Events
                                    </Button>
                                </Card>
                            )}
                        </Box>
                    )}

                    {tabValue === 1 && (
                        <Card sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            textAlign: 'center',
                            p: 6,
                            border: '2px dashed #e5e7eb'
                        }}>
                            <Box sx={{ mb: 4 }}>
                                <img
                                    src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/cart-empty.png"
                                    alt="Empty cart"
                                    style={{ maxWidth: 160, opacity: 0.7 }}
                                />
                            </Box>
                            <Typography variant="h5" gutterBottom fontWeight="bold" color="text.primary">
                                You have no orders yet.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ maxWidth: 500, mx: 'auto' }}>
                                Your order history is currently empty. Discover our events and make your first purchase today!
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#16A34A',
                                    '&:hover': {
                                        backgroundColor: '#15803d'
                                    },
                                    px: 4,
                                    py: 0.8,
                                    borderRadius: 1,
                                    mt: 3,
                                    textTransform: 'none'
                                }}
                            >
                                Browse Events
                            </Button>
                        </Card>
                    )}

                    {tabValue === 2 && (
                        <Box>
                            {/* History content would go here */}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default UserHome;