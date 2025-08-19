import { Container } from '@mui/material';
import SectionTitle from '../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';
import { Helmet } from 'react-helmet';
import ServiceSection from './ServiceSection';

const ServiceHome = () => {
    return (
        <div>
            <SectionTitle
                title="Services"
                bgColor="#EFF6FF"
                paddingY={3}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'Services', href: '/services' },
                ]}
            />
            <Helmet>
                <title>Services - Evento</title>
                <meta name="description" content="Browse our wide range of courses to enhance your skills and knowledge." />
            </Helmet>
            <Container>
                <ServiceSection />
            </Container>
        </div>
    );
};

export default ServiceHome;