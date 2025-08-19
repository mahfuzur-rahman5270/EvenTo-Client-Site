import { Box, CircularProgress } from '@mui/material';


const RouteLoader = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    p: 3,
                }}
            >
                <CircularProgress
                    size={64}
                    thickness={4}
                    sx={{
                        color: 'success.main',
                        animationDuration: '800ms',
                        '& circle': {
                            strokeLinecap: 'round',
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

export default RouteLoader;