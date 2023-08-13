import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, CardHeader } from '@mui/material';
import { User } from '../../datastructs'

const ProfileCard = ({ userData = new User() }) => {

    return (
		<Card
			sx={{
				boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
				borderRadius: '8px',
				backgroundColor: 'white',
				padding: '16px',
				display: 'flex',
				flexDirection: 'column',
				color: 'text.grey',
			}}
		>
			<CardHeader title="Profile" sx={{ borderBottom: '1px solid #f0f0f0', color: 'primary.main' }} />
			<CardContent>
				<Typography variant="h6">Name: {userData.name}</Typography>
				<Typography variant="h6" sx={{ mt: 1 }}>
					Email: {userData.email}
				</Typography>
				<Typography variant="h6" sx={{ mt: 1 }}>
					Score: {userData.score}
				</Typography>
			</CardContent>
			<Box sx={{ flexGrow: 1 }} />
			<Box display="flex" alignItems="center">
				<Typography variant="subtitle2" sx={{ color: '#6c757d' }}>
					Date Created: {userData.createdAt}
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
			</Box>
		</Card>
	);
};

export default ProfileCard;
