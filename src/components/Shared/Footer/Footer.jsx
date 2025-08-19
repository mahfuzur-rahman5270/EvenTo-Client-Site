import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import logo from '../../../assets/logo/logo_light.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Footer links data
    const companyLinks = [
        { name: 'About us', url: '/aboutus' },
        { name: 'Services', url: '/services' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Blog', url: '/blogs' },
    ];

    const usefulLinks = [
        { name: 'Terms of Services', url: '/terms' },
        { name: 'Privacy Policy', url: '/terms' },
        { name: 'Contact', url: '/contact' },
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/shreethemes',
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            ),
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com/shreethemes',
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            url: 'http://linkedin.com/company/shreethemes',
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/shreethemes/',
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
        },
    ];

    const contactInfo = [
        {
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            ),
            content: (
                <>
                    Daffodil Smart City
                    <br />
                    Birulia 1216
                </>
            ),
        },
        {
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
            content: (
                <Link
                    href="mailto:info.tonmoyorg@gmail.com"
                    color="inherit"
                    sx={{ '&:hover': { color: 'white' } }}
                >
                    info.tonmoyorg@gmail.com
                </Link>
            ),
        },
        {
            icon: (
                <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            content: (
                <Link
                    href="tel:+8801609804993"
                    color="inherit"
                    sx={{ '&:hover': { color: 'white' } }}
                >
                    +880 1609 804 993
                </Link>
            ),
        },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(to bottom, #0F172A, #1E293B)',
                color: '#D1D5DB',
                px: { xs: 2, md: 14 },
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ py: { lg: 8 } }}>
                    <Grid container spacing={4}>
                        {/* Brand Column */}
                        <Grid item xs={12} md={6} lg={3}>
                            <Box sx={{ mb: 6 }}>
                                <Link href="/" sx={{ display: 'inline-block' }}>
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="Company Logo"
                                        sx={{ height: 'auto', width: '150px' }}
                                        loading="lazy"
                                    />
                                </Link>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#9CA3AF', mt: 2, lineHeight: 1.75 }}
                                >
                                    A concern of Adventor Global Limited.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    {socialLinks.map((social, index) => (
                                        <IconButton
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#9CA3AF',
                                                '&:hover': { color: 'white' },
                                            }}
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Company Links */}
                        <Grid item xs={12} md={6} lg={3}>
                            <Typography
                                variant="h6"
                                sx={{ color: 'white', fontWeight: 600, mb: 3 }}
                            >
                                Company
                            </Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                {companyLinks.map((link, index) => (
                                    <Box
                                        component="li"
                                        key={index}
                                        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: '#16A34A',
                                                borderRadius: '50%',
                                                mr: 1.5,
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                '.MuiLink-root:hover &': { opacity: 1 },
                                            }}
                                        />
                                        <Link
                                            href={link.url}
                                            color="inherit"
                                            sx={{
                                                textDecoration: 'none',
                                                color: '#9CA3AF',
                                                '&:hover': { color: 'white' },
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* Useful Links */}
                        <Grid item xs={12} md={6} lg={3}>
                            <Typography
                                variant="h6"
                                sx={{ color: 'white', fontWeight: 600, mb: 3 }}
                            >
                                Resources
                            </Typography>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                {usefulLinks.map((link, index) => (
                                    <Box
                                        component="li"
                                        key={index}
                                        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                backgroundColor: '#16A34A',
                                                borderRadius: '50%',
                                                mr: 1.5,
                                                opacity: 0,
                                                transition: 'opacity 0.3s',
                                                '.MuiLink-root:hover &': { opacity: 1 },
                                            }}
                                        />
                                        <Link
                                            href={link.url}
                                            color="inherit"
                                            sx={{
                                                textDecoration: 'none',
                                                color: '#9CA3AF',
                                                '&:hover': { color: 'white' },
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* Contact Info */}
                        <Grid item xs={12} md={6} lg={3}>
                            <Typography
                                variant="h6"
                                sx={{ color: 'white', fontWeight: 600, mb: 3 }}
                            >
                                Contact Us
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {contactInfo.map((info, index) => (
                                    <Box
                                        key={index}
                                        sx={{ display: 'flex', alignItems: 'flex-start' }}
                                    >
                                        <Box
                                            sx={{
                                                color: '#16A34A',
                                                mr: 1.5,
                                                mt: info.content.type === 'p' ? 0.5 : 0,
                                            }}
                                        >
                                            {info.icon}
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#9CA3AF', lineHeight: 1.75 }}
                                        >
                                            {info.content}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Divider */}
                    <Box
                        sx={{
                            borderTop: '1px solid #1F2937',
                            pt: 4,
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: { xs: 'center', md: 'center' },
                                justifyContent: { md: 'space-between' },
                                gap: { xs: 2, md: 0 },
                            }}
                        >
                            <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                © {currentYear} Evento. All rights reserved. Designed with by Md.
                                Tanvir Hasan Tonmoy
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {[
                                    { name: 'Privacy Policy', url: '/terms' },
                                    { name: 'Terms of Service', url: '/terms' },
                                    { name: 'Cookie Policy', url: '/cookies' },
                                ].map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        color="inherit"
                                        sx={{
                                            textDecoration: 'none',
                                            color: '#6B7280',
                                            '&:hover': { color: 'white' },
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </Box>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;