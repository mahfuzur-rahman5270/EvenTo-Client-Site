import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    TextField,
    Typography,
    LinearProgress,
    Box,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    InputAdornment,
    Stack,
    IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MdSearch, MdPerson, MdEdit } from 'react-icons/md';
import useAxios from '../../hooks/useAxios';

const UserProfile = () => {
    const [axiosSecure] = useAxios();
    const { data: adminUsers = [], isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/users');
            return res.data;
        },
    });

    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
        }

        setSelected(newSelected);
    };

    // Filter users based on search query
    const filteredUsers = adminUsers.filter((user) =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Responsive table content
    const renderTableContent = () => (
        <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{
                background: 'linear-gradient(to right, #f5f7fa 0%, #e4e8ed 100%)',
                '& th': {
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    color: '#1a237e'
                }
            }}>
                <TableRow>
                    <TableCell>SL NO</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                        <TableRow
                            key={user._id}
                            onClick={() => handleSelect(user._id)}
                            sx={{
                                cursor: 'pointer',
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                    <Typography fontWeight={600}>{user.displayName}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
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
                            <TableCell align="center">
                                <Tooltip title="Update User Info">
                                    <IconButton
                                        component={Link}
                                        to={`/admin-dashboard/admin-info-update/${user._id}`}
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <MdEdit />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    );

    // Card-based content for mobile
    const renderCardContent = () => (
        <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
            {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                    <Card
                        key={user._id}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.05)',
                            backgroundColor: selected.includes(user._id) ? 'rgba(245, 247, 250, 0.7)' : 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                            }
                        }}
                        onClick={() => handleSelect(user._id)}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <Avatar
                                    src={user.photoURL}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {user.displayName?.charAt(0) || <MdPerson />}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {user.displayName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        #{index + 1 + (page * rowsPerPage)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
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

                                <Button
                                    startIcon={<MdEdit />}
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                            transform: 'translateY(-1px)'
                                        },
                                        fontSize: '0.75rem',
                                        padding: '6px 12px',
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    variant="contained"
                                    size="small"
                                    component={Link}
                                    to={`/admin-dashboard/admin-info-update/${user._id}`}
                                >
                                    Update
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
        </Box>
    );

    return (
        <Box sx={{
            p: { xs: 2, md: 2 },
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)'
        }}>
            <Helmet>
                <title>User Profile - Evento</title>
            </Helmet>

            {isLoading ? (
                <LinearProgress color="success" sx={{ height: 4 }} />
            ) : (
                <Box sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            p: 3,
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'linear-gradient(to right, #f9fafc 0%, #ffffff 100%)'
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#1a237e',
                                mb: { xs: 2, sm: 0 },
                                letterSpacing: '0.5px'
                            }}
                        >
                            User Profiles
                            <Typography variant="caption" display="block" sx={{
                                color: 'text.secondary',
                                fontWeight: 400,
                                letterSpacing: '0.3px'
                            }}>
                                Manage all user accounts
                            </Typography>
                        </Typography>
                        <TextField
                            label="Search users"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdSearch />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: { xs: '100%', sm: 300 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }
                            }}
                        />
                    </Box>

                    <TableContainer sx={{
                        display: { xs: 'none', sm: 'block' },
                        maxHeight: 'calc(100vh - 200px)',
                        borderRadius: 0
                    }}>
                        {renderTableContent()}
                    </TableContainer>

                    {renderCardContent()}

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
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
                </Box>
            )}
        </Box>
    );
};

export default UserProfile;