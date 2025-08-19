import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Paper, List, ListItemButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';

const GradientButton = styled(Button)(() => ({
    background: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    textTransform: 'none',
    padding: '10px 20px',
    fontWeight: 500,
    '&:hover': {
        background: 'oklch(52.7% 0.154 150.069)',
    },
}));

const Faqs = () => {
    const [expandedCategories, setExpandedCategories] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
    const [activeCategory, setActiveCategory] = useState(0);

    const faqCategories = [
        {
            name: 'Buying Product',
            questions: [
                { question: 'How does it work?', answer: 'Our platform offers interactive online courses...' },
                { question: 'Do I need a designer to use Evento?', answer: 'No, Evento provides pre-designed templates...' },
                { question: 'What do I need to do to start selling?', answer: 'To start selling, create an account...' },
                { question: 'What happens when I receive an order?', answer: "When you receive an order, you'll be notified..." },
            ],
        },
        {
            name: 'General Questions',
            questions: [
                { question: 'How does Evento work?', answer: 'Evento provides a comprehensive learning platform...' },
                { question: 'Do I need technical skills to use Evento?', answer: 'No technical skills are required...' },
                { question: 'What types of courses can I create?', answer: 'You can create courses on any topic...' },
                { question: 'How do I get paid for my courses?', answer: 'We handle all payments and distribute earnings...' },
            ],
        },
        {
            name: 'Payments Questions',
            questions: [
                { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards...' },
                { question: 'When will I receive my payment?', answer: 'Payments are processed monthly...' },
                { question: 'Are there any fees?', answer: 'Evento charges a small percentage...' },
                { question: 'Can I offer discounts or coupons?', answer: 'Yes, you can create discount codes...' },
            ],
        },
        {
            name: 'Support Questions',
            questions: [
                { question: 'How do I contact support?', answer: 'You can reach our support team 24/7...' },
                { question: "What's your refund policy?", answer: 'We offer a 30-day money-back guarantee...' },
                { question: 'Do you offer technical support?', answer: 'Yes, our technical support team is available...' },
                { question: 'How do I report a problem with a course?', answer: 'You can report any issues with a course...' },
            ],
        },
    ];

    const gradientText = {
        background: '#16A34A',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 600,
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = faqCategories.map((cat) => {
                const el = document.getElementById(cat.name.replace(/\s+/g, '-').toLowerCase());
                return { el, top: el?.getBoundingClientRect().top, id: cat.name.replace(/\s+/g, '-').toLowerCase() };
            });

            for (let i = 0; i < sections.length; i++) {
                if (sections[i].top && sections[i].top <= 100) {
                    setActiveCategory(i);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAccordionChange = (catIdx, qIdx) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [catIdx]: prev[catIdx] === qIdx ? null : qIdx,
        }));
    };

    return (
        <Box>
            <SectionTitle
                title="FAQs"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'FAQs', href: '/faqs' },
                ]}
            />
            <Helmet>
                <title>FAQs - Evento</title>
                <meta name="description" content="Browse our wide range of courses..." />
            </Helmet>

            <Box sx={{ px: { xs: 2, md: 17.5 }, mb: 10 }}>
                <Grid container spacing={4} sx={{ my: 5 }}>
                    <Grid item md={4} xs={12}>
                        <Paper elevation={1} sx={{ position: 'sticky', top: 100, p: 3 }}>
                            <Typography variant="h6" sx={gradientText} gutterBottom>
                                FAQ Categories
                            </Typography>
                            <List>
                                {faqCategories.map((cat, idx) => (
                                    <ListItemButton
                                        key={idx}
                                        selected={activeCategory === idx}
                                        onClick={() => {
                                            scrollToSection(cat.name.replace(/\s+/g, '-').toLowerCase());
                                            setActiveCategory(idx);
                                        }}
                                        sx={{ fontWeight: activeCategory === idx ? 600 : 500 }}
                                    >
                                        {cat.name}
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item md={8} xs={12}>
                        {faqCategories.map((cat, catIdx) => (
                            <Box id={cat.name.replace(/\s+/g, '-').toLowerCase()} key={catIdx} mb={6}>
                                <Typography variant="h6" sx={{ ...gradientText, mb: 2 }}>{cat.name}</Typography>
                                {cat.questions.map((q, qIdx) => (
                                    <Accordion
                                        key={qIdx}
                                        expanded={expandedCategories[catIdx] === qIdx}
                                        onChange={() => handleAccordionChange(catIdx, qIdx)}
                                        sx={{ mb: 1, boxShadow: 0.5 }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography sx={{ fontWeight: 500 }}>{q.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography color="text.secondary">{q.answer}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        ))}

                        <Box textAlign="center" mt={10}>
                            <Typography variant="h5" sx={gradientText} gutterBottom>
                                Have Question? Get in touch!
                            </Typography>
                            <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                                Discover a world of knowledge and opportunities with Evento to pursue a new career.
                            </Typography>
                            <Box mt={4}>
                                <GradientButton href="/contact-us" variant="contained">
                                    Contact us
                                </GradientButton>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Faqs;
