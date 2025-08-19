import { Box, Container, Grid, Skeleton } from "@mui/material";



const DataLoader = () => {

    return (
        <div>
            <Box sx={{ px: { xs: 0, md: 14 }, py: 10, bgcolor: 'background.default' }}>
                <Container maxWidth='xl'>
                    < Grid container spacing={2}>
                        {[...Array(4)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '12px' }} />
                                <Box sx={{ pt: 0.5 }}>
                                    <Skeleton />
                                    <Skeleton width="60%" />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default DataLoader;
