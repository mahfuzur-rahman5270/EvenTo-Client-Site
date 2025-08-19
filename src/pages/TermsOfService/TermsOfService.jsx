import { Box, Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';

const TermsOfService = () => {

    return (
        <Box>
            <Helmet>
                <title>Terms of Service - Evento</title>
            </Helmet>
            <SectionTitle
                title="Terms of Service"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'Terms of Service', href: '/terms' }
                ]}
            />
            <Box sx={{ minHeight: '100vh', py: { xs: 2, lg: 10 }, px: { xs: 0, md: 14 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ '& h6': { mt: 3, mb: 3, fontWeight: 700, color: 'black' } }}>
                        <Typography variant="h6">1. Acceptance of Terms</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            By accessing or using Evento ("Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you and Evento. If you do not agree with any part of these Terms, you must not access or use the Service.
                        </Typography>

                        <Typography variant="h6">2. Eligibility</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            To use the Service, you must be at least 18 years old or have the consent of a parent or legal guardian. By using the Service, you represent and warrant that you meet these eligibility requirements.
                        </Typography>

                        <Typography variant="h6">3. User Accounts</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information as needed. You are responsible for safeguarding your account credentials and notifying us immediately at <strong>support@ Evento.com</strong> of any unauthorized use or security breach.
                        </Typography>

                        <Typography variant="h6">4. Content Ownership and License</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            All course materials, videos, documents, and other content provided through the Service ("Content") are owned by Evento or its licensors. Upon purchase or subscription, you are granted a limited, non-exclusive, non-transferable license to access and use the Content for personal, non-commercial purposes only. You may not reproduce, distribute, or create derivative works from the Content without express written permission.
                        </Typography>

                        <Typography variant="h6">6. Prohibited Conduct</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            You agree not to engage in any of the following activities:
                        </Typography>
                        <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                            <li>Sharing login credentials with others.</li>
                            <li>Redistributing, selling, or sublicensing Content.</li>
                            <li>Using automated systems, bots, or scripts to access the Service.</li>
                            <li>Interfering with or disrupting the Service’s operations.</li>
                            <li>Engaging in any activity that violates applicable laws or regulations.</li>
                        </Typography>

                        <Typography variant="h6">6. Payments and Renewals</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Subscription fees are billed in advance on a recurring basis. By providing a payment method, you authorize Evento to charge the applicable fees for the subscription term until you cancel. Cancellation and refund policies are outlined in our Refund Policy, accessible at <strong>billing@ Evento.com</strong>.
                        </Typography>

                        <Typography variant="h6">7. Modifications to the Service</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Evento reserves the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will not be liable for any losses or damages resulting from such changes.
                        </Typography>

                        <Typography variant="h6">8. Modifications to Terms</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We may update these Terms at our discretion. Significant changes will be communicated via email or through notifications within the Service. Your continued use of the Service after such changes constitutes your acceptance of the revised Terms.
                        </Typography>

                        <Typography variant="h6">9. Termination</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We may suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users or Evento. Upon termination, your right to access the Service and Content will cease immediately.
                        </Typography>

                        <Typography variant="h6">10. Limitation of Liability</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            To the fullest extent permitted by law, Evento shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability for any claim shall not exceed the amount you paid to us in the six months preceding the claim.
                        </Typography>

                        <Typography variant="h6">11. Indemnification</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            You agree to indemnify and hold harmless Evento, its affiliates, and their respective officers, directors, and employees from any claims, damages, or losses arising from your violation of these Terms or your use of the Service.
                        </Typography>

                        <Typography variant="h6">12. Governing Law</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law principles. Any legal disputes arising from these Terms shall be resolved exclusively in the courts of Dhaka, Bangladesh.
                        </Typography>

                        <Typography variant="h6">13. Intellectual Property</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            All trademarks, logos, and service marks displayed on the Service are the property of Evento or third parties. You are not permitted to use these marks without prior written consent from the respective owners.
                        </Typography>

                        <Typography variant="h6">14. Privacy Policy</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Your use of the Service is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information. Please review it at <strong>info@ Evento.com</strong> for more details.
                        </Typography>

                        <Typography variant="h6">16. Third-Party Links</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            The Service may contain links to third-party websites or services not owned or controlled by Evento. We are not responsible for the content, privacy policies, or practices of these third parties.
                        </Typography>

                        <Typography variant="h6">16. Force Majeure</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Evento shall not be liable for any failure to perform its obligations under these Terms due to events beyond our reasonable control, including but not limited to natural disasters, wars, or governmental actions.
                        </Typography>

                        <Typography variant="h6">17. Contact Information</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            If you have any questions or concerns about these Terms, please contact our legal team at:
                        </Typography>
                        <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                            <li>Email: <strong>legal@ Evento.com</strong></li>
                            <li>General Inquiries: <strong>info@ Evento.com</strong></li>
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We are committed to addressing your inquiries promptly and professionally.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default TermsOfService;