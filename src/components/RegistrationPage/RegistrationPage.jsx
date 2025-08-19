import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
  Alert,
  AlertTitle,
  Collapse,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import { Helmet } from "react-helmet";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import admin from '../../assets/login/create-an-online-course-coursifyme.jpg';

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [axiosSecure] = useAxios();
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const showAlert = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const onSubmit = async (data) => {
    setAlertOpen(false);
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      showAlert("error", "Passwords do not match");
      setLoading(false);
      return;
    }

    if (!phone) {
      showAlert("error", "Phone number is required");
      setLoading(false);
      return;
    }

    if (!agree) {
      showAlert("error", "You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    // Ensure phone number is in correct format
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    const saveUser = {
      displayName: data.name,
      email: data.email,
      phoneNumber: formattedPhone, // Will be saved as "+8801609804997"
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: "Admin",
      agree: agree,
    };

    try {
      const response = await axiosSecure.post("/api/users/create", saveUser);
      if (response.status === 201) {
        showAlert("success", "Admin successfully created");
        reset();
        setPhone("");
        setAgree(false);
      } else {
        showAlert("error", response.data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      showAlert("error", err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F1F5F9', minHeight: { lg: '95vh' }, display: 'flex', alignItems: 'center', p: 2 }}>
      <Helmet>
        <title>Register Admin - Evento</title>
      </Helmet>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} md={10} lg={10}>
          <Paper sx={{ display: 'flex', overflow: 'hidden' }}>
            {/* Left Side - Image */}
            <Box sx={{
              width: { xs: 0, md: '50%' },
              display: { xs: 'none', md: 'block' },
              backgroundImage: `url(${admin})`,
              height: '200px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '600px'
            }} />

            {/* Right Side - Form */}
            <Box sx={{
              width: { xs: '100%', md: '50%' },
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <Typography variant="h5"
                sx={{ fontWeight: 'semibold', color: '#1a237e', mb: 2 }}>
                Create Admin Account
              </Typography>

              {/* MUI Alert for notifications */}
              <Collapse in={alertOpen}>
                <Alert
                  severity={alertSeverity}
                  sx={{ mb: 3 }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  <AlertTitle>{alertSeverity === "success" ? "Success" : "Error"}</AlertTitle>
                  {alertMessage}
                </Alert>
              </Collapse>

              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                {["name", "email"].map((field) => (
                  <TextField
                    key={field}
                    margin="normal"
                    required
                    fullWidth
                    size="small"
                    id={field}
                    label={field === "name" ? "Full Name" : "Email Address"}
                    type="text"
                    {...register(field, {
                      required: `${field.replace(/([A-Z])/g, " $1")} is required`,
                      ...(field === "email" && {
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                      }),
                    })}
                    error={!!errors[field]}
                    helperText={errors[field]?.message}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: "#ddd" },
                        '&:hover fieldset': { borderColor: "#000" },
                        '&.Mui-focused fieldset': { borderColor: "#000" },
                      },
                      mb: 2
                    }}
                  />
                ))}

                {/* Phone Input - Set to Bangladesh (bd) by default */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#666' }}>Phone Number *</Typography>
                  <PhoneInput
                    country={'bd'}
                    value={phone}
                    onChange={setPhone}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '4px',
                      borderColor: errors.phone ? '#f44336' : '#ddd'
                    }}
                    containerStyle={{
                      border: errors.phone ? '1px solid #f44336' : '1px solid #ddd',
                      borderRadius: '4px',
                      '&:hover': {
                        borderColor: '#000'
                      }
                    }}
                    countryCodeEditable={false}
                    placeholder="+880 1XXXXXXXXX"
                  />
                  {errors.phone && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.phone.message}
                    </Typography>
                  )}
                </Box>

                {["password", "confirmPassword"].map((field) => (
                  <TextField
                    key={field}
                    margin="normal"
                    required
                    fullWidth
                    size="small"
                    id={field}
                    label={field === "password" ? "Password" : "Confirm Password"}
                    type={field === "password" ? (showPassword ? "text" : "password") : showConfirmPassword ? "text" : "password"}
                    {...register(field, {
                      required: `${field.replace(/([A-Z])/g, " $1")} is required`,
                      ...(field === "password" && {
                        minLength: { value: 6, message: "Password must be at least 6 characters long" },
                        validate: {
                          hasUpperCase: (value) => /[A-Z]/.test(value) || "Must contain at least one capital letter",
                          hasSpecialChar: (value) => /[!@#$%^&*()]/.test(value) || "Must contain one special character",
                        },
                      }),
                    })}
                    error={!!errors[field]}
                    helperText={errors[field]?.message}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: "#ddd" },
                        '&:hover fieldset': { borderColor: "#000" },
                        '&.Mui-focused fieldset': { borderColor: "#000" },
                      },
                      mb: 2
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={field === "password" ? togglePasswordVisibility : toggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {field === "password" ?
                              (showPassword ? <VisibilityOff /> : <Visibility />) :
                              (showConfirmPassword ? <VisibilityOff /> : <Visibility />)}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ))}

                {/* Terms and Conditions Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="/terms" underline="hover" color="primary">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !agree}
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#000",
                    "&:hover": { bgcolor: "#333" },
                    textTransform: "none",
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'grey.500' }} /> : "Register"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}