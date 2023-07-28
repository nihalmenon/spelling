import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import LogoutIcon from '@mui/icons-material/Logout';

function Header() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken')

  const handleLogout = async () => {
    try {
        const response = await axios.post('http://localhost:3000/users/logout', null, {
            headers: {
            'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            localStorage.removeItem('authToken')
            navigate('/')
        }
    } catch (e) {
        console.log(e)
        navigate('/error')
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Spelling
        </Typography>
        <Button color="inherit" onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Logout
        <Box sx={{ marginLeft: '4px', paddingTop: '7px'}}>
          <LogoutIcon sx={{ fontSize: '17px'}} />
        </Box>
      </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
