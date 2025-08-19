'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Logout as LogoutIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import UserLink from '../LinkRoute/UserLink';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo/logo_pro.png';
import DashboardFooter from '../DashboardFooter/DashboardFooter';
import useUser from '../../hooks/useUser';

const drawerWidth = 255;
const PRIMARY_COLOR = '#16A34A';

// Drawer styles
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    boxShadow: theme.shadows[3],
    backgroundColor: '#000000', // Changed to black
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
    backgroundColor: '#000000', // Changed to black
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
    color: 'black',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.shsharp,
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
    const { user, logOut } = useAuth();
    const [isUser] = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleLogOut = () => {
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
                            color: PRIMARY_COLOR,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <img className='w-32 h-auto' src={logo} alt="logo" />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuOpen}>
                            <Avatar
                                src={user?.photoURL}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: user?.photoURL ? undefined : PRIMARY_COLOR,
                                }}
                            >
                                {!user?.photoURL && user?.displayName?.charAt(0)}
                            </Avatar>
                            {open && (
                                <Box sx={{ ml: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column' }}>
                                    <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
                                        {user?.displayName || 'User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {isUser ? 'User' : ''}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
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
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Avatar
                                src={user?.photoURL}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    mx: 'auto',
                                    bgcolor: user?.photoURL ? undefined : PRIMARY_COLOR,
                                    fontSize: '2rem',
                                }}
                            >
                                {!user?.photoURL && user?.displayName?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {user?.displayName || 'User'}
                            </Typography>
                            {isUser && (
                                <Chip
                                    label="User"
                                    size="small"
                                    sx={{
                                        mb: 1,
                                        backgroundColor: PRIMARY_COLOR,
                                        color: 'white',
                                    }}
                                />
                            )}
                            <Typography variant="body2" color="text.secondary">
                                {user?.email || 'No Email'}
                            </Typography>
                        </Box>

                        <Divider />
                        <MenuItem
                            component={Link}
                            to="/admin-dashboard/admin/profile"
                            onClick={handleMenuClose}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: `rgba(22, 163, 74, 0.1)`,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <PersonIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/admin-dashboard/admin/profile"
                            onClick={handleMenuClose}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: `rgba(22, 163, 74, 0.1)`,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </MenuItem>

                        <Divider />

                        <MenuItem
                            onClick={handleLogOut}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: `rgba(22, 163, 74, 0.1)`,
                                },
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" sx={{ color: PRIMARY_COLOR }} />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Typography variant="h6" sx={{ flexGrow: 1, pl: 1, color: PRIMARY_COLOR }}>
                        Menu
                    </Typography>
                    <IconButton onClick={handleDrawerClose} sx={{ color: PRIMARY_COLOR }}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{ px: 1 }}>
                    <UserLink primaryColor={PRIMARY_COLOR} />
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
                    <Outlet />
                </Box>
                <DashboardFooter primaryColor={PRIMARY_COLOR} />
            </Box>
        </Box>
    );
}