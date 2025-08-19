import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import bannerFaq from '../../../assets/banner/faq.png'


const FAQSection = () => {
    const [expanded, setExpanded] = useState(0);


    const faqs = [
        {
            question: 'How does it work?',
            answer:
                'Our platform offers interactive online courses with video lessons, quizzes, and community support. Sign up, choose a course, and start learning at your own pace.',
        },
        {
            question: 'Do I need a designer to use Evento?',
            answer:
                'No, Evento provides pre-designed templates and an intuitive interface, so you can create and manage courses without design skills.',
        },
        {
            question: 'What do I need to do to start selling?',
            answer:
                'To start selling, create an account, set up your course content using our tools, and publish it on our marketplace. We handle payments and distribution.',
        },
        {
            question: 'What happens when I receive an order?',
            answer:
                "When you receive an order, you'll be notified via email and your dashboard. You can track student progress and manage payouts through your instructor portal.",
        },
    ];

    return (
        <Box sx={{ pt: { xs: 3, md: 9 }, backgroundColor: 'transparent' }}>
            <Container>
                <Grid container spacing={4} alignItems="center">
                    {/* Left Column */}
                    <Grid item xs={12} md={5}>
                        <img src={bannerFaq} alt="" />
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={7}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5" fontWeight={600}>
                                Questions & Answers
                            </Typography>
                            <Button
                                component={Link}
                                to="/faqs"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    backgroundColor: '#16A34A',
                                    '&:hover': { backgroundColor: '#13893D' },
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    borderRadius: '5px',
                                }}
                            >
                                See More
                            </Button>
                        </Box>

                        <Typography color="text.secondary" mb={2}>
                            Discover a world of knowledge and opportunities with our online education platform to pursue a new career.
                        </Typography>

                        <Box>
                            {faqs.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    expanded={expanded === index}
                                    onChange={() => setExpanded(index)}
                                    sx={{
                                        boxShadow: 0.5,
                                        borderRadius: 1,
                                        mt: index === 0 ? 0 : 2,
                                        '&:before': { display: 'none' },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: expanded === index ? '#16A34A' : 'inherit' }} />}
                                        aria-controls={`faq-content-${index}`}
                                        id={`faq-header-${index}`}
                                        sx={{
                                            backgroundColor: expanded === index ? 'grey.50' : 'transparent',
                                            color: expanded === index ? '#16A34A' : 'inherit',
                                        }}
                                    >
                                        <Typography fontWeight={500}>{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography color="text.secondary">{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default FAQSection;
