import React, { useState, useEffect } from 'react';
import { Paper, Box, IconButton, TextField, Button } from '@mui/material';
import { VolumeUp, CheckCircleOutline } from '@mui/icons-material';


function Play() {
    const [loading, setLoading] = useState(false)

	useEffect(() => {
        
    }, [])

    const sayWord = (e) => {
        console.log('word')
    }

	return (
        loading ? null :   
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				bgcolor: '#f5f5f5',
			}}
		>
			<Paper sx={{ padding: '20px', width: '300px' }}>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<IconButton sx={{ mx: 'auto' }} onClick={sayWord}>
						<VolumeUp />
					</IconButton>
				</Box>
				<TextField label="Enter your text" fullWidth sx={{ my: 2 }} />
				<Button variant="contained" startIcon={<CheckCircleOutline />} fullWidth>
					Submit
				</Button>
			</Paper>
		</Box>
	);
};

export default Play;
