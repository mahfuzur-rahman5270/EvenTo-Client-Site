import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    TablePagination,
    Typography,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    Alert,
    AlertTitle,
    IconButton,
    Stack,
    Box,
    Chip,
    Avatar,
    Tooltip,
    InputAdornment,
    LinearProgress,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { MdDomainDisabled, MdOutlineOnlinePrediction, MdDelete, MdClose, MdPhone, MdEmail, MdPerson, MdSearch, MdLocationOn, MdContentCopy } from 'react-icons/md';
import { Helmet } from 'react-helmet';
import useAxios from '../../hooks/useAxios';

const ManageAdmin = () => {
    const [axiosSecure] = useAxios();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const { data: adminUsers = [], refetch, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/users');
            return res.data;
        },
    });

    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 5 : 10);
    const [updatingRoles, setUpdatingRoles] = useState({});
    const [enablingUsers, setEnablingUsers] = useState({});
    const [disablingUsers, setDisablingUsers] = useState({});
    const [deletingUsers, setDeletingUsers] = useState({});
    const [roleFilter, setRoleFilter] = useState('All');
    const [copiedAddressId, setCopiedAddressId] = useState(null);

    // Alert states
    const [alerts, setAlerts] = useState([]);
    const [actionConfirm, setActionConfirm] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const addAlert = (severity, title, message) => {
        const id = Date.now();
        setAlerts(prev => [...prev, { id, severity, title, message }]);
    };

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const confirmAction = (type, userId) => {
        setActionConfirm({ type, userId });
        addAlert('warning', 'Confirm Action', `Are you sure you want to ${type} this user?`);
    };

    const handleConfirmAction = (type, userId) => {
        setActionConfirm(null);
        setAlerts([]);
        switch (type) {
            case 'disable':
                handleDisableUser(userId);
                break;
            case 'enable':
                handleEnableUser(userId);
                break;
            case 'delete':
                handleDelete(userId);
                break;
            default:
                break;
        }
    };

    const handleDisableUser = (uid) => {
        setDisablingUsers(prev => ({ ...prev, [uid]: true }));

        axiosSecure.patch(`/api/users/disable/${uid}`)
            .then(() => {
                refetch();
                addAlert('success', 'Success', 'User has been disabled');
            })
            .catch((error) => {
                console.error('Error disabling user:', error);
                addAlert('error', 'Error', 'Failed to disable user');
            })
            .finally(() => setDisablingUsers(prev => ({ ...prev, [uid]: false })));
    };

    const handleEnableUser = (uid) => {
        setEnablingUsers(prev => ({ ...prev, [uid]: true }));

        axiosSecure.patch(`/api/users/enable/${uid}`)
            .then(() => {
                refetch();
                addAlert('success', 'Success', 'User has been enabled');
            })
            .catch((error) => {
                console.error('Error enabling user:', error);
                addAlert('error', 'Error', 'Failed to enable user');
            })
            .finally(() => setEnablingUsers(prev => ({ ...prev, [uid]: false })));
    };

    const handleDelete = (uid) => {
        setDeletingUsers(prev => ({ ...prev, [uid]: true }));

        axiosSecure.delete(`/api/users/admin/delete/${uid}`)
            .then(() => {
                refetch();
                addAlert('success', 'Success', 'User has been deleted');
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
                addAlert('error', 'Error', 'Failed to delete user');
            })
            .finally(() => setDeletingUsers(prev => ({ ...prev, [uid]: false })));
    };

    const handleRoleChange = (userId, newRole) => {
        setUpdatingRoles(prev => ({ ...prev, [userId]: true }));

        axiosSecure.patch(`/api/users/update-role/${userId}`, { role: newRole })
            .then(() => {
                refetch();
                addAlert('success', 'Success', 'Role updated successfully');
            })
            .catch((error) => {
                console.error('Error updating role:', error);
                addAlert('error', 'Error', 'Failed to update role');
            })
            .finally(() => {
                setUpdatingRoles(prev => ({ ...prev, [userId]: false }));
            });
    };

    const copyAddressToClipboard = (address, userId) => {
        if (!address) return;

        navigator.clipboard.writeText(address)
            .then(() => {
                setCopiedAddressId(userId);
                setTimeout(() => setCopiedAddressId(null), 2000);
                addAlert('success', 'Copied!', 'Address copied to clipboard');
            })
            .catch((err) => {
                console.error('Failed to copy address: ', err);
                addAlert('error', 'Error', 'Failed to copy address');
            });
    };

    // Filter users based on role filter and search query
    const filteredUsers = adminUsers.filter((user) => {
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesSearch = user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phoneNumber?.includes(searchQuery) ||
            user.address?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    // Format phone number for display
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return 'N/A';
        return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
    };

    return (
        <Box sx={{
            overflowX: 'auto',
            p: isMobile ? 1 : 0,
            background: 'linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)',
            minHeight: '100vh'
        }}>
            <Helmet>
                <title>Manage Account - Evento</title>
            </Helmet>

            <Box sx={{
                bgcolor: 'background.paper',
                my: isMobile ? 1 : 3,
                mx: isMobile ? 0 : isTablet ? 1 : 2,
                borderRadius: 3,
                boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    {alerts.map(alert => (
                        <Alert
                            key={alert.id}
                            severity={alert.severity}
                            sx={{
                                borderRadius: 0,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                borderBottom: '1px solid rgba(0,0,0,0.05)'
                            }}
                            action={
                                alert.severity === 'warning' && actionConfirm ? (
                                    <>
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={() => handleConfirmAction(actionConfirm.type, actionConfirm.userId)}
                                            sx={{
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            Confirm
                                        </Button>
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setActionConfirm(null);
                                                removeAlert(alert.id);
                                            }}
                                        >
                                            <MdClose fontSize="inherit" />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => removeAlert(alert.id)}
                                    >
                                        <MdClose fontSize="inherit" />
                                    </IconButton>
                                )
                            }
                        >
                            <AlertTitle sx={{ fontWeight: 600 }}>{alert.title}</AlertTitle>
                            {alert.message}
                        </Alert>
                    ))}
                </Stack>
                {isLoading ? (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color="success" sx={{ height: 4 }} />
                    </Box>
                ) : filteredUsers.length === 0 ? (
                    <Alert severity="info" sx={{
                        m: 2,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <AlertTitle sx={{ fontWeight: 600 }}>Info</AlertTitle>
                        No users found matching your criteria
                    </Alert>
                ) : (
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            padding: isMobile ? 2 : 3,
                            gap: 2,
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'linear-gradient(to right, #f9fafc 0%, #ffffff 100%)'
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a237e',
                                    mb: { xs: 2, sm: 0 },
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Account Management
                                <Typography variant="caption" display="block" sx={{
                                    color: 'text.secondary',
                                    fontWeight: 400,
                                    letterSpacing: '0.3px'
                                }}>
                                    Manage user roles and permissions
                                </Typography>
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: isMobile ? 'column' : 'row',
                                width: isMobile ? '100%' : 'auto'
                            }}>
                                <FormControl
                                    size="small"
                                    sx={{
                                        minWidth: isMobile ? '100%' : 140,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Select
                                        value={roleFilter}
                                        onChange={(e) => {
                                            setRoleFilter(e.target.value);
                                            setPage(0);
                                        }}
                                        sx={{
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <MenuItem value="All">All Roles</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="User">User</MenuItem>
                                        <MenuItem value="Event Organizer">Event Organizer</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Search users"
                                    variant="outlined"
                                    size="small"
                                    value={searchQuery}
                                    onChange={(event) => {
                                        setSearchQuery(event.target.value);
                                        setPage(0);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <MdSearch size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        width: isMobile ? '100%' : 300,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{
                            maxHeight: isMobile ? 'calc(100vh - 200px)' : 'none',
                            borderRadius: 0,
                            boxShadow: 'none',
                            border: 'none'
                        }}>
                            {isMobile ? (
                                <Table stickyHeader aria-label="mobile user table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(to right, #f5f7fa 0%, #e4e8ed 100%)'
                                            }}>
                                                User Details
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 2,
                                                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
                                                        background: 'white'
                                                    }}>
                                                        {/* User Info */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            background: 'rgba(245, 247, 250, 0.5)'
                                                        }}>
                                                            <Avatar
                                                                src={user.photoURL}
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                {user.displayName?.charAt(0) || <MdPerson />}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography fontWeight={600}>{user.displayName}</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {user.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Contact Info */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            background: 'rgba(245, 247, 250, 0.5)'
                                                        }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <MdPhone color="#555" />
                                                                <Typography>
                                                                    {user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <MdLocationOn color="#555" />
                                                                <Typography sx={{ flexGrow: 1 }}>
                                                                    {user.address ? user.address : 'N/A'}
                                                                </Typography>
                                                                {user.address && (
                                                                    <Tooltip
                                                                        title={copiedAddressId === user._id ? "Copied!" : "Copy address"}
                                                                        arrow
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => copyAddressToClipboard(user.address, user._id)}
                                                                            sx={{
                                                                                '&:hover': {
                                                                                    background: 'rgba(0,0,0,0.05)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MdContentCopy size={16} color="#555" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        {/* Role and Status */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            background: 'rgba(245, 247, 250, 0.5)'
                                                        }}>
                                                            <Box>
                                                                {updatingRoles[user._id] ? (
                                                                    <CircularProgress size={24} />
                                                                ) : (
                                                                    <FormControl size="small" variant="outlined">
                                                                        <Select
                                                                            size='small'
                                                                            value={user.role}
                                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                                            sx={{
                                                                                borderRadius: 1,
                                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                            }}
                                                                        >
                                                                            <MenuItem value="Admin">
                                                                                <Chip
                                                                                    label="Admin"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        fontWeight: 600,
                                                                                        background: 'rgba(26, 35, 126, 0.1)',
                                                                                        color: '#1a237e'
                                                                                    }}
                                                                                />
                                                                            </MenuItem>
                                                                            <MenuItem value="User">
                                                                                <Chip
                                                                                    label="User"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        fontWeight: 600,
                                                                                        background: 'rgba(0, 0, 0, 0.1)',
                                                                                        color: 'text.primary'
                                                                                    }}
                                                                                />
                                                                            </MenuItem>
                                                                            <MenuItem value="Event Organizer">
                                                                                <Chip
                                                                                    label="Event Organizer"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        fontWeight: 600,
                                                                                        background: 'rgba(156, 39, 176, 0.1)',
                                                                                        color: '#9c27b0'
                                                                                    }}
                                                                                />
                                                                            </MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                )}
                                                            </Box>
                                                            <Box>
                                                                {user.disabled ? (
                                                                    <Chip
                                                                        label="Disabled"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            color: 'error.main',
                                                                            borderColor: 'error.main',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Chip
                                                                        label="Active"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            color: 'success.main',
                                                                            borderColor: 'success.main',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        {/* Actions */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'flex-end',
                                                            gap: 1,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            background: 'rgba(245, 247, 250, 0.5)'
                                                        }}>
                                                            <Tooltip title={user.disabled ? "Enable user" : "Disable user"}>
                                                                <IconButton
                                                                    size="small"
                                                                    color={user.disabled ? "success" : "error"}
                                                                    onClick={() => user.disabled ?
                                                                        confirmAction('enable', user._id) :
                                                                        confirmAction('disable', user._id)}
                                                                    disabled={
                                                                        (user.disabled && (enablingUsers[user._id] || disablingUsers[user._id])) ||
                                                                        (!user.disabled && (disablingUsers[user._id] || enablingUsers[user._id]))
                                                                    }
                                                                    sx={{
                                                                        '&:hover': {
                                                                            background: user.disabled ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    {user.disabled ?
                                                                        (enablingUsers[user._id] ? <CircularProgress size={20} /> : <MdOutlineOnlinePrediction />) :
                                                                        (disablingUsers[user._id] ? <CircularProgress size={20} /> : <MdDomainDisabled />)
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete user">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => confirmAction('delete', user._id)}
                                                                    disabled={deletingUsers[user._id]}
                                                                    sx={{
                                                                        '&:hover': {
                                                                            background: 'rgba(244, 67, 54, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    {deletingUsers[user._id] ? <CircularProgress size={20} /> : <MdDelete />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Table stickyHeader aria-label="user table" sx={{ minWidth: 650 }}>
                                    <TableHead sx={{
                                        background: 'linear-gradient(to metaright, #f5f7fa 0%, #e4e8ed 100%)',
                                        '& th': {
                                            fontWeight: 700,
                                            letterSpacing: '0.5px',
                                            color: '#1a237e'
                                        }
                                    }}>
                                        <TableRow>
                                            <TableCell>SL NO</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Contact</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Membership</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user, index) => (
                                                <TableRow
                                                    key={user._id}
                                                    sx={{
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: 'rgba(245, 247, 250, 0.5)'
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                                        }
                                                    }}
                                                >
                                                    <TableCell sx={{ fontWeight: 500 }}>
                                                        {index + 1 + (page * rowsPerPage)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2
                                                        }}>
                                                            <Avatar
                                                                src={user.photoURL}
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                {user.displayName?.charAt(0) || <MdPerson />}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography fontWeight={600}>{user.displayName}</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <MdEmail color="#555" />
                                                                <Typography>{user.email}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <MdPhone color="#555" />
                                                                <Typography>
                                                                    {user.phoneNumber ? formatPhoneNumber(user.phoneNumber) : 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <MdLocationOn color="#555" />
                                                                <Typography sx={{ flexGrow: 1 }}>
                                                                    {user.address ? user.address : 'N/A'}
                                                                </Typography>
                                                                {user.address && (
                                                                    <Tooltip
                                                                        title={copiedAddressId === user._id ? "Copied!" : "Copy address"}
                                                                        arrow
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => copyAddressToClipboard(user.address, user._id)}
                                                                            sx={{
                                                                                '&:hover': {
                                                                                    background: 'rgba(0,0,0,0.05)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MdContentCopy size={16} color="#555" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {updatingRoles[user._id] ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            <FormControl size="small" variant="outlined">
                                                                <Select
                                                                    size='small'
                                                                    value={user.role}
                                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                                    }}
                                                                >
                                                                    <MenuItem value="Admin">
                                                                        <Chip
                                                                            label="Admin"
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 600,
                                                                                background: 'rgba(26, 35, 126, 0.1)',
                                                                                color: '#1a237e'
                                                                            }}
                                                                        />
                                                                    </MenuItem>
                                                                    <MenuItem value="User">
                                                                        <Chip
                                                                            label="User"
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 600,
                                                                                background: 'rgba(0, 0, 0, 0.1)',
                                                                                color: 'text.primary'
                                                                            }}
                                                                        />
                                                                    </MenuItem>
                                                                    <MenuItem value="Event Organizer">
                                                                        <Chip
                                                                            label="Event Organizer"
                                                                            size="small"
                                                                            sx={{
                                                                                fontWeight: 600,
                                                                                background: 'rgba(156, 39, 176, 0.1)',
                                                                                color: '#9c27b0'
                                                                            }}
                                                                        />
                                                                    </MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.lifeTimeMember ? (
                                                            <Tooltip
                                                                title={`Member since: ${new Date(user.lifeTimeMemberSince).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}`}
                                                                arrow
                                                            >
                                                                <Chip
                                                                    label="Lifetime"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        background: 'rgba(76, 175, 80, 0.1)',
                                                                        color: 'success.main',
                                                                        borderColor: 'success.main'
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        ) : (
                                                            <Chip
                                                                label="Free"
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    background: 'rgba(158, 158, 158, 0.1)',
                                                                    color: 'text.secondary',
                                                                    borderColor: 'text.secondary'
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.disabled ? (
                                                            <Chip
                                                                label="Disabled"
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    color: 'error.main',
                                                                    borderColor: 'error.main',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label="Active"
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    color: 'success.main',
                                                                    borderColor: 'success.main',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            gap: 1,
                                                            '& .MuiIconButton-root': {
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-1px)'
                                                                }
                                                            }
                                                        }}>
                                                            <Tooltip title={user.disabled ? "Enable user" : "Disable user"}>
                                                                <IconButton
                                                                    size="small"
                                                                    color={user.disabled ? "success" : "error"}
                                                                    onClick={() => user.disabled ?
                                                                        confirmAction('enable', user._id) :
                                                                        confirmAction('disable', user._id)}
                                                                    disabled={
                                                                        (user.disabled && (enablingUsers[user._id] || disablingUsers[user._id])) ||
                                                                        (!user.disabled && (disablingUsers[user._id] || enablingUsers[user._id]))
                                                                    }
                                                                    sx={{
                                                                        '&:hover': {
                                                                            background: user.disabled ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    {user.disabled ?
                                                                        (enablingUsers[user._id] ? <CircularProgress size={20} /> : <MdOutlineOnlinePrediction />) :
                                                                        (disablingUsers[user._id] ? <CircularProgress size={20} /> : <MdDomainDisabled />)
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete user">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => confirmAction('delete', user._id)}
                                                                    disabled={deletingUsers[user._id]}
                                                                    sx={{
                                                                        '&:hover': {
                                                                            background: 'rgba(244, 67, 54, 0.1)'
                                                                        }
                                                                    }}
                                                                >
                                                                    {deletingUsers[user._id] ? <CircularProgress size={20} /> : <MdDelete />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component='div'
                                count={filteredUsers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    borderTop: '1px solid rgba(0,0,0,0.05)',
                                    '& .MuiTablePagination-toolbar': {
                                        background: 'rgba(245, 247, 250, 0.5)'
                                    }
                                }}
                            />
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ManageAdmin;