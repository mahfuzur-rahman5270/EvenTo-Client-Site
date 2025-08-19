import { Box, Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';

const RefundPolicy = () => {
    return (
        <Box>
            <Helmet>
                <title>Refund Policy - Evento</title>
            </Helmet>
            <SectionTitle
                title="Refund Policy"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'Refund Policy', href: '/refund-policy' }
                ]}
            />
            <Box sx={{ minHeight: '100vh', py: { xs: 2, lg: 10 }, px: { xs: 0, md: 14 } }}>
                <Container maxWidth="xl">
                    <Box sx={{ '& h6': { mt: 3, mb: 3, fontWeight: 700, color: 'black' } }}>
                        <Typography variant="h6">1. Overview</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            At Evento, we strive to deliver exceptional value through our digital products and subscription services. Our Refund Policy is designed to be fair, transparent, and compliant with applicable consumer protection laws. Please review the following terms carefully to understand your rights and our refund procedures.
                        </Typography>

                        <Typography variant="h6">2. Digital Products</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Our digital products, including online courses, e-books, and other downloadable content, are delivered instantly upon purchase. Due to the nature of digital goods, refunds are generally not provided once the product has been accessed or downloaded. However, if you have not accessed the content and submit a refund request within 14 days of purchase, we may, at our sole discretion, issue a full refund. To initiate a refund request, please contact our billing team at <strong>billing@ Evento.com</strong>.
                        </Typography>

                        <Typography variant="h6">3. Subscription Services</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Subscriptions to our services can be canceled at any time through your account settings or by contacting our support team. Please note that we do not offer partial or pro-rated refunds for unused portions of a subscription period. If you cancel within 48 hours of your most recent charge and have not utilized the service during that period, you may be eligible for a full or partial refund, subject to review. For assistance with cancellations, reach out to <strong>support@ Evento.com</strong>.
                        </Typography>

                        <Typography variant="h6">4. Technical Issues</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We are committed to ensuring our services are accessible and functional. If you experience technical difficulties that prevent you from using our products or services, please contact our support team immediately at <strong>support@ Evento.com</strong>. Our team will work diligently to resolve the issue. Refunds will only be considered if technical support cannot resolve the problem after reasonable efforts, and the issue significantly impairs your ability to use the service.
                        </Typography>

                        <Typography variant="h6">5. Refund Processing</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Approved refunds will be processed within 7–10 business days from the date of approval. The refunded amount will be credited to the original payment method used for the purchase. Please note that processing times may vary depending on your bank, credit card issuer, or payment provider. If you do not see the refund within this timeframe, please contact us at <strong>billing@ Evento.com</strong> for further assistance.
                        </Typography>

                        <Typography variant="h6">6. Exceptions and Limitations</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            We reserve the right to deny refund requests under specific circumstances, including but not limited to:
                        </Typography>
                        <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                            <li>Evidence of account abuse, fraud, or violations of our Terms of Service.</li>
                            <li>Accessing or downloading significant portions of digital content prior to requesting a refund.</li>
                            <li>Repeated refund requests from the same user or account.</li>
                            <li>Failure to provide sufficient evidence of a valid refund claim.</li>
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            These policies are in place to maintain a fair and sustainable platform for all users.
                        </Typography>

                        <Typography variant="h6">7. Chargebacks and Disputes</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Initiating a chargeback or payment dispute without first contacting our support team may lead to the suspension or termination of your account. We strongly encourage you to reach out to us directly at <strong>billing@ Evento.com</strong> to resolve any issues. Our team is dedicated to addressing your concerns promptly and fairly to avoid unnecessary disputes.
                        </Typography>

                        <Typography variant="h6">8. Consumer Rights</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            This Refund Policy does not affect your statutory rights under applicable consumer protection laws. If you are entitled to a refund or other remedies under such laws, please contact us at <strong>support@ Evento.com</strong> to discuss your options. We are committed to complying with all legal obligations and ensuring customer satisfaction.
                        </Typography>

                        <Typography variant="h6">9. Contact Information</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            For any questions, concerns, or refund requests related to this Refund Policy, please reach out to our dedicated billing and support teams:
                        </Typography>
                        <Typography variant="body1" component="ul" sx={{ pl: 4, mb: 3, color: 'text.secondary' }}>
                            <li>Billing Inquiries: <strong>billing@ Evento.com</strong></li>
                            <li>Technical Support: <strong>support@ Evento.com</strong></li>
                            <li>General Inquiries: <strong>info@ Evento.com</strong></li>
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Our team is available to assist you and ensure a seamless experience with Evento.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default RefundPolicy;