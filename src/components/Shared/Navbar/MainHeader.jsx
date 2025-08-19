import { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Box,
    ListItemButton,
    Button,
    Menu,
    MenuItem,
    Avatar,
    Skeleton,
    ListItemIcon,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Dashboard as DashboardIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Login as LoginIcon,
    PersonAdd as PersonAddIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { LogOut as LogOutIcon } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import useAdmin from '../../../hooks/useAdmin';
import logo from '../../../assets/logo/logo_pro.png';
import useUser from '../../../hooks/useUser';
import useEventOrganizer from '../../../hooks/useEventOrganizer';

// Color palette
const colors = {
    primary: '#16A34A',
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

const navItems = [
    { path: '/', label: 'Home', icon: <DashboardIcon fontSize="small" /> },
    { path: '/events', label: 'Events', icon: <DashboardIcon fontSize="small" /> },
    { path: '/blogs', label: 'Blogs', icon: <DashboardIcon fontSize="small" /> },
    { path: '/contact', label: 'Contact us', icon: <DashboardIcon fontSize="small" /> },
];


const MainHeader = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isClient = typeof window !== 'undefined';

    const { user, logOut, loading: authLoading, reloadUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/login';
    const [isAdmin, adminLoading, refetch] = useAdmin();
    const [isUser, isUserLoading, reloadUserState] = useUser();
    const [isEventOrganizer, isEventOrganizerLoading, reloadEventOrganizerState] = useEventOrganizer();

    // Combined loading state
    const isLoading = authLoading || adminLoading || isUserLoading || isEventOrganizerLoading;

    // Call this when you know the backend updated the user's info
    useEffect(() => {
        const refresh = async () => {
            await reloadUser();
            refetch();
            reloadUserState();
            reloadEventOrganizerState();
        };
        refresh();
    }, [reloadUser, refetch, reloadUserState, reloadEventOrganizerState]);

    const handleLogOut = useCallback(() => {
        handleMenuClose();
        logOut()
            .then(() => {
                localStorage.removeItem('access-token');
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, [logOut, navigate, from]);

    const handleMenuOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const linkStyles = useCallback((path) => {
        const isActive = location.pathname === path ||
            (path.startsWith('#') && isClient && window.location.hash === path);

        return {
            color: isActive ? colors.primary : colors.textPrimary,
            fontWeight: isActive ? 500 : 500,
            cursor: 'pointer',
            '&:hover': {
                color: colors.primaryDark,
            },
            transition: 'all 0.3s ease',
            fontSize: '0.9375rem',
            textDecoration: 'none',
            position: 'relative',
            '&:hover::after': {
                width: '100%',
            },
        };
    }, [location.pathname, isClient]);

    const buttonStyles = useMemo(() => ({
        px: 2.5,
        borderRadius: '5px',
        background: colors.primary,
        color: colors.background,
        textTransform: 'capitalize',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
        fontWeight: 500,
        fontSize: '0.9375rem',
        '&:hover': {
            background: colors.primaryDark,
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
        },
    }), []);

    const renderDashboardMenuItem = useMemo(() => {
        if (isLoading) {
            return (
                <MenuItem sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <Skeleton variant="circular" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary={<Skeleton width={120} />} />
                </MenuItem>
            );
        }

        let icon, text, path;
        if (isAdmin) {
            icon = <AdminPanelSettingsIcon fontSize="small" />;
            text = 'Admin Dashboard';
            path = '/admin-dashboard';
        } else if (isEventOrganizer) {
            icon = <EventIcon fontSize="small" />;
            text = 'Event Organizer Dashboard';
            path = '/event-organizer-dashboard';
        } else if (isUser) {
            icon = <DashboardIcon fontSize="small" />;
            text = 'User Dashboard';
            path = '/dashboard';
        }

        return (
            <MenuItem
                onClick={() => {
                    handleMenuClose();
                    navigate(path);
                }}
                sx={{
                    py: 1.5,
                    '&:hover': {
                        background: colors.hoverBg,
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.875rem'
                    }}
                />
            </MenuItem>
        );
    }, [isLoading, isAdmin, isEventOrganizer, isUser, handleMenuClose, navigate]);

    const userProfileSection = useMemo(() => (
        <Box sx={{
            textAlign: 'center',
            mb: 2,
            px: 3,
            pt: 3
        }}>
            {user?.photoURL ? (
                <Avatar
                    src={user.photoURL}
                    alt={user?.displayName || 'User'}
                    sx={{
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 1.5,
                        border: `3px solid ${colors.divider}`
                    }}
                />
            ) : (
                <AccountCircle
                    sx={{
                        width: 70,
                        height: 70,
                        mx: 'auto',
                        mb: 1.5,
                        color: colors.primary,
                    }}
                />
            )}
            <Typography variant="subtitle1" fontWeight={600}>
                {user?.displayName || user?.email}
            </Typography>
            <Typography variant="body2" color={colors.textSecondary} sx={{ fontSize: '0.875rem' }}>
                {user?.email}
            </Typography>
            <Button
                variant="contained"
                size="medium"
                href={`${isAdmin ? '/admin-dashboard/admin/profile' : isEventOrganizer ? '/event-organizer-dashboard/profile' : '/edit-profile'}`}
                sx={{
                    px: 2.5,
                    my: 1.5,
                    fontWeight: 500,
                    background: colors.primary,
                    borderRadius: '5px',
                    color: colors.background,
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    '&:hover': {
                        background: colors.primaryDark,
                        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                    }
                }}
            >
                View Profile
            </Button>
        </Box>
    ), [user, isAdmin, isEventOrganizer]);

    const renderAuthButtons = useMemo(() => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={80} height={24} />
                </Box>
            );
        }

        if (user) {
            return (
                <>
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{
                            ml: { xs: 0, md: 0.8 },
                            p: 0,
                            '&:hover': {
                                backgroundColor: colors.hoverBg
                            }
                        }}
                    >
                        {user?.photoURL ? (
                            <Avatar
                                src={user.photoURL}
                                alt={user?.displayName || 'User'}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    p: 0,
                                    border: `2px solid ${colors.divider}`
                                }}
                            />
                        ) : (
                            <AccountCircle
                                sx={{
                                    fontSize: 36,
                                    color: colors.primary,
                                }}
                            />
                        )}
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            mt: '45px',
                            '& .MuiPaper-root': {
                                width: 300,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                borderRadius: '12px',
                                border: `1px solid ${colors.divider}`
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
                        {userProfileSection}
                        <Divider sx={{ my: 0.5, borderColor: colors.divider }} />
                        {renderDashboardMenuItem}
                        <MenuItem
                            onClick={handleLogOut}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    background: 'rgba(211, 47, 47, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: colors.error }}>
                                <LogOutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    color: colors.error
                                }}
                            />
                        </MenuItem>
                    </Menu>
                </>
            );
        }

        return (
            <>
                <Tooltip title="Login">
                    <IconButton
                        component={Link}
                        to="/login"
                        sx={{
                            backgroundColor: colors.primaryLight,
                            color: colors.primary,
                            '&:hover': {
                                backgroundColor: colors.hoverBg,
                            },
                            display: { xs: 'flex', md: 'flex' },
                        }}
                    >
                        <LoginIcon />
                    </IconButton>
                </Tooltip>

                <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{
                        ...buttonStyles,
                        display: { xs: 'none', md: 'flex' },
                    }}
                    startIcon={<PersonAddIcon />}
                >
                    Sign Up
                </Button>
            </>
        );
    }, [isLoading, user, handleMenuOpen, anchorEl, handleMenuClose, userProfileSection, renderDashboardMenuItem, handleLogOut, buttonStyles]);

    const renderMobileAuthButtons = useMemo(() => {
        if (isLoading) {
            return (
                <>
                    <ListItem disablePadding>
                        <Skeleton variant="rectangular" width="100%" height={48} />
                    </ListItem>
                    <ListItem disablePadding sx={{ mt: 1 }}>
                        <Skeleton variant="rectangular" width="100%" height={48} />
                    </ListItem>
                </>
            );
        }

        if (user) {
            return (
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogOut}
                        sx={{
                            px: 2,
                            borderRadius: '8px',
                            '&:hover': {
                                background: 'rgba(211, 47, 47, 0.08)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.error }}>
                            <LogOutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                sx: {
                                    color: colors.error,
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            );
        }

        return (
            <>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/login"
                        onClick={() => setOpenDrawer(false)}
                        sx={{
                            px: 2,
                            borderRadius: '8px',
                            '&:hover': {
                                background: colors.hoverBg,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.primary }}>
                            <LoginIcon sx={{ color: colors.primary, fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Login"
                            primaryTypographyProps={{
                                sx: {
                                    color: colors.primary,
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/register"
                        onClick={() => setOpenDrawer(false)}
                        sx={{
                            px: 2,
                            borderRadius: '8px',
                            '&:hover': {
                                background: colors.hoverBg,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: colors.primary }}>
                            <PersonAddIcon sx={{ color: colors.primary, fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Sign Up"
                            primaryTypographyProps={{
                                sx: {
                                    color: colors.primary,
                                    fontWeight: 600,
                                    fontSize: '0.95rem'
                                },
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </>
        );
    }, [isLoading, user, handleLogOut]);

    const renderMobileDashboardLinks = useMemo(() => {
        if (isLoading) return null;

        const items = [];

        if (isAdmin) {
            items.push({
                path: '/admin-dashboard',
                label: 'Admin Dashboard',
                icon: <AdminPanelSettingsIcon fontSize="small" />
            });
        }

        if (isEventOrganizer) {
            items.push({
                path: '/event-organizer-dashboard',
                label: 'Event Organizer Dashboard',
                icon: <EventIcon fontSize="small" />
            });
        }

        if (isUser) {
            items.push({
                path: '/dashboard',
                label: 'User Dashboard',
                icon: <DashboardIcon fontSize="small" />
            });
        }

        return items.map((item) => (
            <ListItem key={item.path} disablePadding>
                <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => setOpenDrawer(false)}
                    sx={{
                        px: 2,
                        borderRadius: '8px',
                        '&:hover': {
                            background: colors.hoverBg,
                        },
                    }}
                >
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                            sx: {
                                fontWeight: 600,
                                fontSize: '0.95rem'
                            },
                        }}
                    />
                </ListItemButton>
            </ListItem>
        ));
    }, [isLoading, isAdmin, isEventOrganizer, isUser]);

    return (
        <Box>
            <Box id="back-to-top-anchor" />
            <Box>
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 1,
                        px: { xs: 2.5, md: 15 },
                        transition: 'all 0.3s ease',
                        borderBottom: `1px solid ${colors.divider}`,
                    }}
                >
                    <Toolbar
                        sx={{
                            padding: { xs: '0 !important', md: '0 16px !important' },
                            justifyContent: { xs: 'space-between', md: 'flex-start' },
                            minHeight: '70px !important',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': {
                                opacity: 0.9
                            }
                        }}>
                            <Box component={Link} to="/" sx={{ display: { xs: 'block' } }}>
                                <img src={logo} alt="logo" width="130px" style={{ display: 'block' }} />
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Desktop Navigation */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 3,
                                alignItems: 'center',
                                mr: 3,
                            }}
                        >
                            {navItems.map((item) => (
                                <Typography
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    sx={linkStyles(item.path)}
                                >
                                    {item.label}
                                </Typography>
                            ))}
                        </Box>

                        {/* Auth Buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            {renderAuthButtons}
                        </Box>

                        {/* Mobile Menu Button */}
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                '&:hover': {
                                    background: colors.hoverBg,
                                },
                            }}
                            onClick={() => setOpenDrawer(true)}
                        >
                            <MenuIcon
                                sx={{
                                    fontSize: 28,
                                    color: colors.textPrimary,
                                }}
                            />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    PaperProps={{
                        sx: {
                            width: { xs: '80%', sm: '60%' },
                            maxWidth: 320,
                            backgroundColor: colors.background,
                            borderTopLeftRadius: '16px',
                            borderBottomLeftRadius: '16px',
                        },
                    }}
                >
                    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <img src={logo} alt="logo" />
                        </Box>
                        <Divider sx={{ my: 1, borderColor: colors.divider }} />

                        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {navItems.map((item) => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={item.path}
                                        onClick={() => setOpenDrawer(false)}
                                        sx={{
                                            px: 2,
                                            borderRadius: '8px',
                                            '&.Mui-selected': {
                                                background: colors.activeBg,
                                            },
                                            '&.Mui-selected:hover': {
                                                background: colors.activeBg,
                                            },
                                        }}
                                        selected={location.pathname === item.path}
                                    >
                                        <ListItemIcon sx={{ color: location.pathname === item.path ? colors.primary : 'inherit' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: 600,
                                                    color: location.pathname === item.path ? colors.primary : colors.textPrimary,
                                                    fontSize: '0.95rem'
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}

                            {renderMobileDashboardLinks}
                            {renderMobileAuthButtons}
                        </List>

                        <Box sx={{ mt: 'auto', p: 2 }}>
                            <Typography
                                variant="body2"
                                textAlign="center"
                                sx={{
                                    opacity: 0.7,
                                    fontSize: '0.75rem',
                                    color: colors.textSecondary
                                }}
                            >
                                Evento © {new Date().getFullYear()}
                            </Typography>
                        </Box>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};

MainHeader.propTypes = {
    window: PropTypes.func,
};

export default MainHeader;