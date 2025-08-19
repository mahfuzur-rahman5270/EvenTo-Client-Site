import { Typography, Container, Box, Button } from '@mui/material';
import { CCarousel, CCarouselItem } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

import b1 from '../../../assets/banner/ONI_HASAN_KV_1200x630.png';
import b2 from '../../../assets/banner/mentalist_-2_Cover_1200_x_630.png';
import b3 from '../../../assets/banner/national-iq-1.jpeg';

const slides = [
    { img: b1, alt: 'Oni Hasan book cover' },
    { img: b2, alt: 'Mentalist book cover' },
    { img: b3, alt: 'National IQ test banner' },
];

const HomeBanner = () => {
    return (
        <Box className="lg:px-28 pt-20 lg:pt-4" aria-label="Featured content">
            <Container maxWidth="xl">
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={3}
                    alignItems="center"
                >
                    {/* Carousel Section */}
                    <Box flex={1} minWidth={0}>
                        <CCarousel
                            indicators
                            transition="crossfade"
                            controls={false}
                            interval={2000}
                            wrap={true}
                            pause="hover"
                        >
                            {slides.map((slide, index) => (
                                <CCarouselItem key={`banner-${index}`}>
                                    <Box position="relative" height={{ lg: 450 }} width="100%">
                                        <img
                                            src={slide.img}
                                            alt={slide.alt}
                                            className="object-cover w-full h-full rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/fallback-banner.jpg';
                                            }}
                                        />
                                    </Box>
                                </CCarouselItem>
                            ))}
                        </CCarousel>
                    </Box>

                    {/* Event Pass Section with Video Background */}
                    <Box
                        flexBasis={{ md: '400px' }}
                        p={4}
                        borderRadius={2}
                        height={{ xs: 'auto', lg: 450 }}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        position="relative"
                        overflow="hidden"
                        sx={{
                            color: 'common.white',
                            zIndex: 1,
                        }}
                    >
                        {/* Video Background */}
                        <Box
                            component="video"
                            src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/video/home_ad.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: -2,
                            }}
                        />
                        {/* Overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                zIndex: -1,
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                            }}
                        >
                            Get Your Desired Event Pass!
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                            Secure your spot at exclusive events with our premium passes. Limited availability!
                        </Typography>
                        <Box
                            display="flex"
                            gap={2}
                            flexDirection={{ xs: 'column', sm: 'row' }}
                        >
                            <Button
                                variant="outlined"
                                size="medium"
                                fullWidth
                                sx={{
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    color: 'common.white',
                                    borderColor: 'common.white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                View Events
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeBanner;
