import React, { useEffect, useState } from 'react';
import { Alert, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function Profile() {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = async () => {
		setError('');
		try {
			const authToken = localStorage.getItem('authToken');
			const response = await axios.get('http://localhost:3000/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});

			if (response.status === 200) {
				setName(response.data.name);
				setEmail(response.data.email);
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
	};

	return (
		<>
      <Header />
      <Sidebar/>
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f5f5',
          }}
      >
        <Paper elevation={3} sx={{ padding: '40px' }}>
          <h1>Name: {name}</h1>
          <br />
          <h1>Email: {email}</h1>
          <br />
          {error === '' ? null : <Alert severity="error">{error}</Alert>}
        </Paper>
			</Box>
		</>
	);
}

export default Profile;
