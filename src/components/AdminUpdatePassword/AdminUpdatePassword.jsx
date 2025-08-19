import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';
import { TextField, Button, Grid, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAxios from '../../hooks/useAxios';
import useAdminData from '../../hooks/useAdminInfo';

const AdminUpdatePassword = () => {
    const { id } = useParams();
    const [axiosSecure] = useAxios();
    const { info, error } = useAdminData(id);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [show, setShow] = useState(false);
    const [passLoading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axiosSecure.put(`/admin/update-password/${id}`, data);
            reset();
            Swal.fire({
                title: `${response.data.message}`,
                text: 'আপনি কি চালিয়ে যেতে চান',
                icon: 'success',
                confirmButtonText: 'ঠিক আছে'
            });
        } catch (error) {
            console.error('Error updating password:', error);
            Swal.fire({
                icon: 'error',
                title: 'ত্রুটি!',
                text: 'পাসওয়ার্ড আপডেট করার সময় ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
                confirmButtonText: 'ঠিক আছে'
            });
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen">
            <Helmet>
                <title>{`পাসওয়ার্ড আপডেট - শতমূলী সংগঠন`}</title>
            </Helmet>
            <Paper className="bg-white my-2 mx-5 border-t-4 border-green-600" sx={{ padding: 4, boxShadow: 3 }}>
                <Typography variant="h6" component="h1" align="center" gutterBottom>
                    পাসওয়ার্ড আপডেট করুন ({info?.displayName})
                </Typography>
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    type={show ? 'text' : 'password'}
                                    {...register("password", { required: true })}
                                    name="password"
                                    label="নতুন পাসওয়ার্ড যোগ করুন"
                                    placeholder="পাসওয়ার্ড লিখুন"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <Typography
                                                onClick={() => setShow(!show)}
                                                variant="subtitle1"
                                                style={{ cursor: 'pointer', color: 'green' }}
                                            >
                                                {show ? <VisibilityOff /> : <Visibility />}
                                            </Typography>
                                        ),
                                    }}
                                    error={!!errors.password}
                                    helperText={errors.password && 'এই ক্ষেত্রটি প্রয়োজন'}
                                    sx={{
                                        mt: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'default',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'green',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'green',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'default',
                                        },
                                        '&:hover .MuiInputLabel-root': {
                                            color: 'green',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'green',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} spacing={2} className="grid grid-cols-2 w-full gap-4">
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#388E3C', '&:hover': { bgcolor: 'darkgreen' } }}>
                                    {passLoading ? (
                                        <CircularProgress color="inherit" size={24} />
                                    ) : (
                                        'পাসওয়ার্ড আপডেট করুন'
                                    )}
                                </Button>
                                <Button
                                    type="reset"
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        mt: 2,
                                    }}
                                    onClick={() => reset()}
                                >
                                    রিসেট
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </div>
    );
};

export default AdminUpdatePassword;
