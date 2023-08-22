import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

function ErrorPage() {
	return (
		<Container maxWidth={false} sx={{ bgcolor: 'primary.main', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			<Typography variant="h1" sx={{ textAlign: 'center', color: 'secondary.main' }}>
				404 Error.
			</Typography>
			<Box mt={3}>
                <a href='/' style={{textDecoration:'none'}}><Button variant="contained" color="primary">Home Page</Button></a>
            </Box>
		</Container>
	);
}

export default ErrorPage;
