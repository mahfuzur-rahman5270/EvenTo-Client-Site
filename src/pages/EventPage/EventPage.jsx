import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Container,
    Grid,
    TextField,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Stack,
    InputAdornment,
    Skeleton,
    Checkbox,
    FormControlLabel,
    Pagination,
    IconButton,
    useMediaQuery,
    Drawer,
    Badge,
    Avatar,
    ThemeProvider,
    createTheme,
    Snackbar,
    Alert as MuiAlert,
    Button,
    Chip,
    Select,
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';

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
            default: '#F8F9FA',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '5px',
                    textTransform: 'none',
                    fontWeight: 400,
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 700,
        },
        subtitle1: {
            fontWeight: 600,
        },
        body2: {
            fontWeight: 400,
        },
    },
});

// Styled components
const PrimaryButton = styled(Button)(() => ({
    backgroundColor: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    padding: '8px 20px',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#13803D',
    },
}));

const EventCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.grey[200]}`,
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '1.25rem',
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: '320px',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        [theme.breakpoints.down('sm')]: {
            width: '90%',
            maxWidth: '350px',
        },
    },
}));

const StickyFilterContainer = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(12),
    overflowY: 'auto',
    paddingRight: theme.spacing(2),
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.grey[100],
        borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: '5px',
    },
    [theme.breakpoints.down('md')]: {
        position: 'static',
        height: 'auto',
        overflowY: 'visible',
    },
}));

const EventsPage = () => {
    const [axiosSecure] = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        categories: [],
        status: [],
        priceType: 'all',
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('date');
    const eventsPerPage = 9;
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Extract category from query parameter on initial load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setFilters((prev) => ({
                ...prev,
                categories: [decodeURIComponent(category)],
            }));
            setCurrentPage(1);
        }
    }, [location.search]);

    // Fetch events
    const { data: events = [], isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/events');
            return res.data.filter((event) => event.status === 'upcoming' || event.status === 'live');
        },
        onError: () => {
            setAlert({
                open: true,
                message: 'Failed to load events. Please try again later.',
                severity: 'error',
            });
        },
    });

    const allCategories = useMemo(() => [...new Set(events.flatMap((event) => event.categories || []))], [events]);
    const allStatuses = useMemo(() => [...new Set(events.map((event) => event.status))], [events]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesSearch =
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                filters.categories.length === 0 ||
                (event.categories && event.categories.some((cat) => filters.categories.includes(cat)));

            const matchesStatus =
                filters.status.length === 0 || filters.status.includes(event.status);

            let matchesPrice = true;
            if (filters.priceType === 'free') {
                matchesPrice = event.tickets?.some((ticket) => ticket.price === 0);
            } else if (filters.priceType === 'paid') {
                matchesPrice = event.tickets?.some((ticket) => ticket.price > 0);
            }

            return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
        });
    }, [events, searchTerm, filters]);

    const sortedEvents = useMemo(() => {
        if (sortBy === 'date') {
            return [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'price-low') {
            return [...filteredEvents].sort((a, b) => {
                const minPriceA = Math.min(...(a.tickets?.map((t) => t.price) || [0]));
                const minPriceB = Math.min(...(b.tickets?.map((t) => t.price) || [0]));
                return minPriceA - minPriceB;
            });
        } else if (sortBy === 'price-high') {
            return [...filteredEvents].sort((a, b) => {
                const minPriceA = Math.min(...(a.tickets?.map((t) => t.price) || [0]));
                const minPriceB = Math.min(...(b.tickets?.map((t) => t.price) || [0]));
                return minPriceB - minPriceA;
            });
        }
        return filteredEvents;
    }, [filteredEvents, sortBy]);

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleCardClick = (eventId, e) => {
        if (e.target.closest('button')) return;
        navigate(`/events/${eventId}`);
        window.scrollTo(0, 0);
    };

    const handleCategoryChange = (category) => {
        setFilters((prev) => {
            const newCategories = prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: newCategories };
        });
        setCurrentPage(1);
    };

    const handleStatusChange = (status) => {
        setFilters((prev) => {
            const newStatuses = prev.status.includes(status)
                ? prev.status.filter((s) => s !== status)
                : [...prev.status, status];
            return { ...prev, status: newStatuses };
        });
        setCurrentPage(1);
    };

    const handlePriceTypeChange = (type) => {
        setFilters((prev) => ({ ...prev, priceType: type }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            categories: [],
            status: [],
            priceType: 'all',
        });
        setSearchTerm('');
        setCurrentPage(1);
    };

    const countEventsByCategory = (category) => {
        return events.filter((event) => event.categories?.includes(category)).length;
    };

    const countActiveFilters = () => {
        let count = 0;
        if (filters.categories.length > 0) count += filters.categories.length;
        if (filters.status.length > 0) count += filters.status.length;
        if (filters.priceType !== 'all') count += 1;
        if (searchTerm) count += 1;
        return count;
    };

    const getPriceDisplay = (event) => {
        if (!event.tickets || event.tickets.length === 0) {
            return { priceText: 'Free', showRange: false };
        }

        const ticketPrices = event.tickets.map((ticket) => ticket.price || 0);
        const minPrice = Math.min(...ticketPrices);
        const maxPrice = Math.max(...ticketPrices);

        if (minPrice === 0 && maxPrice === 0) {
            return { priceText: 'Free', showRange: false };
        } else if (minPrice === maxPrice) {
            return { priceText: `৳${minPrice}`, showRange: false };
        } else {
            return { priceText: `৳${minPrice} - ৳${maxPrice}`, showRange: true };
        }
    };

    const renderFilters = () => (
        <Box sx={{ mb: 4, height: '100%' }}>
            {isLoading ? (
                <Box>
                    <Skeleton width="60%" height={30} />
                    <Skeleton width="80%" height={40} sx={{ mt: 2 }} />
                    <Skeleton width="70%" height={30} sx={{ mt: 2 }} />
                    <Skeleton width="90%" height={40} sx={{ mt: 2 }} />
                </Box>
            ) : (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography fontWeight={600} color="text.primary">
                            Filters
                            {countActiveFilters() > 0 && (
                                <Chip
                                    label={countActiveFilters()}
                                    size="small"
                                    color="primary"
                                    sx={{ ml: 1, fontWeight: 600 }}
                                />
                            )}
                        </Typography>
                        <Button
                            onClick={resetFilters}
                            variant="text"
                            size="small"
                            disabled={countActiveFilters() === 0}
                            sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                            Reset
                        </Button>
                    </Box>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search events..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '8px',
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={600} sx={{ mb: 2 }} color="text.primary">
                            Categories
                        </Typography>
                        <Box sx={{ overflowY: 'auto', maxHeight: '200px' }}>
                            {allCategories.map((category) => (
                                <Box
                                    key={category}
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.categories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                                size="small"
                                                color="primary"
                                            />
                                        }
                                        label={<Typography variant="body2">{category}</Typography>}
                                    />
                                    <Chip
                                        label={countEventsByCategory(category)}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={600} sx={{ mb: 2 }} color="text.primary">
                            Status
                        </Typography>
                        <Stack spacing={1}>
                            {allStatuses.map((status) => (
                                <FormControlLabel
                                    key={status}
                                    control={
                                        <Checkbox
                                            checked={filters.status.includes(status)}
                                            onChange={() => handleStatusChange(status)}
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="body2">{status.charAt(0).toUpperCase() + status.slice(1)}</Typography>}
                                    sx={{ m: 0 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography fontWeight={600} sx={{ mb: 2 }} color="text.primary">
                            Price
                        </Typography>
                        <Stack spacing={1}>
                            {['all', 'free', 'paid'].map((type) => (
                                <FormControlLabel
                                    key={type}
                                    control={
                                        <Checkbox
                                            checked={filters.priceType === type}
                                            onChange={() => handlePriceTypeChange(type)}
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="body2">{type.charAt(0).toUpperCase() + type.slice(1) + (type === 'all' ? ' Events' : ' Events')}</Typography>}
                                    sx={{ m: 0 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </>
            )}
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <SectionTitle
                title="Events"
                bgColor="#EFF6FF"
                paddingY={0}
                titleVariant="h3"
                titleFontWeight="600"
                breadcrumbs={[
                    { label: 'Shamz Academy', href: '/' },
                    { label: 'Events', href: '/events' },
                ]}
            />
            <Box sx={{ mb: 8, px: { xs: 2, md: 13 } }}>
                <Helmet>
                    <title>Events - Shamz Academy</title>
                    <meta name="description" content="Browse our upcoming events to enhance your skills and knowledge." />
                </Helmet>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                            {isMobile && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                    <Badge badgeContent={countActiveFilters()} color="primary">
                                        <PrimaryButton
                                            startIcon={<FilterListIcon />}
                                            onClick={() => setMobileFiltersOpen(true)}
                                        >
                                            Filters
                                        </PrimaryButton>
                                    </Badge>
                                </Box>
                            )}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                mb: 4,
                                p: 2,
                                borderRadius: '8px',
                                backgroundColor: 'background.paper',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                gap: 2
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }} color="text.primary">
                                    {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                                    {countActiveFilters() > 0 && (
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                        >
                                            (filtered)
                                        </Typography>
                                    )}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" display="inline" sx={{ mr: 1 }}>
                                        Sort by:
                                    </Typography>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{
                                            fontSize: '14px',
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                            padding: '6px 12px',
                                            borderRadius: '5px',
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            outline: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="date">Date</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </Box>
                            </Box>
                            {isLoading ? (
                                <Grid container spacing={3}>
                                    {[...Array(6)].map((_, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px' }} />
                                            <Box sx={{ pt: 1 }}>
                                                <Skeleton width="80%" height={30} />
                                                <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
                                                <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : filteredEvents.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 10,
                                        textAlign: 'center',
                                        backgroundColor: 'background.paper',
                                        borderRadius: '12px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <Box sx={{ mb: 3 }}>
                                        <Avatar
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                bgcolor: 'background.default',
                                                '& img': {
                                                    objectFit: 'contain',
                                                },
                                            }}
                                        >
                                            <Box sx={{ fontSize: 60 }}>🔍</Box>
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h5" gutterBottom color="text.primary">
                                        No events found
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 2, maxWidth: '400px' }}>
                                        We couldn't find any events matching your search. Try adjusting your filters or search term.
                                    </Typography>
                                    <PrimaryButton onClick={resetFilters} sx={{ mt: 2 }}>
                                        Reset All Filters
                                    </PrimaryButton>
                                </Box>
                            ) : (
                                <>
                                    <Grid container spacing={3}>
                                        {currentEvents.map((event) => (
                                            <Grid item xs={12} sm={6} md={4} key={event._id}>
                                                <EventCard>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <CardMedia
                                                            component="img"
                                                            image={event.banner || '/images/event-placeholder.jpg'}
                                                            alt={event.title}
                                                            role="button"
                                                            aria-label={`View details for ${event.title}`}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                objectFit: 'cover',
                                                                height: '180px',
                                                                width: '100%',
                                                            }}
                                                            onClick={() => navigate(`/events/${event._id}`)}
                                                        />
                                                        {event.status === 'live' && (
                                                            <Chip
                                                                label="Live"
                                                                color="success"
                                                                size="small"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 10,
                                                                    right: 10,
                                                                    fontWeight: 600,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: 'space-between' }}>
                                                            <Chip
                                                                label={event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <CalendarTodayIcon
                                                                    sx={{
                                                                        fontSize: '1rem',
                                                                        color: 'text.secondary',
                                                                        opacity: 0.8,
                                                                    }}
                                                                />
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {dayjs(event.date).format('MMM D, YYYY')}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                        <Typography
                                                            gutterBottom
                                                            variant="h6"
                                                            component="h2"
                                                            role="link"
                                                            aria-label={`View details for ${event.title}`}
                                                            sx={{
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                '&:hover': {
                                                                    color: 'primary.main',
                                                                },
                                                            }}
                                                            onClick={(e) => handleCardClick(event._id, e)}
                                                        >
                                                            {event.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {event.location}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar
                                                                src={event.organizerPhoto}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    mr: 1.5,
                                                                    bgcolor: 'primary.main',
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {event.organizerName?.charAt(0) || 'O'}
                                                            </Avatar>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {event.organizerName || 'Organizer'}
                                                            </Typography>
                                                        </Box>
                                                        <PriceTypography>{getPriceDisplay(event).priceText}</PriceTypography>
                                                    </CardContent>
                                                </EventCard>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {totalPages > 1 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                shape="rounded"
                                                showFirstButton
                                                showLastButton
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </Grid>
                        {!isMobile ? (
                            <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
                                <StickyFilterContainer>
                                    <Box sx={{
                                        p: 3,
                                        borderRadius: '5px',
                                        backgroundColor: 'background.paper',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        width: '100%',
                                    }}>
                                        {renderFilters()}
                                    </Box>
                                </StickyFilterContainer>
                            </Grid>
                        ) : (
                            <FilterDrawer
                                anchor="left"
                                open={mobileFiltersOpen}
                                onClose={() => setMobileFiltersOpen(false)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <IconButton onClick={() => setMobileFiltersOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                {renderFilters()}
                            </FilterDrawer>
                        )}
                    </Grid>
                </Container>
                <Snackbar
                    open={alert.open}
                    autoHideDuration={6000}
                    onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MuiAlert
                        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
                        severity={alert.severity}
                        sx={{ width: '100%' }}
                        elevation={6}
                        variant="filled"
                    >
                        {alert.message}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default EventsPage;