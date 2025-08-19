import { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Alert,
    Snackbar,
    Avatar,
    InputAdornment,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Autocomplete,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { CloudUpload, AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import useAxios from '../../hooks/useAxios';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

// Cloudinary Configuration
const CLOUD_NAME = 'ddh86gfrm';
const UPLOAD_PRESET = 'ml_default';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)',
    color: 'white',
    borderRadius: '5px',
    padding: '5px 12px',
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
        borderRadius: '2px',
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

const StyledCard = styled(Card)(() => ({
    borderRadius: '3px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    overflowX: 'auto',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '2px',
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
    borderRadius: '2px',
    '& .MuiSelect-select': {
        padding: '8px 12px',
    },
}));

const StyledIconButton = styled(IconButton)(() => ({
    color: '#6B46C1',
    '&:hover': {
        backgroundColor: 'rgba(91, 55, 161, 0.04)',
    },
}));

const StyledAutocomplete = styled(Autocomplete)(() => ({
    '& .MuiAutocomplete-inputRoot': {
        borderRadius: '2px',
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

const CreateEvent = () => {
    const [axiosSecure] = useAxios();
    const queryClient = useQueryClient();
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        date: null,
        startTime: null,
        endTime: null,
        policy: '',
        banner: null,
        organizerName: '',
        organizerPhoto: null,
        tickets: [{ type: 'General Admission', price: 0, quantity: 100 }],
        status: 'upcoming',
        categories: [],
        newCategory: '',
    });

    const [bannerPreview, setBannerPreview] = useState('');
    const [organizerPhotoPreview, setOrganizerPhotoPreview] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const [isUploadingOrganizerPhoto, setIsUploadingOrganizerPhoto] = useState(false);

    // Fetch existing categories from events
    const { data: existingCategories = [], isLoading: loadingCategories } = useQuery({
        queryKey: ['event-categories'],
        queryFn: () =>
            axiosSecure.get('/api/events').then((res) => {
                const categories = new Set();
                res.data.forEach((event) => {
                    if (event.categories && Array.isArray(event.categories)) {
                        event.categories.forEach((cat) => categories.add(cat));
                    }
                });
                return Array.from(categories);
            }),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = useCallback((value, field) => {
        setEventData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'banner') {
            setIsUploadingBanner(true);
        } else {
            setIsUploadingOrganizerPhoto(true);
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;

            if (type === 'banner') {
                setEventData((prev) => ({ ...prev, banner: imageUrl }));
                setBannerPreview(imageUrl);
            } else {
                setEventData((prev) => ({ ...prev, organizerPhoto: imageUrl }));
                setOrganizerPhotoPreview(imageUrl);
            }

            showSnackbar('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar('Failed to upload image', 'error');
        } finally {
            if (type === 'banner') {
                setIsUploadingBanner(false);
            } else {
                setIsUploadingOrganizerPhoto(false);
            }
        }
    };

    const handleBannerChange = (e) => {
        handleImageUpload(e, 'banner');
    };

    const handleOrganizerPhotoChange = (e) => {
        handleImageUpload(e, 'organizer');
    };

    const handleTicketChange = (index, field, value) => {
        const updatedTickets = [...eventData.tickets];
        updatedTickets[index][field] = field === 'price' ? parseFloat(value) || 0 : field === 'quantity' ? parseInt(value) || 0 : value;
        setEventData((prev) => ({ ...prev, tickets: updatedTickets }));
    };

    const addTicketType = () => {
        setEventData((prev) => ({
            ...prev,
            tickets: [...prev.tickets, { type: '', price: 0, quantity: 0 }],
        }));
    };

    const removeTicketType = (index) => {
        const updatedTickets = [...eventData.tickets];
        updatedTickets.splice(index, 1);
        setEventData((prev) => ({ ...prev, tickets: updatedTickets }));
    };

    const handleCategoryChange = (event, newValue) => {
        setEventData((prev) => ({ ...prev, categories: newValue }));
    };

    const handleAddNewCategory = () => {
        if (eventData.newCategory.trim() && !eventData.categories.includes(eventData.newCategory.trim())) {
            setEventData((prev) => ({
                ...prev,
                categories: [...prev.categories, eventData.newCategory.trim()],
                newCategory: '',
            }));
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const createEventMutation = useMutation({
        mutationFn: (eventData) => axiosSecure.post('/api/events', eventData),
        onSuccess: () => {
            showSnackbar('Event created successfully!', 'success');
            queryClient.invalidateQueries(['events']);
            setEventData({
                title: '',
                description: '',
                location: '',
                date: null,
                startTime: null,
                endTime: null,
                policy: '',
                banner: null,
                organizerName: '',
                organizerPhoto: null,
                tickets: [{ type: 'General Admission', price: 0, quantity: 100 }],
                status: 'upcoming',
                categories: [],
                newCategory: '',
            });
            setBannerPreview('');
            setOrganizerPhotoPreview('');
        },
        onError: (error) => {
            console.error('Error creating event:', error);
            showSnackbar(error.response?.data?.message || 'Error creating event', 'error');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (
            !eventData.title ||
            !eventData.location ||
            !eventData.date ||
            !eventData.startTime ||
            !eventData.endTime ||
            !eventData.organizerName ||
            !eventData.categories.length
        ) {
            showSnackbar('Please fill all required fields', 'error');
            return;
        }

        // Validate ticket types
        for (const ticket of eventData.tickets) {
            if (!ticket.type || ticket.price < 0 || ticket.quantity <= 0) {
                showSnackbar('Please fill all ticket fields with valid values', 'error');
                return;
            }
        }

        // Format date and times for backend
        const formattedDate = eventData.date ? dayjs(eventData.date).format('YYYY-MM-DD') : null;
        const formattedStartTime = eventData.startTime ? dayjs(eventData.startTime).format('HH:mm') : null;
        const formattedEndTime = eventData.endTime ? dayjs(eventData.endTime).format('HH:mm') : null;

        const eventPayload = {
            ...eventData,
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            newCategory: undefined,
        };

        createEventMutation.mutate(eventPayload);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 2 }}>
                <StyledCard>
                    <CardHeader
                        title={
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                                Create New Event
                            </Typography>
                        }
                    />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* Event Banner */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                                        Event Banner
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <StyledButton
                                            variant="contained"
                                            component="label"
                                            size="small"
                                            startIcon={
                                                isUploadingBanner ? (
                                                    <CircularProgress size={16} color="inherit" />
                                                ) : (
                                                    <CloudUpload />
                                                )
                                            }
                                            disabled={isUploadingBanner}
                                        >
                                            {isUploadingBanner ? 'Uploading...' : 'Upload Banner'}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                aria-label="Upload event banner"
                                            />
                                        </StyledButton>
                                        {bannerPreview && (
                                            <Box sx={{ width: 100, height: 60, borderRadius: '8px', overflow: 'hidden' }}>
                                                <img
                                                    src={bannerPreview}
                                                    alt="Event banner preview"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Basic Info */}
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Event Title *"
                                        name="title"
                                        value={eventData.title}
                                        onChange={handleChange}
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
                                        value={eventData.location}
                                        onChange={handleChange}
                                        required
                                        size="small"
                                        inputProps={{ 'aria-label': 'Event location' }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DatePicker
                                        label="Event Date *"
                                        value={eventData.date}
                                        onChange={(newValue) => setEventData((prev) => ({ ...prev, date: newValue }))}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                size: 'small',
                                                InputProps: {
                                                    style: { borderRadius: '3px' },
                                                    'aria-label': 'Event date',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TimePicker
                                        label="Start Time *"
                                        value={eventData.startTime}
                                        onChange={(newValue) => setEventData((prev) => ({ ...prev, startTime: newValue }))}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                size: 'small',
                                                InputProps: {
                                                    style: { borderRadius: '3px' },
                                                    'aria-label': 'Event start time',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TimePicker
                                        label="End Time *"
                                        value={eventData.endTime}
                                        onChange={(newValue) => setEventData((prev) => ({ ...prev, endTime: newValue }))}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                size: 'small',
                                                InputProps: {
                                                    style: { borderRadius: '3px' },
                                                    'aria-label': 'Event end time',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Event Status */}
                                <Grid item xs={12} sm={6}>
                                    <StyledFormControl fullWidth size="small">
                                        <InputLabel sx={{ color: '#6B46C1', fontWeight: 500 }}>Event Status</InputLabel>
                                        <StyledSelect
                                            value={eventData.status}
                                            label="Event Status"
                                            onChange={(e) => setEventData((prev) => ({ ...prev, status: e.target.value }))}
                                            aria-label="Event status"
                                        >
                                            <MenuItem value="upcoming">Upcoming</MenuItem>
                                            <MenuItem value="live">Live</MenuItem>
                                        </StyledSelect>
                                    </StyledFormControl>
                                </Grid>

                                {/* Event Categories */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Categories *
                                    </Typography>
                                    <StyledAutocomplete
                                        multiple
                                        freeSolo
                                        options={existingCategories}
                                        value={eventData.categories}
                                        onChange={handleCategoryChange}
                                        disabled={loadingCategories}
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
                                                placeholder={loadingCategories ? 'Loading categories...' : 'Select or add categories'}
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
                                            value={eventData.newCategory}
                                            onChange={(e) =>
                                                setEventData((prev) => ({ ...prev, newCategory: e.target.value }))
                                            }
                                            size="small"
                                            inputProps={{ 'aria-label': 'New category' }}
                                        />
                                        <StyledButton
                                            variant="outlined"
                                            onClick={handleAddNewCategory}
                                            disabled={!eventData.newCategory.trim()}
                                            size="small"
                                        >
                                            Add
                                        </StyledButton>
                                    </Box>
                                </Grid>

                                {/* Event Description */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Event Description
                                    </Typography>
                                    <ReactQuill
                                        theme="snow"
                                        value={eventData.description}
                                        onChange={(value) => handleEditorChange(value, 'description')}
                                        style={{
                                            height: 200,
                                            marginBottom: 40,
                                            borderRadius: '8px',
                                            borderColor: '#6B46C1',
                                        }}
                                        className="ql-container"
                                    />
                                </Grid>

                                {/* Event Policy */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a237e', fontWeight: 500 }}>
                                        Event Policy
                                    </Typography>
                                    <ReactQuill
                                        theme="snow"
                                        value={eventData.policy}
                                        onChange={(value) => handleEditorChange(value, 'policy')}
                                        style={{
                                            height: 200,
                                            marginBottom: 40,
                                            borderRadius: '8px',
                                            borderColor: '#6B46C1',
                                        }}
                                        className="ql-container"
                                    />
                                </Grid>

                                {/* Organizer Info */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                                        Organizer Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <StyledTextField
                                                fullWidth
                                                label="Organizer Name *"
                                                name="organizerName"
                                                value={eventData.organizerName}
                                                onChange={handleChange}
                                                required
                                                size="small"
                                                inputProps={{ 'aria-label': 'Organizer name' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <StyledButton
                                                    variant="contained"
                                                    component="label"
                                                    size="small"
                                                    startIcon={
                                                        isUploadingOrganizerPhoto ? (
                                                            <CircularProgress size={16} color="inherit" />
                                                        ) : (
                                                            <CloudUpload />
                                                        )
                                                    }
                                                    disabled={isUploadingOrganizerPhoto}
                                                >
                                                    {isUploadingOrganizerPhoto ? 'Uploading...' : 'Upload Photo'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleOrganizerPhotoChange}
                                                        aria-label="Upload organizer photo"
                                                    />
                                                </StyledButton>
                                                {organizerPhotoPreview && (
                                                    <Avatar
                                                        src={organizerPhotoPreview}
                                                        sx={{ width: 40, height: 40, border: '2px solid #6B46C1' }}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Ticket Management */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                                        Ticket Management *
                                    </Typography>
                                    {eventData.tickets.map((ticket, index) => (
                                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                            <Grid item xs={12} sm={4}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Ticket Type *"
                                                    value={ticket.type}
                                                    onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                                                    required
                                                    size="small"
                                                    inputProps={{ 'aria-label': `Ticket type ${index + 1}` }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Price *"
                                                    type="number"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                        inputProps: { min: 0 },
                                                    }}
                                                    value={ticket.price}
                                                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                                    required
                                                    size="small"
                                                    inputProps={{ 'aria-label': `Ticket price ${index + 1}` }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <StyledTextField
                                                    fullWidth
                                                    label="Quantity *"
                                                    type="number"
                                                    InputProps={{
                                                        inputProps: { min: 1 },
                                                    }}
                                                    value={ticket.quantity}
                                                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                                                    required
                                                    size="small"
                                                    inputProps={{ 'aria-label': `Ticket quantity ${index + 1}` }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                                {index > 0 && (
                                                    <StyledIconButton
                                                        onClick={() => removeTicketType(index)}
                                                        aria-label={`Remove ticket type ${index + 1}`}
                                                    >
                                                        <DeleteOutline color="error" />
                                                    </StyledIconButton>
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <StyledButton
                                        startIcon={<AddCircleOutline />}
                                        onClick={addTicketType}
                                        size="small"
                                        sx={{ mt: 1 }}
                                        aria-label="Add new ticket type"
                                    >
                                        Add Ticket Type
                                    </StyledButton>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12}>
                                    <StyledButton
                                        type="submit"
                                        variant="contained"
                                        size="small"
                                        disabled={createEventMutation.isLoading}
                                        startIcon={createEventMutation.isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                                        aria-label="Create event"
                                    >
                                        {createEventMutation.isLoading ? 'Creating Event...' : 'Create Event'}
                                    </StyledButton>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </StyledCard>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: '100%', borderRadius: '8px', backgroundColor: '#e8e6f8', color: '#6B46C1' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default CreateEvent;