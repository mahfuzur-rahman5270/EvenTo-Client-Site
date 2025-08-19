import { Box, Container, Typography, } from '@mui/material';
import { Helmet } from 'react-helmet';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';


const CookiesPolicy = () => {

    return (
        <Box>
            <Helmet>
                <title>Cookies Policy - Evento</title>
            </Helmet>
            <SectionTitle
                title="Cookies Policy"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'Cookies Policy', href: '/cookies' }
                ]}
            />
            <Box  sx={{ minHeight: '100vh', py: { xs: 2, lg: 10 }, px: { xs: 0, md: 14 } }}>
                <Container maxWidth="xl">
                    <Box>
                        <Box sx={{ '& h6': { mt: 3, mb: 3, fontWeight: 700, color: 'black' } }}>
                            <Typography variant="h6">1. Introduction</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                At Evento, we use cookies and similar technologies to enhance your experience on our website ("Service"). This Cookies Policy explains what cookies are, how we use them, and how you can manage your cookie preferences. By using our Service, you consent to our use of cookies as described herein.
                            </Typography>

                            <Typography variant="h6">2. What Are Cookies?</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Cookies are small text files placed on your device (computer, tablet, or smartphone) when you visit a website. They store information about your browsing activities, enabling the website to remember your actions and preferences over time, making your experience more efficient and personalized.
                            </Typography>

                            <Typography variant="h6">3. Why We Use Cookies</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                We use cookies to:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li>Authenticate users and maintain secure sessions.</li>
                                <li>Remember your preferences and settings.</li>
                                <li>Analyze website traffic and user behavior to improve our Service.</li>
                                <li>Deliver personalized content and recommendations.</li>
                                <li>Support security and fraud prevention measures.</li>
                            </Typography>

                            <Typography variant="h6">4. Types of Cookies We Use</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                We use the following categories of cookies:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li>
                                    <strong>Essential Cookies:</strong> Required for core website functionality, such as navigation and access to secure areas. These cannot be disabled.
                                </li>
                                <li>
                                    <strong>Performance Cookies:</strong> Collect anonymous data on how visitors use our site to help us optimize performance.
                                </li>
                                <li>
                                    <strong>Functional Cookies:</strong> Enable enhanced features, such as remembering your language or region preferences.
                                </li>
                                <li>
                                    <strong>Targeting Cookies:</strong> Set by advertising partners to deliver ads relevant to your interests.
                                </li>
                            </Typography>

                            <Typography variant="h6">5. First-Party and Third-Party Cookies</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                First-party cookies are set directly by Evento, while third-party cookies are set by external services we use, such as analytics providers or payment processors. Both types help us provide a seamless user experience.
                            </Typography>

                            <Typography variant="h6">6. Third-Party Cookies</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                We use third-party services that may set cookies, including:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li><strong>Google Analytics:</strong> To analyze site usage and performance anonymously.</li>
                                <li><strong>Payment Processors:</strong> To facilitate secure transactions during checkout.</li>
                                <li><strong>Social Media Platforms:</strong> To enable sharing features and track engagement.</li>
                            </Typography>

                            <Typography variant="h6">7. Other Tracking Technologies</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                In addition to cookies, we may use technologies like web beacons, pixel tags, or local storage to collect information about your interactions with our Service. These help us understand user behavior and improve our offerings.
                            </Typography>

                            <Typography variant="h6">8. Cookie Duration</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Cookies may be:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li><strong>Session Cookies:</strong> Temporary and deleted when you close your browser.</li>
                                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until deleted.</li>
                            </Typography>

                            <Typography variant="h6">9. Managing Cookies</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                You can control cookies through:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li>Our cookie consent banner, where you can adjust preferences (except for essential cookies).</li>
                                <li>Your browser settings, which allow you to block or delete cookies.</li>
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Note that disabling essential cookies may impair website functionality. For guidance, visit your browser’s help section.
                            </Typography>

                            <Typography variant="h6">10. Do Not Track Signals</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Some browsers offer a “Do Not Track” (DNT) feature. As there is no standard for DNT signals, our Service does not currently respond to them. You can manage tracking through our cookie consent tools or browser settings.
                            </Typography>

                            <Typography variant="h6">11. Cookies and Privacy</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Cookies may collect personal information, such as your IP address or browsing behavior. Our use of this data is governed by our Privacy Policy, available at <strong>privacy@shamzacademy.com</strong>.
                            </Typography>

                            <Typography variant="h6">12. Children’s Privacy</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Our Service is not intended for users under 13. We do not knowingly collect personal information from children. If you believe a child has provided data, contact us at <strong>privacy@shamzacademy.com</strong>.
                            </Typography>

                            <Typography variant="h6">13. International Data Transfers</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                If you access our Service from outside Bangladesh, cookies may involve data transfers to servers in other countries. We ensure compliance with applicable data protection laws for such transfers.
                            </Typography>

                            <Typography variant="h6">14. Changes to This Policy</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                We may update this Cookies Policy to reflect changes in our practices, technology, or legal requirements. Significant updates will be communicated via our website or email. Please review this page periodically.
                            </Typography>

                            <Typography variant="h6">15. Your Rights</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                Depending on your location, you may have rights under data protection laws (e.g., GDPR or CCPA) to access, delete, or restrict the use of your personal data collected via cookies. Contact us at <strong>privacy@shamzacademy.com</strong> to exercise these rights.
                            </Typography>

                            <Typography variant="h6">16. Contact Us</Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                For questions or concerns about our Cookies Policy, please reach out to:
                            </Typography>
                            <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                                <li>Email: <strong>privacy@shamzacademy.com</strong></li>
                                <li>General Inquiries: <strong>info@shamzacademy.com</strong></li>
                            </Typography>
                            <Typography variant="body1" paragraph color="text.secondary">
                                We are committed to addressing your inquiries promptly and ensuring transparency in our use of cookies.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default CookiesPolicy;