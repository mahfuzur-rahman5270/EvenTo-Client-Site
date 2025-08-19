import { memo } from 'react';
import { CirclesWithBar } from 'react-loader-spinner';
import { Box, Typography, keyframes } from '@mui/material';

// Animation definitions
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.8; transform: scale(0.98); }
`;

const AnimatedCustomLoader = memo(() => {
  const gradient = '#16A34A';
  const accentColor = '#405aff';
  const secondaryColor = '#ff37f2';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(6px)',
        zIndex: 1300,
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      {/* Enhanced Loader with Gradient Border */}
      <Box
        sx={{
          position: 'relative',
          width: 100,
          height: 100,
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      >
        {/* Gradient Border Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: secondaryColor,
            borderRightColor: accentColor,
            animation: `${spin} 1.2s linear infinite`,
          }}
        />
        
        {/* Optimized CirclesWithBar with memoization */}
        <CirclesWithBar
          height={60}
          width={60}
          color={accentColor}
          outerCircleColor={accentColor}
          innerCircleColor={secondaryColor}
          barColor={secondaryColor}
          ariaLabel="loading-indicator"
          wrapperStyle={{ position: 'relative' }}
        />
      </Box>

      {/* Branding with Gradient Text */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: 700,
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          opacity: 0,
          animation: `${fadeIn} 0.6s 0.3s forwards`,
          letterSpacing: '0.03em',
        }}
      >
        Evento
      </Typography>

      {/* Subtle Status Text */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          fontSize: '0.9rem',
          fontWeight: 500,
          opacity: 0,
          animation: `${fadeIn} 0.6s 0.6s forwards`,
          maxWidth: 280,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        Preparing your personalized learning environment...
      </Typography>

      {/* Progress Indicator (Optional) */}
      <Box
        sx={{
          width: 120,
          height: 4,
          backgroundColor: 'divider',
          borderRadius: 2,
          mt: 3,
          overflow: 'hidden',
          opacity: 0,
          animation: `${fadeIn} 0.6s 0.9s forwards`,
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: '30%',
            background: gradient,
            borderRadius: 2,
            animation: `${keyframes`
              0% { transform: translateX(-100%); }
              100% { transform: translateX(330%); }
            `} 2s infinite ease-in-out`,
          }}
        />
      </Box>
    </Box>
  );
});

AnimatedCustomLoader.displayName = 'AnimatedCustomLoader';

export default AnimatedCustomLoader;