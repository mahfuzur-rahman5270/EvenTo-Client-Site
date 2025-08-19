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
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    AccountCircle as AccountCircleIcon,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';

const UserLink = () => {
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
            color: isActive ? '#FFFFFF' : '#B0B0B0', // White for active, light gray for inactive
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // Subtle background for active
            '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)', // Subtle hover effect
                color: '#E0E0E0', // Lighter gray on hover for inactive
            },
            borderRadius: '5px',
            transition: 'all 0.2s ease',
        };
    };

    const getIconStyles = (path) => ({
        color: location.pathname.startsWith(path) ? '#FFFFFF' : '#B0B0B0', // White for active, light gray for inactive
        minWidth: '40px',
        transition: 'color 0.2s ease',
    });

    const sections = [
        {
            key: 'dashboard',
            icon: <DashboardIcon />,
            label: 'Dashboard Home',
            path: '/dashboard/user-home',
        },
        {
            key: 'user',
            icon: <AccountCircleIcon />,
            label: 'Account',
            items: [
                {
                    path: '/dashboard/profile',
                    icon: <ManageAccountsIcon />,
                    label: 'My Profile'
                },
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

export default UserLink;