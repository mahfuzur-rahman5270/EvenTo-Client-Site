import { useState, useMemo } from 'react';
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

const EventRoute = () => {
    const location = useLocation();
    const [expanded, setExpanded] = useState({
        user: false, // Only keeping relevant expanded state
    });

    const handleToggle = (section) => {
        setExpanded((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const getActiveStyles = useMemo(() => (path) => ({
        color: location.pathname.startsWith(path) ? '#FFFFFF' : '#B0B0B0',
        backgroundColor: location.pathname.startsWith(path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#E0E0E0',
        },
        borderRadius: '5px',
        transition: 'all 0.2s ease',
    }), [location.pathname]);

    const getIconStyles = useMemo(() => (path) => ({
        color: location.pathname.startsWith(path) ? '#FFFFFF' : '#B0B0B0',
        minWidth: '40px',
        transition: 'color 0.2s ease',
    }), [location.pathname]);

    const sections = useMemo(() => [
        {
            key: 'dashboard',
            icon: <DashboardIcon />,
            label: 'Dashboard Home',
            path: '/event-organizer-dashboard/home',
        },
        {
            key: 'user',
            icon: <AccountCircleIcon />,
            label: 'Account',
            items: [
                {
                    path: '/event-organizer-dashboard/profile',
                    icon: <ManageAccountsIcon />,
                    label: 'My Profile'
                },
            ],
        },
    ], []);

    const renderSection = (section) => {
        if (section.path) {
            return (
                <ListItem disablePadding key={section.key}>
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
            );
        }

        return (
            <Box key={section.key}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleToggle(section.key)}
                        sx={getActiveStyles(`/event-organizer-dashboard/${section.key}`)}
                    >
                        <ListItemIcon sx={getIconStyles(`/event-organizer-dashboard/${section.key}`)}>
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
                            <ExpandLessIcon sx={getIconStyles(`/event-organizer-dashboard/${section.key}`)} />
                        ) : (
                            <ExpandMoreIcon sx={getIconStyles(`/event-organizer-dashboard/${section.key}`)} />
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
            </Box>
        );
    };

    return (
        <Box sx={{ padding: 1 }}>
            <List disablePadding dense>
                {sections.map(renderSection)}
            </List>
        </Box>
    );
};

export default EventRoute;