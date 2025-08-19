import moment from "moment";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const DashboardFooter = () => {
    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                boxShadow: 1
            }}
        >
            <Typography
                variant="body1"
                align="center"
                sx={{ fontSize: '16px' }}
            >
                © {moment().format('YYYY')}{" "}
                <Link
                    to="/"
                    style={{
                        color: '#5a3ae4',
                        textDecoration: 'none'
                    }}
                >
                    Evento
                </Link>{" "}
                All rights reserved
            </Typography>
        </Box>
    );
};

export default DashboardFooter;