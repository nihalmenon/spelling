import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box } from '@mui/material';

const AppLayout = () => {
    const drawerWidth = 240
	const mobileWidth = 768
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [mobileOpen, setMobileOpen] = useState(false)

    const isMobile = () => {
		return windowWidth < mobileWidth
	}

	useEffect(() => {
		const handleResize = () => {
		  setWindowWidth(window.innerWidth);
		};
	
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);


    const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth}/>
		<Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
        <Box sx={{ flexGrow: 1, overflow: 'auto', marginTop: '64px', bgcolor: "background.default", ...(isMobile() ? {} : { marginLeft: drawerWidth + 'px' }) }}>
          <Outlet /> 
        </Box>
    </Box>
  );
};

export default AppLayout;
