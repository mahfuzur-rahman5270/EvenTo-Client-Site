import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
    Box,
    Button,
    Typography,
    Grid,
    Alert,
    Snackbar,
    Avatar,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress,
    Paper,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useAxios from '../../hooks/useAxios';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)',
    color: 'white',
    borderRadius: '5px',
    padding: '6px 12px',
    fontWeight: 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #5B37A1 0%, #2563EB 100%)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
        transform: 'translateY(-1px)',
    },
    '&:disabled': {
        background: theme.palette.grey[300],
        color: theme.palette.grey[500],
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '3px',
        backgroundColor: theme.palette.background.paper,
        '& fieldset': {
            borderColor: '#6B46C1',
        },
        '&:hover fieldset': {
            borderColor: '#5B37A1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5B37A1',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6B46C1',
        fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#5B37A1',
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        '& fieldset': {
            borderColor: '#6B46C1',
        },
        '&:hover fieldset': {
            borderColor: '#5B37A1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5B37A1',
            borderWidth: '2px',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#6B46C1',
        fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#5B37A1',
    },
}));

const StyledSelect = styled(Select)(() => ({
    borderRadius: '8px',
    '& .MuiSelect-select': {
        padding: '8px 12px',
    },
}));

const StyledAutocomplete = styled(Autocomplete)(() => ({
    '& .MuiAutocomplete-inputRoot': {
        borderRadius: '8px',
        '& fieldset': {
            borderColor: '#6B46C1',
        },
        '&:hover fieldset': {
            borderColor: '#5B37A1',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5B37A1',
            borderWidth: '2px',
        },
    },
}));

const StyledChip = styled(Chip)(() => ({
    backgroundColor: '#e8e6f8',
    color: '#6B46C1',
    fontWeight: 500,
    '& .MuiChip-deleteIcon': {
        color: '#5B37A1',
    },
}));

const StyledIconButton = styled(IconButton)(() => ({
    color: '#6B46C1',
    '&:hover': {
        backgroundColor: 'rgba(91, 55, 161, 0.04)',
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    margin: theme.spacing(2, 0),
    overflowX: 'auto',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        
    },
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
        transition: 'background-color 0.2s ease',
    },
}));

const StyledTableCell = styled(TableCell)(() => ({
    color: '#1a237e',
    fontWeight: 500,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    backgroundColor: theme.palette.grey[50],
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: theme.palette.grey[50],
    },
}));

const StyledLinearProgress = styled(LinearProgress)(() => ({
    backgroundColor: '#e8e6f8',
    '& .MuiLinearProgress-bar': {
        backgroundColor: '#6B46C1',
    },
}));

