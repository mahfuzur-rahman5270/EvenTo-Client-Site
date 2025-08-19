import { useState, useEffect } from 'react';
import {
    Button, Grid, TextField, Typography, CircularProgress,
    Paper, Box, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, Divider, Avatar, IconButton, Alert,
    Snackbar, LinearProgress, useMediaQuery, useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';
import useAxios from '../../hooks/useAxios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const MyProfile = () => {
    const { user, logOut, reloadUser } = useAuth();
    const [isAdmin] = useAdmin();
    const [axiosSecure] = useAxios();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [deviceDetail, setDeviceDetail] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const storedDeviceId = Cookies.get('deviceId');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Alert states
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showAlert = (message, severity) => {
        setAlert({
            open: true,
            message,
            severity
        });
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const logoutAdmin = async () => {
        try {
            if (user) {
                const idToken = await user.getIdToken();
                await axiosSecure.post('/api/users/admin/logout', { uid: user.uid }, {
                    headers: { Authorization: `Bearer ${idToken}` }
                });
                logOut()
                    .then(() => {
                        navigate(from, { replace: true });
                        showAlert('Logged out successfully', 'success');
                    })
                    .catch(error => {
                        console.error(error.message);
                        showAlert('Error during logout', 'error');
                    });
            }
        } catch (error) {
            console.error('Error logging out admin user:', error);
            showAlert('Error logging out', 'error');
        }
    };

    const { data: adminProfile, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/users/profile?email=${user?.email}`);
            return res.data;
        },
        enabled: isAdmin
    });

    useEffect(() => {
        if (!isLoading && adminProfile && adminProfile.length > 0) {
            const profileData = adminProfile[0];
            setDisplayName(profileData.displayName);
            setEmail(profileData.email);
            setBio(profileData.bio || '');
            setPhotoURL(profileData.photoURL || '');
            setDeviceDetail(profileData.deviceInfo || []);
        }
    }, [adminProfile, isLoading]);

    const handleRemoveDevice = async (deviceId) => {
        try {
            const res = await axiosSecure.delete(`/api/users/admin/remove-device/${email}/${deviceId}`);
            showAlert('Device removed successfully', 'success');
            refetch();
            if (deviceId === storedDeviceId) {
                await logoutAdmin();
            }
        } catch (error) {
            showAlert('Failed to remove device', 'error');
        }
    };

    const handleUpdateProfile = async (id) => {
        const updateInfo = { displayName, email, bio, photoURL };
        setIsUpdating(true);
        try {
            const res = await axiosSecure.put(`/api/users/admin/update-profile/${id}`, updateInfo);
            await reloadUser(); 
            showAlert(`${res.data.message}`, 'success');
            setEditMode(false);
            refetch();
        } catch (error) {
            showAlert('Failed to update profile', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }

            const data = await response.json();
            const imageUrl = data.secure_url;

            setPhotoURL(imageUrl);
            showAlert('Profile picture updated successfully', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showAlert('Failed to upload profile picture', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <Box sx={{
            mx: 'auto',
            p: isSmallScreen ? 1 : 2,
            maxWidth: 'xl'
        }}>
            <Helmet>
                <title>My Profile - Evento</title>
            </Helmet>

            {/* Alert Snackbar */}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    sx={{
                        width: '100%',
                        backgroundColor: alert.severity === 'error' ? '' :
                            alert.severity === 'success' ? '' :
                                alert.severity === 'warning' ? '' : '',
                        color: 'success'
                    }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            {isLoading || isUploading ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color="success" />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2, color: 'black' }}>
                    Failed to fetch profile data.
                </Alert>
            ) : (
                adminProfile && adminProfile.length > 0 && (
                    <Grid container spacing={isSmallScreen ? 1 : 3}>
                        {/* Profile Information Section */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{
                                p: isSmallScreen ? 1.5 : 3,
                                mb: isSmallScreen ? 2 : 3,
                                border: '1px solid rgba(0, 0, 0, 0.12)'
                            }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant={isSmallScreen ? "subtitle1" : "h6"} sx={{
                                        fontWeight: 'semibold',
                                        color: '#1a237e'
                                    }}>
                                        User Information
                                    </Typography>
                                    <IconButton onClick={toggleEditMode} sx={{ color: 'black' }}>
                                        <EditIcon fontSize={isSmallScreen ? "small" : "small"} />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" sx={{
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    mb: 1,
                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                }}>
                                    Personal details and contact information.
                                </Typography>
                                <Divider sx={{ my: isSmallScreen ? 1 : 2, borderColor: 'rgba(0, 0, 0, 0.12)' }} />

                                <Box display="flex" flexDirection="column" alignItems="center" mb={isSmallScreen ? 1 : 3}>
                                    <Avatar
                                        src={photoURL || '/default-avatar.png'}
                                        sx={{
                                            width: isSmallScreen ? 80 : 120,
                                            height: isSmallScreen ? 80 : 120,
                                            mb: isSmallScreen ? 1 : 2,
                                            border: '2px solid black'
                                        }}
                                    />
                                    {editMode && (
                                        <>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="photo-upload"
                                                type="file"
                                                onChange={handlePhotoUpload}
                                                disabled={isUploading}
                                            />
                                            <label htmlFor="photo-upload">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    startIcon={<CloudUploadIcon fontSize={isSmallScreen ? "small" : "small"} />}
                                                    disabled={isUploading}
                                                    size={isSmallScreen ? "small" : "small"}
                                                    sx={{
                                                        color: 'black',
                                                        borderColor: 'black',
                                                        '&:hover': {
                                                            borderColor: '#333',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                        },
                                                        mt: isSmallScreen ? 0.5 : 1
                                                    }}
                                                >
                                                    {isUploading ? 'Uploading...' : 'Change Photo'}
                                                </Button>
                                            </label>
                                        </>
                                    )}
                                </Box>

                                <Grid container spacing={isSmallScreen ? 1 : 2}>
                                    <Grid item xs={12} sm={6}>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                size={isSmallScreen ? "small" : "small"}
                                                label="Full Name"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                variant="outlined"
                                                margin="normal"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: 'black' },
                                                        '&:hover fieldset': { borderColor: 'black' },
                                                        '&.Mui-focused fieldset': { borderColor: 'black' },
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'black' },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{
                                                color: 'black',
                                                fontSize: isSmallScreen ? '0.875rem' : '1rem'
                                            }}>
                                                <strong>Full Name:</strong> {displayName}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                size={isSmallScreen ? "small" : "small"}
                                                label="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                variant="outlined"
                                                margin="normal"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: 'black' },
                                                        '&:hover fieldset': { borderColor: 'black' },
                                                        '&.Mui-focused fieldset': { borderColor: 'black' },
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'black' },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{
                                                color: 'black',
                                                fontSize: isSmallScreen ? '0.875rem' : '1rem'
                                            }}>
                                                <strong>Email:</strong> {email}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                size={isSmallScreen ? "small" : "small"}
                                                label="Bio"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                variant="outlined"
                                                margin="normal"
                                                multiline
                                                rows={isSmallScreen ? 2 : 4}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: 'black' },
                                                        '&:hover fieldset': { borderColor: 'black' },
                                                        '&.Mui-focused fieldset': { borderColor: 'black' },
                                                    },
                                                    '& .MuiInputLabel-root': { color: 'black' },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{
                                                color: 'black',
                                                fontSize: isSmallScreen ? '0.875rem' : '1rem'
                                            }}>
                                                <strong>Bio:</strong> {bio || 'No bio provided'}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>

                                {editMode && (
                                    <Box mt={isSmallScreen ? 1 : 3} display="flex" justifyContent="flex-end" gap={1}>
                                        <Button
                                            variant="outlined"
                                            onClick={toggleEditMode}
                                            startIcon={<CloseIcon fontSize={isSmallScreen ? "small" : "small"} />}
                                            size={isSmallScreen ? "small" : "small"}
                                            sx={{
                                                color: 'black',
                                                borderColor: 'black',
                                                '&:hover': {
                                                    borderColor: '#333',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleUpdateProfile(adminProfile[0]._id)}
                                            disabled={isUpdating || isUploading}
                                            startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                                            size={isSmallScreen ? "small" : "small"}
                                            sx={{
                                                backgroundColor: 'black',
                                                '&:hover': { backgroundColor: '#333' }
                                            }}
                                        >
                                            {isUpdating ? 'Updating...' : 'Save Changes'}
                                        </Button>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Device Management Section */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{
                                p: isSmallScreen ? 1.5 : 3,
                                border: '1px solid rgba(0, 0, 0, 0.12)'
                            }}>
                                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} sx={{
                                    fontWeight: 'semibold',
                                    color: '#1a237e',
                                    mb: isSmallScreen ? 0.5 : 1
                                }}>
                                    Device Management
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                                    mb: isSmallScreen ? 0.5 : 1
                                }}>
                                    Manage your logged-in devices
                                </Typography>
                                <Divider sx={{
                                    my: isSmallScreen ? 1 : 2,
                                    borderColor: 'rgba(0, 0, 0, 0.12)'
                                }} />
                                <TableContainer sx={{
                                    maxHeight: isSmallScreen ? 300 : 'none',
                                    overflowX: 'auto'
                                }}>
                                    <Table size={isSmallScreen ? "small" : "small"}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                }}>#</TableCell>
                                                <TableCell sx={{
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                }}>Device</TableCell>
                                                {!isSmallScreen && (
                                                    <TableCell sx={{
                                                        fontWeight: 'bold',
                                                        color: 'black',
                                                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                    }}>Platform</TableCell>
                                                )}
                                                <TableCell sx={{
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                }}>Last Active</TableCell>
                                                <TableCell sx={{
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {deviceDetail.map((device, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell sx={{
                                                        color: 'black',
                                                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                    }}>{index + 1}</TableCell>
                                                    <TableCell sx={{
                                                        color: 'black',
                                                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                    }}>{device.deviceType}</TableCell>
                                                    {!isSmallScreen && (
                                                        <TableCell sx={{
                                                            color: 'black',
                                                            fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                        }}>{device.os}</TableCell>
                                                    )}
                                                    <TableCell sx={{
                                                        color: 'black',
                                                        fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                                                    }}>
                                                        {device.date ? new Date(device.date).toLocaleString() : '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            size={isSmallScreen ? "small" : "small"}
                                                            onClick={() => handleRemoveDevice(device.deviceId)}
                                                            disabled={device.deviceId === storedDeviceId && deviceDetail.length === 1}
                                                            sx={{
                                                                backgroundColor: device.deviceId === storedDeviceId ? 'rgba(0, 0, 0, 0.12)' : 'black',
                                                                color: device.deviceId === storedDeviceId ? 'rgba(0, 0, 0, 0.6)' : 'white',
                                                                '&:hover': {
                                                                    backgroundColor: device.deviceId === storedDeviceId ? 'rgba(0, 0, 0, 0.12)' : '#333'
                                                                },
                                                                fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
                                                                padding: isSmallScreen ? '4px 8px' : '6px 16px'
                                                            }}
                                                        >
                                                            {device.deviceId === storedDeviceId ? 'Current' : 'Remove'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )
            )}
        </Box>
    );
};

export default MyProfile;