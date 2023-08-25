import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, IconButton} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from '../requests/axios'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import toast from 'react-hot-toast';

function Header( { handleDrawerToggle, drawerWidth } ) {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken')

  const handleLogout = async () => {
    try {
        const response = await axios.post('/users/logout', null, {
            headers: {
            'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            localStorage.removeItem('authToken')
            navigate('/login')
            toast.success('Logged out!')
        }
    } catch (e) {
        console.log(e)
        navigate('/error')
    }
  };

  return (
    <Box display='flex'>
      <AppBar position="fixed"
        sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "secondary.main",
            color: "text.grey"
        }}
      >
        <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          <Typography textAlign={"center"} variant="h2" component="div" sx={{ flexGrow: 1, color: 'primary.main' }} >
            Spel.
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ marginRight: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', '&:hover': { color: 'text.primary', bgcolor: 'white' }}}>
              <LogoutIcon sx={{ fontSize: '17px'}} />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
