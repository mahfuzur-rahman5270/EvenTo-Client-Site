import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
} from '@mui/material';
import {
    ManageAccounts as ManageAccountsIcon,
    LibraryBooks as LibraryBooksIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    PostAdd as PostAddIcon,
    ManageSearch as ManageSearchIcon,
    PersonAdd as PersonAddIcon,
    AccountCircle as AccountCircleIcon,
    Event as EventIcon,
    EventAvailable as EventAvailableIcon,
    CalendarToday as CalendarTodayIcon,
    Summarize,
    Receipt,
} from '@mui/icons-material';
import { LayoutDashboardIcon } from 'lucide-react';

const LinkRoute = () => {
    const location = useLocation();
    const [expanded, setExpanded] = useState({
        user: false,
        blog: false,
        video: false,
        courses: false,
        testimonials: false,
        payments: false,
        account: false,
        banners: false,
        notices: false,
        events: false, // Added events to the expanded state
    });

    const handleToggle = (section) => {
        setExpanded((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getActiveStyles = (path) => {
        const isActive = location.pathname.startsWith(path);
        return {
            color: isActive ? '#FFFFFF' : '#B0B0B0',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#E0E0E0',
            },
            borderRadius: '5px',
            transition: 'all 0.2s ease',
        };
    };

    const getIconStyles = (path) => ({
        color: location.pathname.startsWith(path) ? '#FFFFFF' : '#B0B0B0',
        minWidth: '40px',
        transition: 'color 0.2s ease',
    });

    const sections = [
        {
            key: 'dashboard',
            icon: <LayoutDashboardIcon />,
            label: 'Dashboard Home',
            path: '/admin-dashboard',
        },
        {
            key: 'user',
            icon: <ManageAccountsIcon />,
            label: 'Users',
            items: [
                { path: '/admin-dashboard/user/create', icon: <PersonAddIcon />, label: 'Create User' },
                { path: '/admin-dashboard/user/manage', icon: <ManageAccountsIcon />, label: 'Manage Account' },
                { path: '/admin-dashboard/user/profile', icon: <AccountCircleIcon />, label: 'User Profile' },
            ],
        },
        {
            key: 'blog',
            icon: <LibraryBooksIcon />,
            label: 'Blog Content',
            items: [
                { path: '/admin-dashboard/blog/upload', icon: <PostAddIcon />, label: 'Create Blog' },
                { path: '/admin-dashboard/blog/manage', icon: <ManageSearchIcon />, label: 'Manage Blogs' },
            ],
        },
        {
            key: 'events',
            icon: <EventIcon />,
            label: 'Events',
            items: [
                { path: '/admin-dashboard/events/create', icon: <EventAvailableIcon />, label: 'Create Event' },
                { path: '/admin-dashboard/events/manage', icon: <CalendarTodayIcon />, label: 'Manage Events' },
            ],
        },
        {
            key: 'payments',
            icon: <Receipt />,
            label: 'Payments',
            items: [
                {
                    path: '/admin-dashboard/payments/statements',
                    icon: <Summarize />,
                    label: 'Order Statements'
                },
            ],
        },
        {
            key: 'account',
            icon: <AccountCircleIcon />,
            label: 'Account',
            items: [
                { path: '/admin-dashboard/admin/profile', icon: <ManageAccountsIcon />, label: 'My Profile' },
            ],
        },
    ];

    return (
        <Box>
            <List disablePadding>
                {sections.map((section) => (
                    <Box key={section.key} sx={{ mb: 0.5 }}>
                        {section.path ? (
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={section.path}
                                    sx={getActiveStyles(section.path)}
                                >
                                    <ListItemIcon sx={getIconStyles(section.path)}>
                                        {section.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={section.label}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ) : (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleToggle(section.key)}
                                        sx={getActiveStyles(`/admin-dashboard/${section.key}`)}
                                    >
                                        <ListItemIcon sx={getIconStyles(`/admin-dashboard/${section.key}`)}>
                                            {section.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={section.label}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                            }}
                                        />
                                        {expanded[section.key] ? (
                                            <ExpandLessIcon sx={getIconStyles(`/admin-dashboard/${section.key}`)} />
                                        ) : (
                                            <ExpandMoreIcon sx={getIconStyles(`/admin-dashboard/${section.key}`)} />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={expanded[section.key]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {section.items.map((item) => (
                                            <ListItem key={item.path} disablePadding>
                                                <ListItemButton
                                                    component={Link}
                                                    to={item.path}
                                                    sx={{
                                                        ...getActiveStyles(item.path),
                                                        pl: 4.5,
                                                        py: 0.75,
                                                        ml: 1,
                                                        mr: 1,
                                                        width: 'calc(100% - 16px)',
                                                    }}
                                                >
                                                    <ListItemIcon sx={getIconStyles(item.path)}>
                                                        {item.icon}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            variant: 'body2',
                                                            fontSize: '0.8125rem',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        )}
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default LinkRoute;