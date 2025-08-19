import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import MainHeader from './MainHeader';


function HideOnScroll(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

function HeaderScroll(props) {
    return (
        <React.Fragment>
            <HideOnScroll {...props}>
                <AppBar
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 1,
                        p: 0
                    }}>
                    <MainHeader />
                </AppBar>
            </HideOnScroll>
        </React.Fragment>
    );
}

export default HeaderScroll;