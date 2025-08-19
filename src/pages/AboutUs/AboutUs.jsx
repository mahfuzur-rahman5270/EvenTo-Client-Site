import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';
import { Container } from '@mui/material';
import banner from '../../assets/banner/about-DQN8xJg0.jpg'
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';
import { Helmet } from 'react-helmet';
import Newsletter from '../Home/Newsletter/Newsletter';

const AboutUs = () => {
    const [open, setOpen] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
        setVideoLoading(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleVideoLoad = () => {
        setVideoLoading(false);
    };

    return (
        <div>
            <SectionTitle
                title="About"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'About', href: '/aboutus' },
                ]}
            />
            <Helmet>
                <title>About - Evento</title>
                <meta name="description" content="Browse our wide range of courses to enhance your skills and knowledge." />
            </Helmet>
            <Container>
                <section className="relative py-3 md:py-24">
                    <div className="container mx-auto lg:mt-20 mt-8">
                        <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-8">
                            <div className="md:col-span-5">
                                <div className="relative">
                                    <img
                                        className="rounded-xl shadow-md object-cover w-full h-auto"
                                        alt="Evento real estate platform overview"
                                        src={banner}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.button
                                            onClick={handleClickOpen}
                                            className="size-20 rounded-full shadow-md  flex items-center justify-center bg-white  text-green-600 hover:text-green-700 transition-all hover:scale-110 cursor-pointer group"
                                            aria-label="Watch our property tour video"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <polygon points="5 3 19 12 5 21 5 3" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-7">
                                <div className="lg:ml-4">
                                    <h2 className="mb-6 md:text-3xl text-2xl lg:leading-normal leading-normal font-semibold">
                                        Efficiency. Transparency. Control.
                                    </h2>
                                    <p className="text-slate-400 max-w-xl">
                                        Evento developed a platform for the Real Estate marketplace that allows buyers and sellers to easily execute a transaction on their own. The platform drives efficiency, cost transparency, and control into the hands of the consumers. Evento is Real Estate Redefined.
                                    </p>
                                    <div className="mt-4">
                                        <a
                                            className="inline-block bg-green-600 hover:bg-green-700 text-white rounded-md px-6 py-2 mt-3 transition-colors duration-300"
                                            href="/aboutus"
                                        >
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto mt-16 md:mt-24">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900  mb-4">
                                How It Works
                            </h3>
                            <p className="text-slate-500 ">
                                A great platform to buy, sell and rent your properties without any agent or commissions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="group relative p-6 md:p-8">
                                <div className="relative mb-6">
                                    <svg className="w-24 h-24 mx-auto text-green-600/10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-green-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900  mb-3 text-center">
                                    Evaluate Property
                                </h4>
                                <p className="text-slate-500  text-center">
                                    Get accurate property valuations with our advanced algorithms and market analysis tools.
                                </p>
                            </div>

                            <div className="group relative p-6 md:p-8">
                                <div className="relative mb-6">
                                    <svg className="w-24 h-24 mx-auto text-green-600/10 " fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-green-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900  mb-3 text-center">
                                    Meeting with Agent
                                </h4>
                                <p className="text-slate-500  text-center">
                                    Connect directly with verified professionals for personalized guidance when you need it.
                                </p>
                            </div>

                            <div className="group relative p-6 md:p-8">
                                <div className="relative mb-6">
                                    <svg className="w-24 h-24 mx-auto text-green-600/10 " fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-green-600 da" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900  mb-3 text-center">
                                    Close the Deal
                                </h4>
                                <p className="text-slate-500  text-center">
                                    Complete transactions securely with our streamlined digital closing process.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Newsletter />
                </section>

                {/* Video Dialog */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="lg"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        },
                    }}
                    PaperProps={{
                        component: motion.div,
                        initial: { opacity: 0, scale: 0.9 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.9 },
                        transition: { duration: 0.2 }
                    }}
                >
                    <DialogContent sx={{ p: 0, position: 'relative', paddingTop: '56.25%' }}>
                        <IconButton
                            aria-label="close video"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                },
                                zIndex: 10,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {videoLoading && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    zIndex: 2
                                }}
                            >
                                <CircularProgress color="secondary" />
                            </div>
                        )}

                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/UVeDpUey5Es?si=vDSuTDiaMO9MH-AY&autoplay=1"
                            title="About Evento Platform"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                            onLoad={handleVideoLoad}
                            loading="eager"
                        />
                    </DialogContent>
                </Dialog>

            </Container>
        </div>
    );
};

export default AboutUs;