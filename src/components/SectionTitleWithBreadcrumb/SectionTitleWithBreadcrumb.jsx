import { Box, Container, Typography, Link, SvgIcon } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import banner from '../../assets/banner/01-CV1OAy5p.jpg';

// ChevronRightIcon as an SVG component
const ChevronRightIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2" />
  </SvgIcon>
);

const SectionTitle = ({ title, breadcrumbs, paddingY, titleVariant }) => {
  return (
    <Box
      sx={{
        px: { xs: 0, md: 13 },
        py: paddingY || { xs: 2, lg: 3 },
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: { lg: 'center' },
        backgroundAttachment: { lg: 'fixed' },
        width: '100%',
        objectFit: 'cover',
        height: { xs: '200px', md: '300px' },
        backgroundColor: 'grey.900', // Fallback color
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Section Title */}
          <Typography
            variant={titleVariant || 'h3'}
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
              lineHeight: 1.2,
              color: '#fff', // White text
            }}
          >
            {title}
          </Typography>

          {/* Breadcrumb */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            {breadcrumbs.map((crumb, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {crumb.href ? (
                  <Link
                    component={RouterLink}
                    to={crumb.href}
                    sx={{
                      color: crumb.active ? '#fff' : 'rgba(255, 255, 255, 0.7)', // White for active, lighter for inactive
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#fff',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                    aria-current={crumb.active ? 'page' : undefined}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <Typography
                    sx={{
                      color: crumb.active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                    }}
                    aria-current={crumb.active ? 'page' : undefined}
                  >
                    {crumb.label}
                  </Typography>
                )}

                {index < breadcrumbs.length - 1 && (
                  <ChevronRightIcon
                    sx={{
                      width: 16,
                      height: 16,
                      color: '#fff', // White icon
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// PropTypes for type checking
SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
  paddingY: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  titleVariant: PropTypes.string,
};

// Default props
SectionTitle.defaultProps = {
  breadcrumbs: [],
  paddingY: { xs: 2, lg: 3 },
  titleVariant: 'h3',
};

export default SectionTitle;