const EventsManagement = () => {
    const [axiosSecure] = useAxios();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: dayjs(),
        location: '',
        status: 'upcoming',
        categories: [],
        newCategory: '',
        banner: '',
        organizerName: '',
        organizerPhoto: '',
    });

    // Fetch events and categories
    const { data: events = [], isLoading, isError } = useQuery({
        queryKey: ['admin-events'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/events');
            return res.data || [];
        },
        onError: () => {
            setAlert({
                open: true,
                message: 'Failed to load events',
                severity: 'error',
            });
        },
    });

    // Get unique categories from all events
    const allCategories = [...new Set(events.flatMap((event) => event.categories || []))];

    // Create or update event mutation
    const { mutate: mutateEvent } = useMutation({
        mutationFn: async (eventData) => {
            if (eventData._id) {
                const res = await axiosSecure.put(`/api/events/${eventData._id}`, eventData);
                return res.data;
            } else {
                const res = await axiosSecure.post('/api/events', eventData);
                return res.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            setAlert({
                open: true,
                message: selectedEvent ? 'Event updated successfully' : 'Event created successfully',
                severity: 'success',
            });
            handleCloseDialog();
        },
        onError: (error) => {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'An error occurred',
                severity: 'error',
            });
        },
    });

    // Delete event mutation
    const { mutate: deleteEvent } = useMutation({
        mutationFn: async (eventId) => {
            const res = await axiosSecure.delete(`/api/events/${eventId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-events']);
            setAlert({
                open: true,
                message: 'Event deleted successfully',
                severity: 'success',
            });
            setOpenDeleteDialog(false);
        },
        onError: (error) => {
            setAlert({
                open: true,
                message: error.response?.data?.message || 'Failed to delete event',
                severity: 'error',
            });
        },
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenDialog = (event = null) => {
        setSelectedEvent(event);
        if (event) {
            setFormData({
                ...event,
                date: dayjs(event.date),
                categories: event.categories || [],
                newCategory: '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                date: dayjs(),
                location: '',
                status: 'upcoming',
                categories: [],
                newCategory: '',
                banner: '',
                organizerName: '',
                organizerPhoto: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEvent(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            date,
        }));
    };

    const handleStatusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.value,
        }));
    };

    const handleCategoryChange = (event, newValue) => {
        setFormData((prev) => ({
            ...prev,
            categories: newValue,
        }));
    };

    const handleAddNewCategory = () => {
        if (formData.newCategory.trim() && !formData.categories.includes(formData.newCategory.trim())) {
            setFormData((prev) => ({
                ...prev,
                categories: [...prev.categories, prev.newCategory.trim()],
                newCategory: '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate required fields
        if (!formData.title || !formData.location || !formData.date || !formData.organizerName || !formData.categories.length) {
            setAlert({
                open: true,
                message: 'Please fill all required fields',
                severity: 'error',
            });
            return;
        }

        const eventData = {
            ...formData,
            date: formData.date.toISOString(),
            newCategory: undefined,
        };
        mutateEvent(eventData);
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        deleteEvent(selectedEvent._id);
    };

    const handleCloseAlert = () => {
        setAlert((prev) => ({ ...prev, open: false }));
    };

    const handleViewDetails = (eventId) => {
        // Placeholder for navigation, e.g., using react-router-dom
        // navigate(`/admin/events/${eventId}`);
        console.log(`View details for event ID: ${eventId}`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ py: 3, px: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#1a237e' }}>
                        Events Management
                    </Typography>
                    <StyledButton
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        size="small"
                        aria-label="Add new event"
                    >
                        Add New Event
                    </StyledButton>
                </Box>

                {isLoading && <StyledLinearProgress />}

                {isError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', backgroundColor: '#e8e6f8', color: '#6B46C1' }}>
                        Failed to load events. Please try again later.
                    </Alert>
                )}

                <StyledPaper>
                    <StyledTableContainer>
                        <Table aria-label="events management table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f7ff' }}>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Banner</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Title</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Date</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Location</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Status</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Categories</StyledTableCell>
                                    <StyledTableCell sx={{ fontWeight: 'bold' }}>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {events.length === 0 && !isLoading && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                No events found.
                                            </Typography>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                                {events
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((event) => (
                                        <StyledTableRow key={event._id}>
                                            <StyledTableCell>
                                                <Avatar
                                                    src={event.banner || ''}
                                                    variant="square"
                                                    sx={{ width: 60, height: 40, borderRadius: '4px' }}
                                                    alt={`Banner for ${event.title}`}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>{event.title || 'N/A'}</StyledTableCell>
                                            <StyledTableCell>
                                                {event.date ? dayjs(event.date).format('MMM D, YYYY') : 'N/A'}
                                            </StyledTableCell>
                                            <StyledTableCell>{event.location || 'N/A'}</StyledTableCell>
                                            <StyledTableCell>
                                                <StyledChip
                                                    label={event.status || 'N/A'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            event.status === 'live'
                                                                ? '#e8f5e9'
                                                                : event.status === 'upcoming'
                                                                    ? '#e8e6f8'
                                                                    : event.status === 'completed'
                                                                        ? '#e0f7fa'
                                                                        : '#ffebee',
                                                        color:
                                                            event.status === 'live'
                                                                ? '#2e7d32'
                                                                : event.status === 'upcoming'
                                                                    ? '#6B46C1'
                                                                    : event.status === 'completed'
                                                                        ? '#006064'
                                                                        : '#c62828',
                                                    }}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    {(event.categories || []).map((category, index) => (
                                                        <StyledChip key={index} label={category} size="small" />
                                                    ))}
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View Details">
                                                        <StyledIconButton
                                                            onClick={() => handleViewDetails(event._id)}
                                                            aria-label={`View details for ${event.title}`}
                                                        >
                                                            <VisibilityIcon />
                                                        </StyledIconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <StyledIconButton
                                                            onClick={() => handleOpenDialog(event)}
                                                            aria-label={`Edit ${event.title}`}
                                                        >
                                                            <EditIcon />
                                                        </StyledIconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            onClick={() => handleDeleteClick(event)}
                                                            aria-label={`Delete ${event.title}`}
                                                        >
                                                            <DeleteIcon color="error" />
                                                        </StyledIconButton>
                                                    </Tooltip>
                                                </Box>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={events.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-input': {
                                color: '#1a237e',
                                fontWeight: 500,
                            },
                            '& .MuiSvgIcon-root': {
                                color: '#6B46C1',
                            },
                        }}
                    />
                </StyledPaper>

                {/* Add/Edit Event Dialog */}
                <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                        {selectedEvent ? 'Edit Event' : 'Add New Event'}
                        <StyledIconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseIcon />
                        </StyledIconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                {/* Basic Info */}
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Event Title *"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                        inputProps={{ 'aria-label': 'Event title' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Location *"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                        inputProps={{ 'aria-label': 'Event location' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Event Date *"
                                        value={formData.date}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                size: 'small',
                                                InputProps: {
                                                    style: { borderRadius: '8px' },
                                                    'aria-label': 'Event date',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledFormControl fullWidth size="small">
                                        <InputLabel sx={{ color: '#6B46C1', fontWeight: 500 }}>Status</InputLabel>
                                        <StyledSelect
                                            value={formData.status}
                                            label="Status"
                                            onChange={handleStatusChange}
                                            required
                                            aria-label="Event status"
                                        >
                                            <MenuItem value="upcoming">Upcoming</MenuItem>
                                            <MenuItem value="live">Live</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </StyledSelect>
                                    </StyledFormControl>
                                </Grid>

                                {/* Event Categories */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Categories *
                                    </Typography>
                                    <StyledAutocomplete
                                        multiple
                                        freeSolo
                                        options={allCategories}
                                        value={formData.categories}
                                        onChange={handleCategoryChange}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <StyledChip
                                                    variant="outlined"
                                                    label={option}
                                                    size="small"
                                                    {...getTagProps({ index })}
                                                    key={index}
                                                />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <StyledTextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Select or add categories"
                                                size="small"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    'aria-label': 'Event categories',
                                                }}
                                            />
                                        )}
                                    />
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <StyledTextField
                                            fullWidth
                                            label="New Category"
                                            value={formData.newCategory}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, newCategory: e.target.value }))
                                            }
                                            size="small"
                                            inputProps={{ 'aria-label': 'New category' }}
                                        />
                                        <StyledButton
                                            variant="outlined"
                                            onClick={handleAddNewCategory}
                                            disabled={!formData.newCategory.trim()}
                                            size="small"
                                            aria-label="Add new category"
                                        >
                                            Add
                                        </StyledButton>
                                    </Box>
                                </Grid>

                                {/* Event Banner */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Event Banner
                                    </Typography>
                                    <StyledTextField
                                        fullWidth
                                        label="Banner URL"
                                        name="banner"
                                        value={formData.banner}
                                        onChange={handleInputChange}
                                        size="small"
                                        inputProps={{ 'aria-label': 'Banner URL' }}
                                    />
                                </Grid>

                                {/* Organizer Info */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Organizer Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Organizer Name *"
                                                name="organizerName"
                                                value={formData.organizerName}
                                                onChange={handleInputChange}
                                                required
                                                size="small"
                                                inputProps={{ 'aria-label': 'Organizer name' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Organizer Photo URL"
                                                name="organizerPhoto"
                                                value={formData.organizerPhoto}
                                                onChange={handleInputChange}
                                                size="small"
                                                inputProps={{ 'aria-label': 'Organizer photo URL' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <StyledButton
                            onClick={handleCloseDialog}
                            size="small"
                            variant="outlined"
                            aria-label="Cancel"
                        >
                            Cancel
                        </StyledButton>
                        <StyledButton
                            variant="contained"
                            onClick={handleSubmit}
                            size="small"
                            aria-label={selectedEvent ? 'Update event' : 'Create event'}
                        >
                            {selectedEvent ? 'Update' : 'Create'}
                        </StyledButton>
                    </DialogActions>
                </StyledDialog>

                {/* Delete Confirmation Dialog */}
                <StyledDialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                        Confirm Delete
                        <StyledIconButton
                            aria-label="close"
                            onClick={() => setOpenDeleteDialog(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseIcon />
                        </StyledIconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="body1" gutterBottom sx={{ color: '#1a237e' }}>
                            Are you sure you want to delete the event {selectedEvent?.title || 'N/A'}?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <StyledButton
                            onClick={() => setOpenDeleteDialog(false)}
                            size="small"
                            variant="outlined"
                            aria-label="Cancel"
                        >
                            Cancel
                        </StyledButton>
                        <StyledButton
                            variant="contained"
                            color="error"
                            onClick={handleConfirmDelete}
                            size="small"
                            sx={{ background: '#c62828', '&:hover': { background: '#b71c1c' } }}
                            aria-label="Delete event"
                        >
                            Delete
                        </StyledButton>
                    </DialogActions>
                </StyledDialog>

                {/* Alert Snackbar */}
                <Snackbar
                    open={alert.open}
                    autoHideDuration={6000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseAlert}
                        severity={alert.severity}
                        sx={{ width: '100%', borderRadius: '8px', backgroundColor: '#e8e6f8', color: '#6B46C1' }}
                        elevation={6}
                        variant="filled"
                    >
                        {alert.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default EventsManagement;