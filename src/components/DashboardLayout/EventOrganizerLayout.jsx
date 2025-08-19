'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    CssBaseline,
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer as MuiDrawer,
    Divider,
    List,
    Avatar,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Skeleton,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    Event as EventIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAdmin from '../../hooks/useAdmin';
import useUser from '../../hooks/useUser';
import useEventOrganizer from '../../hooks/useEventOrganizer';
import logo from '../../assets/logo/logo_pro.png';
import DashboardFooter from '../DashboardFooter/DashboardFooter';
import EventRoute from '../LinkRoute/EventRoute';

const drawerWidth = 255;
const PRIMARY_COLOR = '#16A34A';
const colors = {
    primary: PRIMARY_COLOR,
    primaryLight: '#E6F7ED',
    primaryDark: '#0D6E36',
    textPrimary: '#1A1A1A',
    textSecondary: '#4D4D4D',
    background: '#FFFFFF',
    divider: 'rgba(0, 0, 0, 0.08)',
    hoverBg: 'rgba(22, 163, 74, 0.05)',
    activeBg: 'rgba(22, 163, 74, 0.08)',
    error: '#D32F2F',
};

// Drawer styles
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    boxShadow: theme.shadows[3],
    backgroundColor: '#000000',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    boxShadow: theme.shadows[3],
    backgroundColor: '#000000',
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    boxShadow: 'none',
    color: colors.textPrimary,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logOut, loading: authLoading, reloadUser } = useAuth();
    const [isAdmin, adminLoading, refetchAdmin] = useAdmin();
    const [isUser, isUserLoading, reloadUserState] = useUser();
    const [isEventOrganizer, isEventOrganizerLoading, reloadEventOrganizerState] = useEventOrganizer();
    const location = useLocation();
    const navigate = useNavigate();

    // Combined loading state
    const isLoading = authLoading || adminLoading || isUserLoading || isEventOrganizerLoading;

    // Refresh user and role states
    useEffect(() => {
        const refresh = async () => {
            await reloadUser();
            refetchAdmin();
            reloadUserState();
            reloadEventOrganizerState();
        };
        refresh();
    }, [reloadUser, refetchAdmin, reloadUserState, reloadEventOrganizerState]);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleLogOut = () => {
        handleMenuClose();
        logOut()
            .then(() => {
                localStorage.removeItem('access-token');
                navigate(location.state?.from?.pathname || '/login', { replace: true });
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Determine dashboard and profile paths based on role
    const getDashboardPath = () => {
        if (isAdmin) return '/admin-dashboard';
        if (isEventOrganizer) return '/event-organizer-dashboard';
        if (isUser) return '/dashboard';
        return '/dashboard';
    };

    const getProfilePath = () => {
        if (isAdmin) return '/admin-dashboard/admin/profile';
        if (isEventOrganizer) return '/event-organizer-dashboard/profile';
        if (isUser) return '/dashboard/profile';
        return '/dashboard/profile';
    };

    const getSettingsPath = () => {
        if (isAdmin) return '/admin-dashboard/admin/settings';
        if (isEventOrganizer) return '/event-organizer-dashboard/settings';
        if (isUser) return '/dashboard/settings';
        return '/dashboard/settings';
    };

    const getRoleLabel = () => {
        if (isAdmin) return 'Admin';
        if (isEventOrganizer) return 'Event Organizer';
        if (isUser) return 'User';
        return '';
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ paddingRight: '24px !important' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                            color: colors.primary,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <img className="w-32 h-auto" src={logo} alt="logo" />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Skeleton variant="circular" width={36} height={36} />
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                                    <Skeleton variant="text" width={100} height={20} />
                                    <Skeleton variant="text" width={60} height={16} />
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuOpen}>
                                <Avatar
                                    src={user?.photoURL}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: user?.photoURL ? undefined : colors.primary,
                                    }}
                                >
                                    {!user?.photoURL && user?.displayName?.charAt(0)}
                                </Avatar>
                                {open && (
                                    <Box sx={{ ml: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                                        <Typography variant="subtitle2" sx={{ lineHeight: 1, color: colors.textPrimary }}>
                                            {user?.displayName || 'User'}
                                        </Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>
                                            {getRoleLabel()}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            mt: '45px',
                            '& .MuiPaper-root': {
                                width: 300,
                                boxShadow: theme.shadows[3],
                                borderRadius: '12px',
                                border: `1px solid ${colors.divider}`,
                            },
                        }}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {isLoading ? (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
                                <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto' }} />
                                <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
                                <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto', mt: 2, borderRadius: 1 }} />
                            </Box>
                        ) : (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Avatar
                                    src={user?.photoURL}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        mb: 2,
                                        mx: 'auto',
                                        bgcolor: user?.photoURL ? undefined : colors.primary,
                                        fontSize: '2rem',
                                    }}
                                >
                                    {!user?.photoURL && user?.displayName?.charAt(0)}
                                </Avatar>
                                <Typography variant="h6" gutterBottom sx={{ color: colors.textPrimary }}>
                                    {user?.displayName || 'User'}
                                </Typography>
                                {getRoleLabel() && (
                                    <Chip
                                        label={getRoleLabel()}
                                        size="small"
                                        sx={{
                                            mb: 1,
                                            backgroundColor: colors.primary,
                                            color: colors.background,
                                        }}
                                    />
                                )}
                                <Typography variant="body2" color={colors.textSecondary}>
                                    {user?.email || 'No Email'}
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ borderColor: colors.divider }} />

                        {!isLoading && (
                            <MenuItem
                                component={Link}
                                to={getDashboardPath()}
                                onClick={handleMenuClose}
                                sx={{
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: colors.hoverBg,
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    {isAdmin ? (
                                        <AdminPanelSettingsIcon fontSize="small" sx={{ color: colors.primary }} />
                                    ) : isEventOrganizer ? (
                                        <EventIcon fontSize="small" sx={{ color: colors.primary }} />
                                    ) : (
                                        <DashboardIcon fontSize="small" sx={{ color: colors.primary }} />
                                    )}
                                </ListItemIcon>
                                <ListItemText primary={`${getRoleLabel()} Dashboard`} />
                            </MenuItem>
                        )}

                        <MenuItem
                            component={Link}
                            to={getProfilePath()}
                            onClick={handleMenuClose}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: colors.hoverBg,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <PersonIcon fontSize="small" sx={{ color: colors.primary }} />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to={getSettingsPath()}
                            onClick={handleMenuClose}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: colors.hoverBg,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" sx={{ color: colors.primary }} />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </MenuItem>

                        <Divider sx={{ borderColor: colors.divider }} />

                        <MenuItem
                            onClick={handleLogOut}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: `rgba(211, 47, 47, 0.08)`,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" sx={{ color: colors.error }} />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ color: colors.error }} />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" sx={{ flexGrow: 1, pl: 1, color: colors.primary }}>
                        Menu
                    </Typography>
                    <IconButton onClick={handleDrawerClose} sx={{ color: colors.primary }}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{ borderColor: colors.divider }} />
                <List sx={{ px: 1 }}>
                    <EventRoute primaryColor={colors.primary} isAdmin={isAdmin} isEventOrganizer={isEventOrganizer} isUser={isUser} />
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: '#F1F5F9',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DrawerHeader />
                <Box sx={{ flexGrow: 1, backgroundColor: '#F1F5F9' }}>
                    {isLoading ? (
                        <Box sx={{ p: 3 }}>
                            <Skeleton variant="rectangular" width="100%" height={400} />
                        </Box>
                    ) : (
                        <Outlet />
                    )}
                </Box>
                <DashboardFooter primaryColor={colors.primary} />
            </Box>
        </Box>
    );
}