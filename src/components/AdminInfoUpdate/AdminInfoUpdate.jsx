import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
    Grid,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Snackbar,
    IconButton,
    LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useAdminData from '../../hooks/useAdminInfo';
import useAxios from '../../hooks/useAxios';

const AdminInfoUpdate = () => {
    const { id } = useParams();
    const { info, loading, error: adminDataError } = useAdminData(id);
    const [axiosSecure] = useAxios();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            displayName: info?.displayName || '',
            email: info?.email || '',
            password: ''
        }
    });
    const [infoLoading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ ...alert, open: false });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const updateInfo = { ...data };
            Object.keys(updateInfo).forEach(key => {
                if (updateInfo[key] === '' || updateInfo[key] === null) {
                    delete updateInfo[key];
                }
            });

            const response = await axiosSecure.put(`/api/users/admin-update/info/${id}`, updateInfo);
            if (response.status === 200) {
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Admin user updated successfully',
                });
                reset({
                    displayName: updateInfo.displayName || info?.displayName || '',
                    email: updateInfo.email || info?.email || '',
                    password: ''
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'An error occurred while updating the user. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (adminDataError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
                    Error loading admin data: {adminDataError.message}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            {/* Success/Error Alert */}
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={alert.severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleCloseAlert}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {alert.message}
                </Alert>
            </Snackbar>

            {/* Show LinearProgress when loading or infoLoading is true */}
            {(loading || infoLoading) ? (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color="success" />
                </Box>
            ) : (
                <Paper
                    sx={{
                        padding: 2,
                        width: '100%',
                    }}
                    elevation={3}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'semibold', color: '#1a237e', mb: 2 }}
                    >
                        Update Admin Information
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                        {info ? `Current Admin: ${info?.displayName}` : 'Loading user information...'}
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Grid container spacing={3}>
                            {/* Name Field */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Full Name"
                                    size='small'
                                    defaultValue={info?.displayName}
                                    {...register("displayName")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: "#000" },
                                            '&:hover fieldset': { borderColor: "#000" },
                                            '&.Mui-focused fieldset': { borderColor: "#000" },
                                        },
                                        '& .MuiInputLabel-root': { color: "#000" },
                                        '& .MuiInputLabel-root.Mui-focused': { color: "#000" },
                                    }}
                                />
                            </Grid>

                            {/* Email Field */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant="outlined"
                                    label="Email"
                                    defaultValue={info?.email}
                                    {...register("email")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: "#000" },
                                            '&:hover fieldset': { borderColor: "#000" },
                                            '&.Mui-focused fieldset': { borderColor: "#000" },
                                        },
                                        '& .MuiInputLabel-root': { color: "#000" },
                                        '& .MuiInputLabel-root.Mui-focused': { color: "#000" },
                                    }}
                                />
                            </Grid>

                            {/* Password Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    variant="outlined"
                                    label="New Password"
                                    size='small'
                                    placeholder="Leave empty if you don't want to update"
                                    {...register("password")}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: "#000" },
                                            '&:hover fieldset': { borderColor: "#000" },
                                            '&.Mui-focused fieldset': { borderColor: "#000" },
                                        },
                                        '& .MuiInputLabel-root': { color: "#000" },
                                        '& .MuiInputLabel-root.Mui-focused': { color: "#000" },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                            {/* Update Button */}
                            <Grid item xs={12} sm={6}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={infoLoading}
                                    sx={{
                                        bgcolor: "black",
                                        "&:hover": { bgcolor: "#333" },
                                        textTransform: 'none',
                                    }}
                                >
                                    {infoLoading ? (
                                        <CircularProgress color="inherit" size={24} />
                                    ) : (
                                        'Update Profile'
                                    )}
                                </Button>
                            </Grid>

                            {/* Reset Button */}
                            <Grid item xs={12} sm={6}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() => reset({
                                        displayName: info?.displayName || '',
                                        email: info?.email || '',
                                        password: ''
                                    })}
                                    sx={{
                                        textTransform: 'none',
                                    }}
                                >
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default AdminInfoUpdate;