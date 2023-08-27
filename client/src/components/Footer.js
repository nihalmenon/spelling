import React from 'react';
import { Link, Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 1, backgroundColor: 'primary.main', color: 'white', padding: 2, textAlign: 'center', width: '100%' }}> 
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} <Link href="https://nihalmenon.com" sx={{color: 'white', textDecoration: 'underline'}}>Nihal Menon</Link>. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
