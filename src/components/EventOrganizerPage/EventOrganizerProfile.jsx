import { useState, useEffect, useCallback } from 'react';
import {
    Button, Grid, Typography, Paper, Box, TableContainer, Table, TableHead, TableRow, TableCell,
    TableBody, Divider, IconButton, Collapse, Avatar, TextField, Alert, Snackbar, Skeleton,
    LinearProgress,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import ReactQuill from 'react-quill';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockResetIcon from '@mui/icons-material/LockReset';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import useEventOrganizer from '../../hooks/useEventOrganizer';


// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const EventOrganizerProfile = () => {
    const { user, logOut } = useAuth();
    const [isEventOrganizer] = useEventOrganizer();
    const [axiosSecure] = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const storedDeviceId = Cookies.get('deviceId');

    // Profile state
    const [profileData, setProfileData] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        designation: '',
        bio: '',
        photoURL: '',
        lifeTimeMember: false,
        lifeTimeMemberSince: '',
        address: '',
    });

    const [deviceDetail, setDeviceDetail] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Edit mode state
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempData, setTempData] = useState({});

    // Password change states
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);

    // Alert state
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

    const handleAlert = useCallback((severity, message) => {
        setAlert({ open: true, severity, message });
        setTimeout(() => setAlert({ open: false, severity: 'success', message: '' }), 3000);
    }, []);

    const { data: UserProfile, isLoading, error, refetch } = useQuery({
        queryKey: ['student-profile'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/users/profile?email=${user?.email}`);
            return res.data;
        },
        enabled: isEventOrganizer && !!user?.email,
    });

    useEffect(() => {
        if (!isLoading && UserProfile?.[0]) {
            const { displayName, email, bio, designation, phoneNumber, photoURL, deviceInfo, lifeTimeMember, lifeTimeMemberSince, address } =
                UserProfile[0];
            setProfileData({
                displayName,
                email,
                bio: bio || '',
                designation: designation || '',
                phoneNumber: phoneNumber || '',
                photoURL: photoURL || '',
                lifeTimeMember: lifeTimeMember || false,
                lifeTimeMemberSince: lifeTimeMemberSince || '',
                address: address || '',
            });
            setDeviceDetail(deviceInfo || []);
        }
    }, [UserProfile, isLoading]);

    const toggleEditMode = useCallback(() => {
        if (isEditMode) {
            setProfileData(tempData);
        } else {
            setTempData(profileData);
        }
        setIsEditMode(!isEditMode);
    }, [isEditMode, profileData, tempData]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePasswordChange = useCallback((e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const logoutAdmin = useCallback(async () => {
        try {
            if (user) {
                const idToken = await user.getIdToken();
                await axiosSecure.post(
                    '/api/users/admin/logout',
                    { uid: user.uid },
                    { headers: { Authorization: `Bearer ${idToken}` } }
                );
                await logOut();
                navigate(from, { replace: true });
                handleAlert('success', 'Logged out successfully.');
            }
        } catch (error) {
            console.error('Error logging out admin user:', error);
            handleAlert('error', 'Failed to log out.');
        }
    }, [user, axiosSecure, logOut, navigate, from, handleAlert]);

    const handleRemoveDevice = useCallback(
        async (deviceId) => {
            try {
                const res = await axiosSecure.delete(`/api/users/admin/remove-device/${profileData.email}/${deviceId}`);
                handleAlert('success', res.data.message || 'Device removed successfully.');
                refetch();
                if (deviceId === storedDeviceId) {
                    await logoutAdmin();
                }
            } catch (error) {
                console.error('Error removing device:', error);
                handleAlert('error', 'Failed to remove device.');
            }
        },
        [profileData.email, storedDeviceId, axiosSecure, refetch, logoutAdmin, handleAlert]
    );

    const handleUpdateProfile = useCallback(
        async (id) => {
            setIsUpdating(true);
            try {
                const res = await axiosSecure.put(`/api/users/admin/update-profile/${id}`, profileData);
                handleAlert('success', res.data.message || 'Profile updated successfully.');
                setIsEditMode(false);
                refetch();
            } catch (error) {
                console.error('Error updating profile:', error);
                handleAlert('error', 'Failed to update profile.');
            } finally {
                setIsUpdating(false);
            }
        },
        [profileData, axiosSecure, refetch, handleAlert]
    );

    const handlePhotoUpload = useCallback(
        async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file type and size
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                handleAlert('error', 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP).');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                handleAlert('error', 'Image size must be less than 5MB.');
                return;
            }

            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);
                formData.append('cloud_name', CLOUD_NAME);

                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image to Cloudinary');
                }

                const data = await response.json();
                const imageUrl = data.secure_url;

                // Update profile with the new image URL
                const updateResponse = await axiosSecure.put(`/api/users/admin/update-profile/${UserProfile[0]._id}`, {
                    photoURL: imageUrl
                });

                setProfileData((prev) => ({ ...prev, photoURL: imageUrl }));
                handleAlert('success', 'Profile picture updated successfully.');
                refetch();
            } catch (error) {
                console.error('Error uploading image:', error);
                handleAlert('error', 'Failed to upload profile picture.');
            } finally {
                setIsUploading(false);
            }
        },
        [axiosSecure, handleAlert, UserProfile, refetch]
    );

    const submitPasswordChange = useCallback(async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            handleAlert('error', 'All password fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            handleAlert('error', 'New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 6) {
            handleAlert('error', 'New password must be at least 6 characters long.');
            return;
        }

        // Basic password strength check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            handleAlert('error', 'Password must include at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }

        setIsChangingPassword(true);
        try {
            await axiosSecure.put(`/api/users/admin/change-password/${UserProfile[0]._id}`, {
                currentPassword,
                newPassword,
            });
            handleAlert('success', 'Password changed successfully.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordChange(false);
        } catch (error) {
            console.error('Error changing password:', error);
            handleAlert('error', 'Failed to change password.');
        } finally {
            setIsChangingPassword(false);
        }
    }, [passwordData, UserProfile, axiosSecure, handleAlert]);

    if (isLoading) {
        return (
            <Box>
                <LinearProgress color="success" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ backgroundColor: '#F1F5F9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 400, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Error Loading Profile
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        Failed to fetch profile data. Please try again later.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => refetch()}>
                        Retry
                    </Button>
                </Paper>
            </Box>
        );
    }

    if (!UserProfile?.[0]) {
        return (
            <Box sx={{ backgroundColor: '#F1F5F9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 400, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        No Profile Found
                    </Typography>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        No profile data found for this user.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Helmet>
                <title>Profile - Evento</title>
            </Helmet>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ open: false, severity: 'success', message: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={alert.severity}
                    onClose={() => setAlert({ open: false, severity: 'success', message: '' })}
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            <Box sx={{ p: 2 }}>
                <Grid container spacing={3}>
                    {/* User Information Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">User Information</Typography>
                                <Box display="flex" alignItems="center">
                                    {isEditMode ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleUpdateProfile(UserProfile[0]._id)}
                                                startIcon={isUpdating ? null : <CheckIcon />}
                                                sx={{ mr: 1 }}
                                                disabled={isUpdating || isUploading}
                                                aria-label="Save profile changes"
                                            >
                                                {isUpdating ? <Skeleton variant="rectangular" width={60} height={20} /> : 'Save'}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={toggleEditMode}
                                                startIcon={<Close />}
                                                disabled={isUpdating || isUploading}
                                                aria-label="Cancel profile edit"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={toggleEditMode}
                                            startIcon={<EditIcon />}
                                            aria-label="Edit profile"
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Personal details and contact information.
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Avatar
                                    src={profileData.photoURL || '/default-avatar.png'}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                    alt={`${profileData.displayName}'s avatar`}
                                />

                                {isEditMode && (
                                    <Box>
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
                                                startIcon={isUploading ? null : <CloudUploadIcon />}
                                                disabled={isUploading}
                                                aria-label="Upload profile photo"
                                            >
                                                {isUploading ? <Skeleton variant="rectangular" width={100} height={20} /> : 'Change Photo'}
                                            </Button>
                                        </label>
                                    </Box>
                                )}
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    {isEditMode ? (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Full Name"
                                            name="displayName"
                                            value={profileData.displayName}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            aria-required="true"
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            <strong>Full Name:</strong> {profileData.displayName}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    {isEditMode ? (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                            disabled
                                            aria-disabled="true"
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            <strong>Email:</strong> {profileData.email}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    {isEditMode ? (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="phoneNumber Number"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber || ''}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            <strong>phoneNumber:</strong> {profileData.phoneNumber || 'Not provided'}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    {isEditMode ? (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Designation"
                                            name="designation"
                                            value={profileData.designation || ''}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            <strong>Designation:</strong> {profileData.designation || 'Not provided'}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    {isEditMode ? (
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Address"
                                            name="address"
                                            value={profileData.address || ''}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            margin="normal"
                                            multiline
                                            rows={4}
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            <strong>Address:</strong> {profileData.address || 'Not provided'}
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    {isEditMode ? (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                                                Bio
                                            </Typography>
                                            <ReactQuill
                                                value={profileData.bio}
                                                onChange={(value) => setProfileData((prev) => ({ ...prev, bio: value }))}
                                                theme="snow"
                                                style={{
                                                    minHeight: 200,
                                                    borderRadius: 4,
                                                    border: '1px solid rgba(0, 0, 0, 0.23)',
                                                }}
                                                modules={{
                                                    toolbar: [
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        ['blockquote'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        ['link'],
                                                        ['clean'],
                                                    ],
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography variant="body1" component="div">
                                                <strong>Bio:</strong>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(profileData.bio || 'No bio provided'),
                                                    }}
                                                />
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Password and Devices Section */}
                        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Password Change</Typography>
                                <IconButton
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    aria-label={showPasswordChange ? 'Hide password change form' : 'Show password change form'}
                                >
                                    <LockResetIcon color={showPasswordChange ? 'primary' : 'inherit'} />
                                </IconButton>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Collapse in={showPasswordChange}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Current Password"
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            aria-required="true"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="New Password"
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            aria-required="true"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Confirm Password"
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            aria-required="true"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={submitPasswordChange}
                                            disabled={isChangingPassword}
                                            aria-label="Change password"
                                        >
                                            {isChangingPassword ? <Skeleton variant="rectangular" width={100} height={20} /> : 'Change Password'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Paper>
                        {/* Device Management Section */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Device Management
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Manage your logged-in devices
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <TableContainer>
                                <Table size="small" aria-label="Device management table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Device</TableCell>
                                            <TableCell>Platform</TableCell>
                                            <TableCell>Last Active</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {deviceDetail.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        No devices found.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            deviceDetail.map((device, index) => (
                                                <TableRow key={device.deviceId}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{device.deviceType}</TableCell>
                                                    <TableCell>{device.os}</TableCell>
                                                    <TableCell>{device.date ? new Date(device.date).toLocaleString() : '-'}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleRemoveDevice(device.deviceId)}
                                                            disabled={device.deviceId === storedDeviceId && deviceDetail.length === 1}
                                                            aria-label={`Remove device ${device.deviceType}`}
                                                        >
                                                            {device.deviceId === storedDeviceId ? 'Current' : 'Remove'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default EventOrganizerProfile;